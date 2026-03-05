import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, UpdateCommand, GetCommand, QueryCommand, BatchWriteCommand } from '@aws-sdk/lib-dynamodb'
import { v4 as uuidv4 } from 'uuid'

const dynamoClient = DynamoDBDocumentClient.from(new DynamoDBClient({}))
const TABLES = {
  REGISTRATIONS: process.env.REGISTRATIONS_TABLE || 'Dosce25-Registrations',
}

interface UpdateGroupBody {
  participationType: 'individual' | 'duo' | 'group' | 'organization'
  eventOrganization?: string
  groupMembers?: string[]
  groupId?: string
}

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'PUT, OPTIONS',
    'Content-Type': 'application/json',
  }

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' }
  }

  try {
    const registrationId = event.pathParameters?.registrationId

    if (!registrationId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: 'registrationId is required' }),
      }
    }

    const body: UpdateGroupBody = JSON.parse(event.body || '{}')
    const { participationType, eventOrganization, groupMembers } = body

    if (!participationType) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: 'participationType is required' }),
      }
    }

    // Get current registration
    const getResult = await dynamoClient.send(
      new GetCommand({
        TableName: TABLES.REGISTRATIONS,
        Key: { registrationId },
      })
    )

    if (!getResult.Item) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ message: 'Registration not found' }),
      }
    }

    const registration = getResult.Item
    const eventId = registration.eventId

    // Handle Individual type
    if (participationType === 'individual') {
      await dynamoClient.send(
        new UpdateCommand({
          TableName: TABLES.REGISTRATIONS,
          Key: { registrationId },
          UpdateExpression:
            'SET participationType = :type REMOVE groupId, groupLeaderId, groupMembers, eventOrganization',
          ExpressionAttributeValues: {
            ':type': 'individual',
          },
        })
      )

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          message: 'Updated to individual participation',
          participationType: 'individual',
        }),
      }
    }

    // Handle Organization type
    if (participationType === 'organization') {
      if (!eventOrganization) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            message: 'eventOrganization is required for organization type',
          }),
        }
      }

      // Check if groupId already exists for this organization in this event
      const queryResult = await dynamoClient.send(
        new QueryCommand({
          TableName: TABLES.REGISTRATIONS,
          IndexName: 'EventIdIndex',
          KeyConditionExpression: 'eventId = :eventId',
          FilterExpression:
            'eventOrganization = :org AND participationType = :type AND attribute_exists(groupId)',
          ExpressionAttributeValues: {
            ':eventId': eventId,
            ':org': eventOrganization,
            ':type': 'organization',
          },
          Limit: 1,
        })
      )

      let groupId: string
      if (queryResult.Items && queryResult.Items.length > 0) {
        // Join existing groupId
        groupId = queryResult.Items[0].groupId
      } else {
        // Create new groupId for this organization
        groupId = uuidv4()
      }

      await dynamoClient.send(
        new UpdateCommand({
          TableName: TABLES.REGISTRATIONS,
          Key: { registrationId },
          UpdateExpression:
            'SET participationType = :type, groupId = :groupId, eventOrganization = :org REMOVE groupLeaderId, groupMembers',
          ExpressionAttributeValues: {
            ':type': 'organization',
            ':groupId': groupId,
            ':org': eventOrganization,
          },
        })
      )

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          message: 'Updated to organization participation',
          participationType: 'organization',
          groupId,
          eventOrganization,
        }),
      }
    }

    // Handle Duo/Group type
    if (participationType === 'duo' || participationType === 'group') {
      if (!groupMembers || groupMembers.length === 0) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            message: 'groupMembers array is required for duo/group type',
          }),
        }
      }

      // Validate all groupMembers exist and have check-in
      const validationErrors: string[] = []
      for (const memberId of groupMembers) {
        const memberResult = await dynamoClient.send(
          new GetCommand({
            TableName: TABLES.REGISTRATIONS,
            Key: { registrationId: memberId },
          })
        )

        if (!memberResult.Item) {
          validationErrors.push(`Member ${memberId} not found`)
        } else if (!memberResult.Item.checkedIn) {
          validationErrors.push(
            `Member ${memberResult.Item.name || memberId} must check in first`
          )
        }
      }

      if (validationErrors.length > 0) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            message: 'Invalid group members',
            errors: validationErrors,
          }),
        }
      }

      // Create new groupId
      const groupId = body.groupId || uuidv4()

      // Update leader (current registration)
      const allMembers = [registrationId, ...groupMembers.filter((m) => m !== registrationId)]
      await dynamoClient.send(
        new UpdateCommand({
          TableName: TABLES.REGISTRATIONS,
          Key: { registrationId },
          UpdateExpression:
            'SET participationType = :type, groupId = :groupId, groupLeaderId = :leaderId, groupMembers = :members REMOVE eventOrganization',
          ExpressionAttributeValues: {
            ':type': participationType,
            ':groupId': groupId,
            ':leaderId': registrationId,
            ':members': allMembers,
          },
        })
      )

      // Update all other group members
      for (const memberId of groupMembers) {
        if (memberId !== registrationId) {
          await dynamoClient.send(
            new UpdateCommand({
              TableName: TABLES.REGISTRATIONS,
              Key: { registrationId: memberId },
              UpdateExpression:
                'SET participationType = :type, groupId = :groupId, groupLeaderId = :leaderId, groupMembers = :members REMOVE eventOrganization',
              ExpressionAttributeValues: {
                ':type': participationType,
                ':groupId': groupId,
                ':leaderId': registrationId,
                ':members': allMembers,
              },
            })
          )
        }
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          message: `Updated to ${participationType} participation`,
          participationType,
          groupId,
          groupMembers: allMembers,
          groupLeaderId: registrationId,
        }),
      }
    }

    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ message: 'Invalid participationType' }),
    }
  } catch (error: any) {
    console.error('Error:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        message: 'Internal server error',
        error: error.message,
      }),
    }
  }
}

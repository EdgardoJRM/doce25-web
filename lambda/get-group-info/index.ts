import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { DynamoDBClient, ScanCommand } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb'

const client = new DynamoDBClient({})
const dynamoClient = DynamoDBDocumentClient.from(client)

const TABLES = {
  REGISTRATIONS: process.env.REGISTRATIONS_TABLE || 'Dosce25-Registrations',
  WEIGHT_RECORDS: process.env.WEIGHT_RECORDS_TABLE || 'Dosce25-WeightRecords',
}

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json',
  }

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' }
  }

  try {
    const groupId = event.pathParameters?.groupId

    if (!groupId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: 'groupId is required' }),
      }
    }

    // Scan registrations table for this groupId
    const scanCommand = new ScanCommand({
      TableName: TABLES.REGISTRATIONS,
      FilterExpression: 'groupId = :groupId',
      ExpressionAttributeValues: {
        ':groupId': { S: groupId },
      },
    })

    const scanResult = await client.send(scanCommand)
    
    const members = (scanResult.Items || []).map(item => ({
      registrationId: item.registrationId?.S || '',
      name: item.fullName?.S || item.name?.S || '',
      email: item.email?.S || '',
      checkedIn: item.checkedIn?.BOOL || false,
    }))

    if (members.length === 0) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ message: 'Group not found' }),
      }
    }

    const firstMember = scanResult.Items![0]
    const participationType = firstMember.participationType?.S || 'group'
    const eventOrganization = firstMember.eventOrganization?.S

    // Get weight history for this group
    const weightHistoryResult = await dynamoClient.send(
      new QueryCommand({
        TableName: TABLES.WEIGHT_RECORDS,
        IndexName: 'GroupIndex',
        KeyConditionExpression: 'groupId = :groupId',
        ExpressionAttributeValues: {
          ':groupId': groupId,
        },
        ScanIndexForward: false,
      })
    )

    const weightHistory = weightHistoryResult.Items || []
    const totalWeight = weightHistory.reduce(
      (sum, record) => sum + (record.weightCollected || 0),
      0
    )

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        groupId,
        participationType,
        eventOrganization: eventOrganization || null,
        members,
        weightHistory,
        totalWeight,
        tripCount: weightHistory.length,
      }),
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

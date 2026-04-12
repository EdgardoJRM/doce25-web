import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  QueryCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb'
import { v4 as uuidv4 } from 'uuid'

const dynamoClient = DynamoDBDocumentClient.from(new DynamoDBClient({}))

const TABLES = {
  REGISTRATIONS: process.env.REGISTRATIONS_TABLE || 'Dosce25-Registrations',
  EVENTS: process.env.EVENTS_TABLE || 'Dosce25-Events',
  WEIGHT_RECORDS: process.env.WEIGHT_RECORDS_TABLE || 'Dosce25-WeightRecords',
}

interface TrashBreakdown {
  plastic?: number
  metal?: number
  glass?: number
  organic?: number
  other?: number
}

interface Body {
  eventOrganization: string
  weightCollected: number
  trashType: string
  trashBreakdown?: TrashBreakdown
  notes?: string
}

async function syncOrganizationGroupMap(
  eventId: string,
  eventOrganization: string,
  groupId: string
): Promise<void> {
  const eventResult = await dynamoClient.send(
    new GetCommand({
      TableName: TABLES.EVENTS,
      Key: { eventId },
    })
  )
  if (!eventResult.Item) return
  const map = {
    ...((eventResult.Item.organizationGroupMap as Record<string, string>) || {}),
    [eventOrganization]: groupId,
  }
  await dynamoClient.send(
    new UpdateCommand({
      TableName: TABLES.EVENTS,
      Key: { eventId },
      UpdateExpression: 'SET organizationGroupMap = :map, updatedAt = :u',
      ExpressionAttributeValues: {
        ':map': map,
        ':u': new Date().toISOString(),
      },
    })
  )
}

async function resolveOrganizationGroupId(
  eventId: string,
  eventOrganization: string
): Promise<string> {
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

  if (queryResult.Items && queryResult.Items.length > 0 && queryResult.Items[0].groupId) {
    const gid = queryResult.Items[0].groupId as string
    await syncOrganizationGroupMap(eventId, eventOrganization, gid)
    return gid
  }

  const eventResult = await dynamoClient.send(
    new GetCommand({
      TableName: TABLES.EVENTS,
      Key: { eventId },
    })
  )

  if (!eventResult.Item) {
    throw new Error('Evento no encontrado')
  }

  const existingMap =
    (eventResult.Item.organizationGroupMap as Record<string, string> | undefined) || {}
  if (existingMap[eventOrganization]) {
    return existingMap[eventOrganization]
  }

  const groupId = uuidv4()
  await syncOrganizationGroupMap(eventId, eventOrganization, groupId)
  return groupId
}

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  }

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' }
  }

  try {
    const { eventId } = event.pathParameters || {}
    if (!eventId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'eventId es requerido' }),
      }
    }

    const body: Body = JSON.parse(event.body || '{}')
    const { eventOrganization, weightCollected, trashType, trashBreakdown, notes } = body

    if (!eventOrganization || !eventOrganization.trim()) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'eventOrganization es requerido' }),
      }
    }

    const orgName = eventOrganization.trim()

    if (weightCollected === undefined || weightCollected === null) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'weightCollected es requerido' }),
      }
    }

    if (weightCollected <= 0 || weightCollected > 500) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'El peso debe estar entre 0.1 y 500 lb' }),
      }
    }

    if (!trashType) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'trashType es requerido' }),
      }
    }

    if (trashBreakdown) {
      const breakdownSum = Object.values(trashBreakdown).reduce((sum, val) => sum + (val || 0), 0)
      const maxAllowed = weightCollected * 1.1
      if (breakdownSum > maxAllowed) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            error: 'La suma del desglose no puede exceder el peso total + 10%',
            breakdownSum,
            maxAllowed,
          }),
        }
      }
    }

    const groupId = await resolveOrganizationGroupId(eventId, orgName)

    const weightRecordId = uuidv4()
    const timestamp = new Date().toISOString()

    const weightRecord: Record<string, unknown> = {
      weightRecordId,
      eventId,
      groupId,
      weightCollected,
      trashType,
      timestamp,
      registeredBy: 'staff-no-qr',
      registeredByName: orgName,
      eventOrganization: orgName,
    }

    if (trashBreakdown && Object.keys(trashBreakdown).length > 0) {
      weightRecord.trashBreakdown = trashBreakdown
    }
    if (notes && notes.trim()) {
      weightRecord.notes = notes.trim()
    }

    await dynamoClient.send(
      new PutCommand({
        TableName: TABLES.WEIGHT_RECORDS,
        Item: weightRecord,
      })
    )

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Peso registrado para la organización (sin QR de participante)',
        weightRecord,
        groupId,
      }),
    }
  } catch (error: any) {
    console.error('register-organization-weight:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Error interno del servidor',
        message: error.message,
      }),
    }
  }
}

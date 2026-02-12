import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, QueryCommand, UpdateCommand, GetCommand } from '@aws-sdk/lib-dynamodb'

const dynamoClient = DynamoDBDocumentClient.from(new DynamoDBClient({}))

const TABLES = {
  REGISTRATIONS: 'Dosce25-Registrations',
  EVENTS: 'Dosce25-Events',
}

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  }

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    }
  }

  try {
    const token = event.pathParameters?.token

    if (!token) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: 'Token is required' }),
      }
    }

    // Buscar registro por token usando GSI
    const queryResult = await dynamoClient.send(
      new QueryCommand({
        TableName: TABLES.REGISTRATIONS,
        IndexName: 'QRTokenIndex',
        KeyConditionExpression: 'qrToken = :token',
        ExpressionAttributeValues: {
          ':token': token,
        },
      })
    )

    if (!queryResult.Items || queryResult.Items.length === 0) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ 
          status: 'invalid',
          message: 'Token not found or invalid' 
        }),
      }
    }

    const registration = queryResult.Items[0]

    // Verificar si ya hizo check-in
    if (registration.checkedIn) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          status: 'already-checked',
          message: 'Already checked in',
          registration: {
            name: registration.name,
            email: registration.email,
            checkedInAt: registration.checkedInAt,
          },
        }),
      }
    }

    // Obtener información del evento
    const eventResult = await dynamoClient.send(
      new GetCommand({
        TableName: TABLES.EVENTS,
        Key: {
          eventId: registration.eventId,
        },
      })
    )

    const eventInfo = eventResult.Item

    // Marcar como check-in
    const now = new Date().toISOString()
    await dynamoClient.send(
      new UpdateCommand({
        TableName: TABLES.REGISTRATIONS,
        Key: {
          registrationId: registration.registrationId,
        },
        UpdateExpression: 'SET checkedIn = :true, checkedInAt = :now',
        ExpressionAttributeValues: {
          ':true': true,
          ':now': now,
        },
      })
    )

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        status: 'valid',
        message: 'Check-in successful',
        attendee: {
          name: registration.name,
          email: registration.email,
          eventName: eventInfo?.name || 'Evento',
          eventDate: eventInfo?.date,
          checkedInAt: now,
        },
      }),
    }
  } catch (error: any) {
    console.error('Error:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        status: 'error',
        message: 'Internal server error',
        error: error.message,
      }),
    }
  }
}


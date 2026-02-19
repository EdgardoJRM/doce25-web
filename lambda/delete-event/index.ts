import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, DeleteCommand, GetCommand } from '@aws-sdk/lib-dynamodb'

const dynamoClient = DynamoDBDocumentClient.from(new DynamoDBClient({}))

const TABLES = {
  EVENTS: 'Dosce25-Events',
}

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const headers = {
    'Access-Control-Allow-Origin': 'https://doce25.precotracks.org',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'DELETE, OPTIONS',
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
    const eventId = event.pathParameters?.eventId

    if (!eventId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: 'Event ID is required' }),
      }
    }

    // Verificar que el evento exists
    const getResult = await dynamoClient.send(
      new GetCommand({
        TableName: TABLES.EVENTS,
        Key: { eventId },
      })
    )

    if (!getResult.Item) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ message: 'Event not found' }),
      }
    }

    // Eliminar el evento
    await dynamoClient.send(
      new DeleteCommand({
        TableName: TABLES.EVENTS,
        Key: { eventId },
      })
    )

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: 'Event deleted successfully',
        eventId,
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


import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb'
import { v4 as uuidv4 } from 'uuid'

const dynamoClient = DynamoDBDocumentClient.from(new DynamoDBClient({}))

const TABLES = {
  EVENTS: 'Doce25-Events',
}

interface CreateEventBody {
  name: string
  slug: string
  description: string
  dateTime: string
  location: string
  capacity?: number
  image?: string
  status: 'draft' | 'published'
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
    return {
      statusCode: 200,
      headers,
      body: '',
    }
  }

  try {
    const body: CreateEventBody = JSON.parse(event.body || '{}')
    const { name, slug, description, dateTime, location, capacity, image, status } = body

    if (!name || !slug || !description || !dateTime || !location) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: 'Missing required fields' }),
      }
    }

    const eventId = uuidv4()

    await dynamoClient.send(
      new PutCommand({
        TableName: TABLES.EVENTS,
        Item: {
          eventId,
          name,
          slug,
          description,
          date: dateTime,
          dateTime,
          location,
          capacity: capacity || 0,
          image: image || '',
          status: status || 'draft',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      })
    )

    return {
      statusCode: 201,
      headers,
      body: JSON.stringify({
        message: 'Event created successfully',
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


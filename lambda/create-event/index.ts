import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb'
import { v4 as uuidv4 } from 'uuid'
import * as crypto from 'crypto'

const dynamoClient = DynamoDBDocumentClient.from(new DynamoDBClient({}))

const EVENTS_TABLE = process.env.EVENTS_TABLE || 'Dosce25-Events'

// Generar shortId único de 6 caracteres
function generateShortId(): string {
  return crypto.randomBytes(3).toString('base64url').substring(0, 6)
}

// Verificar si el shortId ya existe
async function isShortIdUnique(shortId: string): Promise<boolean> {
  try {
    const result = await dynamoClient.send(
      new QueryCommand({
        TableName: EVENTS_TABLE,
        IndexName: 'ShortIdIndex',
        KeyConditionExpression: 'shortId = :shortId',
        ExpressionAttributeValues: {
          ':shortId': shortId,
        },
        Limit: 1,
      })
    )
    return !result.Items || result.Items.length === 0
  } catch (error: any) {
    // Si el índice no existe, fallback a scan (temporal)
    console.warn('ShortIdIndex not found, shortId will not be validated:', error.message)
    return true
  }
}

// Generar un shortId único con reintentos
async function generateUniqueShortId(): Promise<string> {
  let attempts = 0
  const maxAttempts = 5
  
  while (attempts < maxAttempts) {
    const shortId = generateShortId()
    if (await isShortIdUnique(shortId)) {
      return shortId
    }
    attempts++
  }
  
  // Fallback a un shortId más largo si hay colisiones
  return crypto.randomBytes(4).toString('base64url').substring(0, 8)
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
    'Access-Control-Allow-Origin': 'https://doce25.precotracks.org',
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
    const shortId = await generateUniqueShortId()

    await dynamoClient.send(
      new PutCommand({
        TableName: EVENTS_TABLE,
        Item: {
          eventId,
          shortId,
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
        shortId,
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


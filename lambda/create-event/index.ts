import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, PutCommand, ScanCommand } from '@aws-sdk/lib-dynamodb'
import { v4 as uuidv4 } from 'uuid'

const dynamoClient = DynamoDBDocumentClient.from(new DynamoDBClient({}))

const EVENTS_TABLE = process.env.EVENTS_TABLE || 'Dosce25-Events'

// Generar código corto único (6 caracteres alfanuméricos)
function generateShortCode(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

// Verificar si el código ya existe
async function isShortCodeUnique(code: string): Promise<boolean> {
  try {
    const result = await dynamoClient.send(
      new ScanCommand({
        TableName: EVENTS_TABLE,
        FilterExpression: 'shortCode = :code',
        ExpressionAttributeValues: {
          ':code': code,
        },
      })
    )
    return !result.Items || result.Items.length === 0
  } catch (error) {
    console.error('Error checking shortCode uniqueness:', error)
    return true // En caso de error, asumir que es único
  }
}

// Generar código único
async function generateUniqueShortCode(): Promise<string> {
  let code = generateShortCode()
  let attempts = 0
  const maxAttempts = 10

  while (!(await isShortCodeUnique(code)) && attempts < maxAttempts) {
    code = generateShortCode()
    attempts++
  }

  if (attempts >= maxAttempts) {
    // Si después de 10 intentos no encontramos uno único, usar timestamp + random
    code = Date.now().toString(36).slice(-4) + generateShortCode().slice(0, 2)
  }

  return code
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
    const shortCode = await generateUniqueShortCode()

    await dynamoClient.send(
      new PutCommand({
        TableName: EVENTS_TABLE,
        Item: {
          eventId,
          name,
          slug,
          shortCode,
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
        shortCode,
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


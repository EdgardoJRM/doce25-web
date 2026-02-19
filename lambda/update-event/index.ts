import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, UpdateCommand, GetCommand, ScanCommand } from '@aws-sdk/lib-dynamodb'

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
    return true
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
    code = Date.now().toString(36).slice(-4) + generateShortCode().slice(0, 2)
  }

  return code
}

interface UpdateEventBody {
  name?: string
  slug?: string
  description?: string
  dateTime?: string
  location?: string
  capacity?: number
  image?: string
  status?: 'draft' | 'published'
}

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const headers = {
    'Access-Control-Allow-Origin': 'https://doce25.precotracks.org',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'PUT, OPTIONS',
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

    // Verificar que el evento existe
    const getResult = await dynamoClient.send(
      new GetCommand({
        TableName: EVENTS_TABLE,
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

    const body: UpdateEventBody = JSON.parse(event.body || '{}')

    // Construir expresiones de actualización dinámicamente
    const updateExpressions: string[] = []
    const expressionAttributeNames: Record<string, string> = {}
    const expressionAttributeValues: Record<string, any> = {}

    // Generar shortCode si no existe
    if (!getResult.Item.shortCode) {
      const newShortCode = await generateUniqueShortCode()
      updateExpressions.push('#shortCode = :shortCode')
      expressionAttributeNames['#shortCode'] = 'shortCode'
      expressionAttributeValues[':shortCode'] = newShortCode
    }

    if (body.name !== undefined) {
      updateExpressions.push('#name = :name')
      expressionAttributeNames['#name'] = 'name'
      expressionAttributeValues[':name'] = body.name
    }

    if (body.slug !== undefined) {
      updateExpressions.push('#slug = :slug')
      expressionAttributeNames['#slug'] = 'slug'
      expressionAttributeValues[':slug'] = body.slug
    }

    if (body.description !== undefined) {
      updateExpressions.push('#description = :description')
      expressionAttributeNames['#description'] = 'description'
      expressionAttributeValues[':description'] = body.description
    }

    if (body.dateTime !== undefined) {
      updateExpressions.push('#date = :date, #dateTime = :dateTime')
      expressionAttributeNames['#date'] = 'date'
      expressionAttributeNames['#dateTime'] = 'dateTime'
      expressionAttributeValues[':date'] = body.dateTime
      expressionAttributeValues[':dateTime'] = body.dateTime
    }

    if (body.location !== undefined) {
      updateExpressions.push('#location = :location')
      expressionAttributeNames['#location'] = 'location'
      expressionAttributeValues[':location'] = body.location
    }

    if (body.capacity !== undefined) {
      updateExpressions.push('#capacity = :capacity')
      expressionAttributeNames['#capacity'] = 'capacity'
      expressionAttributeValues[':capacity'] = body.capacity
    }

    if (body.image !== undefined) {
      updateExpressions.push('#image = :image')
      expressionAttributeNames['#image'] = 'image'
      expressionAttributeValues[':image'] = body.image
    }

    if (body.status !== undefined) {
      updateExpressions.push('#status = :status')
      expressionAttributeNames['#status'] = 'status'
      expressionAttributeValues[':status'] = body.status
    }

    // Siempre actualizar updatedAt
    updateExpressions.push('#updatedAt = :updatedAt')
    expressionAttributeNames['#updatedAt'] = 'updatedAt'
    expressionAttributeValues[':updatedAt'] = new Date().toISOString()

    if (updateExpressions.length === 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: 'No fields to update' }),
      }
    }

    await dynamoClient.send(
      new UpdateCommand({
        TableName: EVENTS_TABLE,
        Key: { eventId },
        UpdateExpression: `SET ${updateExpressions.join(', ')}`,
        ExpressionAttributeNames: Object.keys(expressionAttributeNames).length > 0 ? expressionAttributeNames : undefined,
        ExpressionAttributeValues: expressionAttributeValues,
      })
    )

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: 'Event updated successfully',
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


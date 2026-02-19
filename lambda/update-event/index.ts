import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, UpdateCommand, GetCommand } from '@aws-sdk/lib-dynamodb'

const dynamoClient = DynamoDBDocumentClient.from(new DynamoDBClient({}))

const TABLES = {
  EVENTS: 'Doce25-Events',
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
    'Access-Control-Allow-Origin': '*',
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

    const body: UpdateEventBody = JSON.parse(event.body || '{}')

    // Construir expresiones de actualización dinámicamente
    const updateExpressions: string[] = []
    const expressionAttributeNames: Record<string, string> = {}
    const expressionAttributeValues: Record<string, any> = {}

    if (body.name !== undefined) {
      updateExpressions.push('#name = :name')
      expressionAttributeNames['#name'] = 'name'
      expressionAttributeValues[':name'] = body.name
    }

    if (body.slug !== undefined) {
      updateExpressions.push('slug = :slug')
      expressionAttributeValues[':slug'] = body.slug
    }

    if (body.description !== undefined) {
      updateExpressions.push('description = :description')
      expressionAttributeValues[':description'] = body.description
    }

    if (body.dateTime !== undefined) {
      updateExpressions.push('#date = :date, dateTime = :dateTime')
      expressionAttributeNames['#date'] = 'date'
      expressionAttributeValues[':date'] = body.dateTime
      expressionAttributeValues[':dateTime'] = body.dateTime
    }

    if (body.location !== undefined) {
      updateExpressions.push('#location = :location')
      expressionAttributeNames['#location'] = 'location'
      expressionAttributeValues[':location'] = body.location
    }

    if (body.capacity !== undefined) {
      updateExpressions.push('capacity = :capacity')
      expressionAttributeValues[':capacity'] = body.capacity
    }

    if (body.image !== undefined) {
      updateExpressions.push('image = :image')
      expressionAttributeValues[':image'] = body.image
    }

    if (body.status !== undefined) {
      updateExpressions.push('#status = :status')
      expressionAttributeNames['#status'] = 'status'
      expressionAttributeValues[':status'] = body.status
    }

    // Siempre actualizar updatedAt
    updateExpressions.push('updatedAt = :updatedAt')
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
        TableName: TABLES.EVENTS,
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


import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, UpdateCommand, GetCommand } from '@aws-sdk/lib-dynamodb'

const dynamoClient = DynamoDBDocumentClient.from(new DynamoDBClient({}))

const TABLES = {
  REGISTRATIONS: 'Dosce25-Registrations',
}

interface UpdateRegistrationBody {
  name?: string
  email?: string
  phone?: string
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
    const registrationId = event.pathParameters?.registrationId

    if (!registrationId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: 'Registration ID is required' }),
      }
    }

    // Verificar que el registro existe
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

    const body: UpdateRegistrationBody = JSON.parse(event.body || '{}')

    const updateExpressions: string[] = []
    const expressionAttributeNames: Record<string, string> = {}
    const expressionAttributeValues: Record<string, any> = {}

    if (body.name !== undefined) {
      updateExpressions.push('#name = :name')
      expressionAttributeNames['#name'] = 'name'
      expressionAttributeValues[':name'] = body.name
    }

    if (body.email !== undefined) {
      updateExpressions.push('email = :email')
      expressionAttributeValues[':email'] = body.email
    }

    if (body.phone !== undefined) {
      updateExpressions.push('phone = :phone')
      expressionAttributeValues[':phone'] = body.phone
    }

    if (updateExpressions.length === 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: 'No fields to update' }),
      }
    }

    // Siempre actualizar updatedAt
    updateExpressions.push('updatedAt = :updatedAt')
    expressionAttributeValues[':updatedAt'] = new Date().toISOString()

    await dynamoClient.send(
      new UpdateCommand({
        TableName: TABLES.REGISTRATIONS,
        Key: { registrationId },
        UpdateExpression: `SET ${updateExpressions.join(', ')}`,
        ExpressionAttributeNames: Object.keys(expressionAttributeNames).length > 0 ? expressionAttributeNames : undefined,
        ExpressionAttributeValues: expressionAttributeValues,
      })
    )

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: 'Registration updated successfully',
        registrationId,
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


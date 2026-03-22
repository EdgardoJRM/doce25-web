import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, QueryCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb'

const dynamoClient = DynamoDBDocumentClient.from(new DynamoDBClient({}))

const TABLES = {
  REGISTRATIONS: process.env.REGISTRATIONS_TABLE || 'Dosce25-Registrations',
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
    const { eventId, organizationName } = event.pathParameters || {}
    const body = event.body ? JSON.parse(event.body) : {}

    if (!eventId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'eventId es requerido' }),
      }
    }

    const orgName = organizationName || body.organizationName
    if (!orgName || !orgName.trim()) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'organizationName es requerido' }),
      }
    }

    const trimmedOrgName = orgName.trim()

    // Verificar si la organización ya existe en este evento
    const existingResult = await dynamoClient.send(
      new QueryCommand({
        TableName: TABLES.REGISTRATIONS,
        IndexName: 'EventIdIndex',
        KeyConditionExpression: 'eventId = :eventId',
        FilterExpression: 'organization = :org OR eventOrganization = :org',
        ExpressionAttributeValues: {
          ':eventId': eventId,
          ':org': trimmedOrgName,
        },
        Limit: 1,
      })
    )

    if (existingResult.Items && existingResult.Items.length > 0) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'Organización ya existe',
          organizationName: trimmedOrgName,
          isNew: false,
        }),
      }
    }

    // La organización se crea implícitamente cuando un usuario la selecciona
    // Este endpoint solo valida y confirma que se puede usar
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Organización creada exitosamente',
        organizationName: trimmedOrgName,
        isNew: true,
      }),
    }
  } catch (error: any) {
    console.error('Error creando organización:', error)
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

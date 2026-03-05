import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb'

const dynamoClient = DynamoDBDocumentClient.from(new DynamoDBClient({}))

const TABLES = {
  REGISTRATIONS: 'Dosce25-Registrations',
}

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
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
    const { eventId } = event.pathParameters || {}
    const query = event.queryStringParameters?.q || ''

    if (!eventId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'eventId es requerido' }),
      }
    }

    if (!query || query.length < 2) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Query debe tener al menos 2 caracteres' }),
      }
    }

    // Obtener todos los registros del evento
    const result = await dynamoClient.send(
      new QueryCommand({
        TableName: TABLES.REGISTRATIONS,
        IndexName: 'EventIdIndex',
        KeyConditionExpression: 'eventId = :eventId',
        ExpressionAttributeValues: {
          ':eventId': eventId,
        },
      })
    )

    const registrations = result.Items || []

    // Filtrar en memoria por nombre, email u organización
    const searchTerm = query.toLowerCase()
    const filtered = registrations.filter((reg) => {
      const nameMatch = (reg.fullName || reg.name || '').toLowerCase().includes(searchTerm)
      const emailMatch = (reg.email || '').toLowerCase().includes(searchTerm)
      const orgMatch = (reg.organization || '').toLowerCase().includes(searchTerm)
      
      return nameMatch || emailMatch || orgMatch
    })

    // Ordenar alfabéticamente y limitar a 20 resultados
    const sorted = filtered
      .sort((a, b) => {
        const nameA = (a.fullName || a.name || '').toLowerCase()
        const nameB = (b.fullName || b.name || '').toLowerCase()
        return nameA.localeCompare(nameB)
      })
      .slice(0, 20)

    // Mapear a formato más limpio
    const results = sorted.map((reg) => ({
      registrationId: reg.registrationId,
      name: reg.fullName || reg.name,
      email: reg.email,
      organization: reg.organization || '',
      checkedIn: reg.checkedIn || false,
      checkedOut: reg.checkedOut || false,
      weightCollected: reg.weightCollected || null,
      phone: reg.phone || '',
    }))

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        results,
        total: filtered.length,
        showing: results.length,
        query: query,
      }),
    }
  } catch (error: any) {
    console.error('Error buscando registros:', error)
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

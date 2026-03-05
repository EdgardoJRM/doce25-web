import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb'

const dynamoClient = DynamoDBDocumentClient.from(new DynamoDBClient({}))

const TABLES = {
  REGISTRATIONS: 'Dosce25-Registrations',
}

interface TrashBreakdown {
  plastic?: number
  metal?: number
  glass?: number
  organic?: number
  other?: number
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

    if (!eventId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'eventId es requerido' }),
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
    const withWeight = registrations.filter((r) => r.weightCollected && r.weightCollected > 0)

    // Calcular peso total
    const totalWeight = withWeight.reduce((sum, r) => sum + (r.weightCollected || 0), 0)

    // Calcular desglose por tipo
    const breakdown: TrashBreakdown = {
      plastic: 0,
      metal: 0,
      glass: 0,
      organic: 0,
      other: 0,
    }

    withWeight.forEach((r) => {
      if (r.trashBreakdown) {
        breakdown.plastic = (breakdown.plastic || 0) + (r.trashBreakdown.plastic || 0)
        breakdown.metal = (breakdown.metal || 0) + (r.trashBreakdown.metal || 0)
        breakdown.glass = (breakdown.glass || 0) + (r.trashBreakdown.glass || 0)
        breakdown.organic = (breakdown.organic || 0) + (r.trashBreakdown.organic || 0)
        breakdown.other = (breakdown.other || 0) + (r.trashBreakdown.other || 0)
      }
    })

    // Top 10 participantes por peso
    const topParticipants = withWeight
      .sort((a, b) => (b.weightCollected || 0) - (a.weightCollected || 0))
      .slice(0, 10)
      .map((r, index) => ({
        rank: index + 1,
        name: r.fullName || r.name,
        weight: r.weightCollected,
        organization: r.organization || '',
        trashType: r.trashType || 'mixed',
      }))

    // Conteo por tipo de basura
    const trashTypeCounts: Record<string, number> = {}
    withWeight.forEach((r) => {
      const type = r.trashType || 'mixed'
      trashTypeCounts[type] = (trashTypeCounts[type] || 0) + 1
    })

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        eventId,
        totalWeight: Math.round(totalWeight * 100) / 100, // Redondear a 2 decimales
        participantsCount: withWeight.length,
        totalRegistrations: registrations.length,
        participationRate: registrations.length > 0 
          ? Math.round((withWeight.length / registrations.length) * 100) 
          : 0,
        breakdown,
        topParticipants,
        trashTypeCounts,
        lastUpdated: new Date().toISOString(),
      }),
    }
  } catch (error: any) {
    console.error('Error obteniendo estadísticas:', error)
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

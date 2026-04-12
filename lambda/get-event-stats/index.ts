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

    // Agrupar por tipo de participación
    const byParticipationType: Record<string, any[]> = {
      individual: [],
      duo: [],
      group: [],
    }

    // Agrupar por organización (dinámicamente)
    const byOrganization: Record<string, any[]> = {}

    const totalsByParticipationType = {
      individual: { totalWeight: 0, count: 0 },
      duo: { totalWeight: 0, count: 0 },
      group: { totalWeight: 0, count: 0 },
      organization: { totalWeight: 0, count: 0 },
    }

    withWeight.forEach((r) => {
      const type = (r.participationType || 'individual').toLowerCase()
      const w = r.weightCollected || 0

      if (type === 'organization') {
        totalsByParticipationType.organization.totalWeight += w
        totalsByParticipationType.organization.count += 1
        // Agrupar por organización
        const orgName = r.eventOrganization || 'Sin Organización'
        if (!byOrganization[orgName]) {
          byOrganization[orgName] = []
        }
        byOrganization[orgName].push(r)
      } else {
        if (totalsByParticipationType[type as keyof typeof totalsByParticipationType]) {
          const bucket = totalsByParticipationType[type as 'individual' | 'duo' | 'group']
          bucket.totalWeight += w
          bucket.count += 1
        }
        // Agrupar por tipo de participación
        if (byParticipationType[type]) {
          byParticipationType[type].push(r)
        }
      }
    })

    Object.keys(totalsByParticipationType).forEach((k) => {
      const key = k as keyof typeof totalsByParticipationType
      totalsByParticipationType[key].totalWeight =
        Math.round(totalsByParticipationType[key].totalWeight * 100) / 100
    })

    // Crear top participantes por tipo de participación
    const topParticipantsByType: Record<string, any[]> = {}
    
    Object.entries(byParticipationType).forEach(([type, participants]) => {
      topParticipantsByType[type] = participants
        .sort((a, b) => (b.weightCollected || 0) - (a.weightCollected || 0))
        .slice(0, 3)
        .map((r, index) => ({
          rank: index + 1,
          name: r.fullName || r.name,
          weight: r.weightCollected,
          organization: r.organization || '',
          trashType: r.trashType || 'mixed',
          participationType: type,
        }))
    })

    // Crear top organizaciones (acumulado)
    const topOrganizations = Object.entries(byOrganization)
      .map(([orgName, participants]) => ({
        name: orgName,
        weight: participants.reduce((sum, p) => sum + (p.weightCollected || 0), 0),
        participantCount: participants.length,
        participationType: 'organization',
      }))
      .sort((a, b) => b.weight - a.weight)
      .slice(0, 10)

    // Combinar todos los top participantes (para compatibilidad)
    const topParticipants = [
      ...topParticipantsByType.individual || [],
      ...topParticipantsByType.duo || [],
      ...topParticipantsByType.group || [],
      ...topOrganizations,
    ]
      .sort((a, b) => b.weight - a.weight)
      .slice(0, 10)
      .map((p, index) => ({
        ...p,
        rank: index + 1,
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
        totalWeight: Math.round(totalWeight * 100) / 100,
        participantsCount: withWeight.length,
        totalRegistrations: registrations.length,
        participationRate: registrations.length > 0 
          ? Math.round((withWeight.length / registrations.length) * 100) 
          : 0,
        breakdown,
        topParticipants,
        topParticipantsByType,
        topOrganizations,
        totalsByParticipationType,
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

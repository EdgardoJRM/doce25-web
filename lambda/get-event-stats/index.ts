import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb'

const dynamoClient = DynamoDBDocumentClient.from(new DynamoDBClient({}))

const TABLES = {
  REGISTRATIONS: 'Dosce25-Registrations',
  WEIGHT_RECORDS: 'Dosce25-WeightRecords',
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

    // ── 1. Obtener todos los registros del evento ─────────────────────────────
    const regResult = await dynamoClient.send(
      new QueryCommand({
        TableName: TABLES.REGISTRATIONS,
        IndexName: 'EventIdIndex',
        KeyConditionExpression: 'eventId = :eventId',
        ExpressionAttributeValues: { ':eventId': eventId },
      })
    )
    const registrations = regResult.Items || []

    // ── 2. Obtener todos los WeightRecords del evento (paginados) ─────────────
    const allWeightRecords: any[] = []
    let wrLastKey: any = undefined
    do {
      const wrResult = await dynamoClient.send(
        new QueryCommand({
          TableName: TABLES.WEIGHT_RECORDS,
          IndexName: 'EventIndex',
          KeyConditionExpression: 'eventId = :eventId',
          ExpressionAttributeValues: { ':eventId': eventId },
          ExclusiveStartKey: wrLastKey,
        })
      )
      allWeightRecords.push(...(wrResult.Items || []))
      wrLastKey = wrResult.LastEvaluatedKey
    } while (wrLastKey)

    // ── 3. Sumar peso real por registrationId y por groupId ───────────────────
    // Cada WeightRecord tiene registrationId XOR groupId
    const weightByRegistrationId: Record<string, number> = {}
    const weightByGroupId: Record<string, number> = {}
    const trashTypeByRegistrationId: Record<string, string> = {}

    for (const wr of allWeightRecords) {
      const w = wr.weightCollected || 0
      if (wr.registrationId) {
        weightByRegistrationId[wr.registrationId] = (weightByRegistrationId[wr.registrationId] || 0) + w
        // Conservar el trashType del viaje más reciente (timestamp desc)
        trashTypeByRegistrationId[wr.registrationId] = wr.trashType || 'no-aplica'
      } else if (wr.groupId) {
        weightByGroupId[wr.groupId] = (weightByGroupId[wr.groupId] || 0) + w
      }
    }

    // ── 4. Enriquecer registros con peso real acumulado ───────────────────────
    const enriched = registrations.map((r) => {
      const byReg = weightByRegistrationId[r.registrationId] || 0
      const byGroup = r.groupId ? (weightByGroupId[r.groupId] || 0) : 0
      // Para participantes individuales: byReg; para grupos: byGroup si existe, si no byReg
      const totalW = byReg > 0 ? byReg : byGroup
      return {
        ...r,
        weightCollected: Math.round(totalW * 100) / 100,
        trashType: trashTypeByRegistrationId[r.registrationId] || r.trashType || 'no-aplica',
      }
    })

    const withWeight = enriched.filter((r) => r.weightCollected > 0)

    // ── 5. Totales ─────────────────────────────────────────────────────────────
    const totalWeight = withWeight.reduce((sum, r) => sum + r.weightCollected, 0)

    // ── 6. Agrupar por tipo de participación ──────────────────────────────────
    const byParticipationType: Record<string, any[]> = {
      individual: [],
      duo: [],
      group: [],
    }
    const byOrganization: Record<string, any[]> = {}

    const totalsByParticipationType = {
      individual: { totalWeight: 0, count: 0 },
      duo:        { totalWeight: 0, count: 0 },
      group:      { totalWeight: 0, count: 0 },
      organization: { totalWeight: 0, count: 0 },
    }

    withWeight.forEach((r) => {
      const type = (r.participationType || 'individual').toLowerCase()
      const w = r.weightCollected

      if (type === 'organization') {
        totalsByParticipationType.organization.totalWeight += w
        totalsByParticipationType.organization.count += 1
        const orgName = r.eventOrganization || 'Sin Organización'
        if (!byOrganization[orgName]) byOrganization[orgName] = []
        byOrganization[orgName].push(r)
      } else {
        const bucket = totalsByParticipationType[type as 'individual' | 'duo' | 'group']
        if (bucket) {
          bucket.totalWeight += w
          bucket.count += 1
        }
        if (byParticipationType[type]) {
          byParticipationType[type].push(r)
        }
      }
    })

    // Redondear totales
    Object.keys(totalsByParticipationType).forEach((k) => {
      const key = k as keyof typeof totalsByParticipationType
      totalsByParticipationType[key].totalWeight =
        Math.round(totalsByParticipationType[key].totalWeight * 100) / 100
    })

    // ── 7. Top 3 por categoría — siempre las 3 keys presentes ─────────────────
    const topParticipantsByType: Record<string, any[]> = {
      individual: [],
      duo: [],
      group: [],
    }

    Object.entries(byParticipationType).forEach(([type, participants]) => {
      topParticipantsByType[type] = participants
        .sort((a, b) => b.weightCollected - a.weightCollected)
        .slice(0, 3)
        .map((r, index) => ({
          rank: index + 1,
          name: r.fullName || r.name,
          weight: r.weightCollected,
          organization: r.organization || '',
          trashType: r.trashType || 'no-aplica',
          participationType: type,
        }))
    })

    // ── 8. Top organizaciones (acumulado por org) ─────────────────────────────
    const topOrganizations = Object.entries(byOrganization)
      .map(([orgName, participants]) => ({
        name: orgName,
        weight: Math.round(participants.reduce((sum, p) => sum + p.weightCollected, 0) * 100) / 100,
        participantCount: participants.length,
        participationType: 'organization',
      }))
      .sort((a, b) => b.weight - a.weight)
      .slice(0, 10)

    // ── 9. Top 10 global combinado (para compatibilidad) ──────────────────────
    const topParticipants = [
      ...(topParticipantsByType.individual || []),
      ...(topParticipantsByType.duo || []),
      ...(topParticipantsByType.group || []),
      ...topOrganizations,
    ]
      .sort((a, b) => b.weight - a.weight)
      .slice(0, 10)
      .map((p, index) => ({ ...p, rank: index + 1 }))

    // ── 10. Conteo por tipo de basura ─────────────────────────────────────────
    const trashTypeCounts: Record<string, number> = {}
    withWeight.forEach((r) => {
      const t = r.trashType || 'no-aplica'
      trashTypeCounts[t] = (trashTypeCounts[t] || 0) + 1
    })

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        eventId,
        totalWeight: Math.round(totalWeight * 100) / 100,
        participantsCount: withWeight.length,
        totalRegistrations: registrations.length,
        participationRate:
          registrations.length > 0
            ? Math.round((withWeight.length / registrations.length) * 100)
            : 0,
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

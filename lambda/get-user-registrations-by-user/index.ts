import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, QueryCommand, GetCommand, BatchGetCommand } from '@aws-sdk/lib-dynamodb'
import { CognitoJwtVerifier } from 'aws-jwt-verify'
import * as jwt from 'jsonwebtoken'

const dynamoClient = DynamoDBDocumentClient.from(new DynamoDBClient({}))
const REGISTRATIONS_TABLE = process.env.REGISTRATIONS_TABLE || 'Dosce25-Registrations'
const EVENTS_TABLE = process.env.EVENTS_TABLE || 'Dosce25-Events'
const USERS_TABLE = process.env.USERS_TABLE || 'Dosce25-Users'
const JWT_SECRET = process.env.JWT_SECRET || 'secret'
const COGNITO_USER_POOL_ID = process.env.COGNITO_USER_POOL_ID || ''
const COGNITO_CLIENT_ID = process.env.COGNITO_CLIENT_ID || ''
const COGNITO_ADMIN_GROUP = process.env.COGNITO_ADMIN_GROUP || ''
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || '')
  .split(',')
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean)

let cognitoVerifier: ReturnType<typeof CognitoJwtVerifier.create> | null = null

function getCognitoVerifier() {
  if (!COGNITO_USER_POOL_ID || !COGNITO_CLIENT_ID) return null
  if (!cognitoVerifier) {
    cognitoVerifier = CognitoJwtVerifier.create({
      userPoolId: COGNITO_USER_POOL_ID,
      tokenUse: 'id',
      clientId: COGNITO_CLIENT_ID,
    })
  }
  return cognitoVerifier
}

function cognitoPayloadIsAdmin(payload: { email?: string; 'cognito:groups'?: string[] }) {
  if (ADMIN_EMAILS.length > 0) {
    const email = (payload.email || '').toLowerCase()
    if (ADMIN_EMAILS.includes(email)) return true
  }
  if (COGNITO_ADMIN_GROUP) {
    const groups = payload['cognito:groups']
    if (Array.isArray(groups) && groups.includes(COGNITO_ADMIN_GROUP)) return true
  }
  return false
}

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
  'Access-Control-Allow-Methods': 'GET,OPTIONS',
  'Content-Type': 'application/json',
}

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' }
  }

  try {
    // Verificar token JWT
    const authHeader = event.headers.Authorization || event.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ message: 'Token no proporcionado' }),
      }
    }

    const token = authHeader.substring(7)
    let appUserId: string | undefined
    let isCognitoAdmin = false

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId?: string }
      appUserId = decoded.userId
    } catch {
      const verifier = getCognitoVerifier()
      if (!verifier) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({
            message:
              'Token inválido o expirado. Para el panel admin, despliega la API con COGNITO_USER_POOL_ID y COGNITO_CLIENT_ID (mismos valores que NEXT_PUBLIC_ en el front).',
          }),
        }
      }
      try {
        const payload = await verifier.verify(token)
        if (!cognitoPayloadIsAdmin(payload)) {
          return {
            statusCode: 403,
            headers,
            body: JSON.stringify({
              message:
                'No tienes permiso de administrador. Añade tu usuario al grupo Cognito configurado en COGNITO_ADMIN_GROUP o tu email en ADMIN_EMAILS.',
            }),
          }
        }
        isCognitoAdmin = true
      } catch {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ message: 'Token inválido o expirado' }),
        }
      }
    }

    const userId = event.pathParameters?.userId || appUserId

    if (!userId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: 'userId requerido' }),
      }
    }

    if (!isCognitoAdmin && userId !== appUserId) {
      return {
        statusCode: 403,
        headers,
        body: JSON.stringify({ message: 'No tienes permiso para ver estos registros' }),
      }
    }

    // Obtener el email del usuario desde la tabla de Users
    const userResult = await dynamoClient.send(
      new GetCommand({
        TableName: USERS_TABLE,
        Key: { userId },
      })
    )

    if (!userResult.Item) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ message: 'Usuario no encontrado' }),
      }
    }

    const userEmail = userResult.Item.email

    // Buscar registros por email (paginado: el índice puede devolver varias páginas)
    const registrations: any[] = []
    let regLastKey: Record<string, unknown> | undefined
    do {
      const registrationsResult = await dynamoClient.send(
        new QueryCommand({
          TableName: REGISTRATIONS_TABLE,
          IndexName: 'EmailIndex',
          KeyConditionExpression: 'email = :email',
          ExpressionAttributeValues: {
            ':email': userEmail,
          },
          ExclusiveStartKey: regLastKey,
        })
      )
      registrations.push(...(registrationsResult.Items || []))
      regLastKey = registrationsResult.LastEvaluatedKey
    } while (regLastKey)

    // Si no hay registros, devolver array vacío
    if (registrations.length === 0) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ registrations: [] }),
      }
    }

    // Obtener IDs únicos de eventos (BatchGet admite máx. 100 claves por request)
    const eventIds = [...new Set(registrations.map(r => r.eventId).filter(Boolean))]
    const events: any[] = []
    for (let i = 0; i < eventIds.length; i += 100) {
      const chunk = eventIds.slice(i, i + 100)
      const eventsResult = await dynamoClient.send(
        new BatchGetCommand({
          RequestItems: {
            [EVENTS_TABLE]: {
              Keys: chunk.map(id => ({ eventId: id })),
            },
          },
        })
      )
      const batch = eventsResult.Responses?.[EVENTS_TABLE] || []
      events.push(...batch)
    }
    const eventsMap = new Map(events.map(e => [e.eventId, e]))

    // Mapear registros con información de eventos
    const enrichedRegistrations = registrations.map(reg => {
      const event = eventsMap.get(reg.eventId)
      return {
        registrationId: reg.registrationId,
        eventId: reg.eventId,
        eventSlug: event?.slug || '',
        eventName: event?.name || 'Evento no disponible',
        eventDate: event?.date || '',
        eventLocation: event?.location || '',
        checkedIn: reg.checkedIn || false,
        registeredAt: reg.createdAt,
        qrToken: reg.qrToken,
        fullName: reg.fullName || reg.name || '',
        weightCollected: typeof reg.weightCollected === 'number' ? reg.weightCollected : Number(reg.weightCollected) || 0,
        participationType: reg.participationType || 'individual',
        eventOrganization: reg.eventOrganization || reg.organization || '',
        groupId: reg.groupId || '',
      }
    })

    // Ordenar por fecha de registro (más reciente primero)
    enrichedRegistrations.sort((a, b) => 
      new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime()
    )

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        registrations: enrichedRegistrations,
      }),
    }
  } catch (error: any) {
    console.error('Error:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        message: 'Error al obtener registros',
        error: error.message,
      }),
    }
  }
}

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, QueryCommand, GetCommand, BatchGetCommand } from '@aws-sdk/lib-dynamodb'
import * as jwt from 'jsonwebtoken'

const dynamoClient = DynamoDBDocumentClient.from(new DynamoDBClient({}))
const REGISTRATIONS_TABLE = process.env.REGISTRATIONS_TABLE || 'Dosce25-Registrations'
const EVENTS_TABLE = process.env.EVENTS_TABLE || 'Dosce25-Events'
const USERS_TABLE = process.env.USERS_TABLE || 'Dosce25-Users'
const JWT_SECRET = process.env.JWT_SECRET || 'secret'

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
    let decoded: any

    try {
      decoded = jwt.verify(token, JWT_SECRET)
    } catch (err) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ message: 'Token inválido o expirado' }),
      }
    }

    const userId = event.pathParameters?.userId || decoded.userId

    // Verificar que el usuario solo pueda ver sus propios registros (a menos que sea admin)
    if (userId !== decoded.userId) {
      // TODO: Verificar si es admin con Cognito
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

    // Buscar registros por email usando el índice EmailIndex
    const registrationsResult = await dynamoClient.send(
      new QueryCommand({
        TableName: REGISTRATIONS_TABLE,
        IndexName: 'EmailIndex',
        KeyConditionExpression: 'email = :email',
        ExpressionAttributeValues: {
          ':email': userEmail,
        },
      })
    )

    const registrations = registrationsResult.Items || []

    // Si no hay registros, devolver array vacío
    if (registrations.length === 0) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ registrations: [] }),
      }
    }

    // Obtener IDs únicos de eventos
    const eventIds = [...new Set(registrations.map(r => r.eventId))]

    // Obtener información de eventos en batch
    const eventsResult = await dynamoClient.send(
      new BatchGetCommand({
        RequestItems: {
          [EVENTS_TABLE]: {
            Keys: eventIds.map(id => ({ eventId: id }))
          }
        }
      })
    )

    const events = eventsResult.Responses?.[EVENTS_TABLE] || []
    const eventsMap = new Map(events.map(e => [e.eventId, e]))

    // Mapear registros con información de eventos
    const enrichedRegistrations = registrations.map(reg => {
      const event = eventsMap.get(reg.eventId)
      return {
        registrationId: reg.registrationId,
        eventId: reg.eventId,
        eventName: event?.name || 'Evento no disponible',
        eventDate: event?.date || '',
        eventLocation: event?.location || '',
        checkedIn: reg.checkedIn || false,
        registeredAt: reg.createdAt,
        qrToken: reg.qrToken,
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


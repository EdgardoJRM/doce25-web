import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb'

const doc = DynamoDBDocumentClient.from(new DynamoDBClient({}))

const INVITATIONS_TABLE = process.env.SURVEY_INVITATIONS_TABLE || 'Dosce25-SurveyInvitations'
const EVENTS_TABLE = process.env.EVENTS_TABLE || 'Dosce25-Events'

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
  'Access-Control-Allow-Methods': 'GET,OPTIONS',
  'Content-Type': 'application/json',
}

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' }
  }

  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, headers, body: JSON.stringify({ message: 'Method not allowed' }) }
  }

  const token = event.pathParameters?.token?.trim()
  if (!token) {
    return { statusCode: 400, headers, body: JSON.stringify({ message: 'Token requerido' }) }
  }

  try {
    const invRes = await doc.send(
      new GetCommand({ TableName: INVITATIONS_TABLE, Key: { token } })
    )
    const inv = invRes.Item as
      | {
          eventId?: string
          fullName?: string
          respondedAt?: string
        }
      | undefined

    if (!inv?.eventId) {
      return { statusCode: 404, headers, body: JSON.stringify({ message: 'Encuesta no encontrada' }) }
    }

    const evRes = await doc.send(
      new GetCommand({ TableName: EVENTS_TABLE, Key: { eventId: inv.eventId } })
    )
    const ev = evRes.Item as { name?: string; date?: string; dateTime?: string } | undefined
    const eventName = ev?.name || 'Evento Doce25'
    const eventDate = ev?.date || ev?.dateTime || ''

    const fullName = inv.fullName || ''
    const firstName = fullName.trim().split(/\s+/)[0] || 'Participante'

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        eventId: inv.eventId,
        eventName,
        eventDate,
        fullName,
        firstName,
        alreadyAnswered: Boolean(inv.respondedAt),
      }),
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error(err)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: 'Error al cargar encuesta', error: msg }),
    }
  }
}

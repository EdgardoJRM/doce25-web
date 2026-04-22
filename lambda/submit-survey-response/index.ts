import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, GetCommand, TransactWriteCommand } from '@aws-sdk/lib-dynamodb'
import { randomUUID } from 'crypto'

const doc = DynamoDBDocumentClient.from(new DynamoDBClient({}))

const INVITATIONS_TABLE = process.env.SURVEY_INVITATIONS_TABLE || 'Dosce25-SurveyInvitations'
const RESPONSES_TABLE = process.env.SURVEY_RESPONSES_TABLE || 'Dosce25-SurveyResponses'

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
  'Access-Control-Allow-Methods': 'POST,OPTIONS',
  'Content-Type': 'application/json',
}

interface Body {
  wouldRecommend: boolean
  organizationRating: number
  satisfactionRating: number
  comments?: string
}

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' }
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ message: 'Method not allowed' }) }
  }

  const token = event.pathParameters?.token?.trim()
  if (!token) {
    return { statusCode: 400, headers, body: JSON.stringify({ message: 'Token requerido' }) }
  }

  let body: Body
  try {
    body = JSON.parse(event.body || '{}') as Body
  } catch {
    return { statusCode: 400, headers, body: JSON.stringify({ message: 'JSON inválido' }) }
  }

  const { wouldRecommend, organizationRating, satisfactionRating, comments } = body
  if (typeof wouldRecommend !== 'boolean') {
    return { statusCode: 400, headers, body: JSON.stringify({ message: 'wouldRecommend (boolean) requerido' }) }
  }
  if (
    typeof organizationRating !== 'number' ||
    organizationRating < 1 ||
    organizationRating > 5 ||
    !Number.isInteger(organizationRating)
  ) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ message: 'organizationRating debe ser entero 1–5' }),
    }
  }
  if (
    typeof satisfactionRating !== 'number' ||
    satisfactionRating < 1 ||
    satisfactionRating > 10 ||
    !Number.isInteger(satisfactionRating)
  ) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ message: 'satisfactionRating debe ser entero 1–10' }),
    }
  }

  const commentsTrim =
    typeof comments === 'string' ? comments.trim().slice(0, 4000) : ''

  try {
    const invRes = await doc.send(
      new GetCommand({ TableName: INVITATIONS_TABLE, Key: { token } })
    )
    const inv = invRes.Item as { eventId?: string; respondedAt?: string } | undefined
    if (!inv?.eventId) {
      return { statusCode: 404, headers, body: JSON.stringify({ message: 'Encuesta no encontrada' }) }
    }
    if (inv.respondedAt) {
      return {
        statusCode: 409,
        headers,
        body: JSON.stringify({ message: 'Ya enviaste tu respuesta. Gracias.' }),
      }
    }

    const eventId = inv.eventId
    const responseId = randomUUID()
    const respondedAt = new Date().toISOString()

    try {
      await doc.send(
        new TransactWriteCommand({
          TransactItems: [
            {
              Update: {
                TableName: INVITATIONS_TABLE,
                Key: { token },
                UpdateExpression: 'SET respondedAt = :ra',
                ConditionExpression: 'attribute_not_exists(respondedAt)',
                ExpressionAttributeValues: { ':ra': respondedAt },
              },
            },
            {
              Put: {
                TableName: RESPONSES_TABLE,
                Item: {
                  responseId,
                  eventId,
                  token,
                  wouldRecommend,
                  organizationRating,
                  satisfactionRating,
                  respondedAt,
                  ...(commentsTrim ? { comments: commentsTrim } : {}),
                },
              },
            },
          ],
        })
      )
    } catch (e: unknown) {
      const name = e && typeof e === 'object' && 'name' in e ? (e as { name: string }).name : ''
      if (name === 'TransactionCanceledException') {
        return {
          statusCode: 409,
          headers,
          body: JSON.stringify({ message: 'Ya enviaste tu respuesta. Gracias.' }),
        }
      }
      throw e
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: '¡Gracias! Tu opinión fue registrada.', responseId }),
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error(err)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: 'Error al guardar respuesta', error: msg }),
    }
  }
}

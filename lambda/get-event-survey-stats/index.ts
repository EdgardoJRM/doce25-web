import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb'
import { requireCognitoAdmin, corsHeaders } from './requireCognitoAdmin'

const doc = DynamoDBDocumentClient.from(new DynamoDBClient({}))

const INVITATIONS_TABLE = process.env.SURVEY_INVITATIONS_TABLE || 'Dosce25-SurveyInvitations'
const RESPONSES_TABLE = process.env.SURVEY_RESPONSES_TABLE || 'Dosce25-SurveyResponses'

async function queryAll<T>(params: {
  TableName: string
  IndexName: string
  KeyConditionExpression: string
  ExpressionAttributeValues: Record<string, unknown>
}): Promise<T[]> {
  const out: T[] = []
  let startKey: Record<string, unknown> | undefined
  do {
    const res = await doc.send(
      new QueryCommand({
        ...params,
        ExclusiveStartKey: startKey,
      })
    )
    out.push(...((res.Items || []) as T[]))
    startKey = res.LastEvaluatedKey
  } while (startKey)
  return out
}

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' }
  }

  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, headers: corsHeaders, body: JSON.stringify({ message: 'Method not allowed' }) }
  }

  const admin = await requireCognitoAdmin(event)
  if (!admin.ok) return admin.response

  const eventId = event.pathParameters?.eventId
  if (!eventId) {
    return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ message: 'eventId requerido' }) }
  }

  try {
    const invitations = await queryAll<{
      respondedAt?: string
      sentAt?: string
    }>({
      TableName: INVITATIONS_TABLE,
      IndexName: 'EventIdIndex',
      KeyConditionExpression: 'eventId = :e',
      ExpressionAttributeValues: { ':e': eventId },
    })

    const responses = await queryAll<{
      wouldRecommend?: boolean
      organizationRating?: number
      satisfactionRating?: number
      comments?: string
      respondedAt?: string
    }>({
      TableName: RESPONSES_TABLE,
      IndexName: 'EventIdIndex',
      KeyConditionExpression: 'eventId = :e',
      ExpressionAttributeValues: { ':e': eventId },
    })

    const totalSent = invitations.length
    const totalResponded = responses.length
    const responseRate =
      totalSent > 0 ? Math.round((totalResponded / totalSent) * 1000) / 10 : 0

    const recommends = responses.filter((r) => r.wouldRecommend === true).length
    const recommendPercent =
      totalResponded > 0 ? Math.round((recommends / totalResponded) * 1000) / 10 : 0

    const orgSum = responses.reduce((s, r) => s + (r.organizationRating || 0), 0)
    const satSum = responses.reduce((s, r) => s + (r.satisfactionRating || 0), 0)
    const avgOrganization =
      totalResponded > 0 ? Math.round((orgSum / totalResponded) * 100) / 100 : 0
    const avgSatisfaction =
      totalResponded > 0 ? Math.round((satSum / totalResponded) * 100) / 100 : 0

    const commentSamples = responses
      .filter((r) => (r.comments || '').trim().length > 0)
      .sort((a, b) => (b.respondedAt || '').localeCompare(a.respondedAt || ''))
      .slice(0, 10)
      .map((r) => ({
        text: (r.comments || '').trim(),
        respondedAt: r.respondedAt,
      }))

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        eventId,
        totalSent,
        totalResponded,
        responseRate,
        recommendPercent,
        avgOrganization,
        avgSatisfaction,
        comments: commentSamples,
      }),
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error(err)
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ message: 'Error al obtener estadísticas', error: msg }),
    }
  }
}

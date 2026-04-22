import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, QueryCommand, GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb'
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses'
import { randomUUID } from 'crypto'
import { requireCognitoAdmin, corsHeaders } from './requireCognitoAdmin'
import { buildSurveyInviteEmail } from './survey-invite'

const doc = DynamoDBDocumentClient.from(new DynamoDBClient({}))
const ses = new SESClient({})

const REGISTRATIONS_TABLE = process.env.REGISTRATIONS_TABLE || 'Dosce25-Registrations'
const EVENTS_TABLE = process.env.EVENTS_TABLE || 'Dosce25-Events'
const INVITATIONS_TABLE = process.env.SURVEY_INVITATIONS_TABLE || 'Dosce25-SurveyInvitations'
const SES_FROM = process.env.SES_FROM_EMAIL || 'doce25@precotracks.org'

function publicSurveyBaseUrl(): string {
  const raw = process.env.FRONTEND_URL || 'https://www.doce25.org'
  try {
    const u = raw.startsWith('http') ? raw : `https://${raw}`
    const parsed = new URL(u)
    let host = parsed.hostname.toLowerCase()
    if (host === 'doce25.org' || host === 'dosce25.org') host = 'www.doce25.org'
    return `${parsed.protocol}//${host}`.replace(/\/$/, '')
  } catch {
    return 'https://www.doce25.org'
  }
}

function firstName(fullName: string | undefined, fallbackName: string | undefined): string {
  const s = (fullName || fallbackName || '').trim()
  if (!s) return ''
  return s.split(/\s+/)[0] || ''
}

const MS_BETWEEN_SENDS = 72 // ~14 emails/sec max

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' }
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: corsHeaders, body: JSON.stringify({ message: 'Method not allowed' }) }
  }

  const admin = await requireCognitoAdmin(event)
  if (!admin.ok) return admin.response

  const eventId = event.pathParameters?.eventId
  if (!eventId) {
    return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ message: 'eventId requerido' }) }
  }

  try {
    const ev = await doc.send(
      new GetCommand({ TableName: EVENTS_TABLE, Key: { eventId } })
    )
    if (!ev.Item) {
      return { statusCode: 404, headers: corsHeaders, body: JSON.stringify({ message: 'Evento no encontrado' }) }
    }
    const eventName = (ev.Item.name as string) || 'el evento'

    const regs: Record<string, unknown>[] = []
    let startKey: Record<string, unknown> | undefined
    do {
      const q = await doc.send(
        new QueryCommand({
          TableName: REGISTRATIONS_TABLE,
          IndexName: 'EventIdIndex',
          KeyConditionExpression: 'eventId = :e',
          ExpressionAttributeValues: { ':e': eventId },
          ExclusiveStartKey: startKey,
        })
      )
      regs.push(...(q.Items || []))
      startKey = q.LastEvaluatedKey
    } while (startKey)

    const checkedIn = regs.filter((r) => r.checkedIn === true && (r.email as string)?.trim())

    let created = 0
    let skippedAlreadyInvited = 0
    let skippedNoEmail = 0
    let emailsSent = 0
    const errors: string[] = []

    for (const r of checkedIn) {
      const registrationId = r.registrationId as string
      const email = (r.email as string).trim().toLowerCase()
      if (!email) {
        skippedNoEmail++
        continue
      }

      const existing = await doc.send(
        new QueryCommand({
          TableName: INVITATIONS_TABLE,
          IndexName: 'RegistrationIdIndex',
          KeyConditionExpression: 'registrationId = :rid',
          ExpressionAttributeValues: { ':rid': registrationId },
          Limit: 1,
        })
      )
      if (existing.Items && existing.Items.length > 0) {
        skippedAlreadyInvited++
        continue
      }

      const token = randomUUID()
      const now = new Date().toISOString()
      await doc.send(
        new PutCommand({
          TableName: INVITATIONS_TABLE,
          Item: {
            token,
            eventId,
            registrationId,
            email,
            fullName: (r.fullName as string) || (r.name as string) || '',
            sentAt: now,
          },
        })
      )
      created++

      const base = publicSurveyBaseUrl()
      const surveyUrl = `${base}/encuesta/${token}`
      const fn = firstName(r.fullName as string, r.name as string)
      const { subject, text, html } = buildSurveyInviteEmail({
        participantFirstName: fn,
        eventName,
        surveyUrl,
      })

      try {
        await ses.send(
          new SendEmailCommand({
            Source: `Doce25 <${SES_FROM}>`,
            Destination: { ToAddresses: [email] },
            Message: {
              Subject: { Data: subject, Charset: 'UTF-8' },
              Body: {
                Text: { Data: text, Charset: 'UTF-8' },
                Html: { Data: html, Charset: 'UTF-8' },
              },
            },
          })
        )
        emailsSent++
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e)
        errors.push(`${email}: ${msg}`)
      }

      await new Promise((res) => setTimeout(res, MS_BETWEEN_SENDS))
    }

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        eventId,
        eventName,
        checkedInWithEmail: checkedIn.length,
        invitationsNewlyCreated: created,
        skippedAlreadyHadInvitation: skippedAlreadyInvited,
        skippedNoEmail,
        emailsSentThisRun: emailsSent,
        errors: errors.length ? errors : undefined,
      }),
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error(err)
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ message: 'Error al enviar encuesta', error: msg }),
    }
  }
}

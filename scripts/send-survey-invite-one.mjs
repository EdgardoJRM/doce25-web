#!/usr/bin/env node
/**
 * Envía UNA invitación de encuesta por SES (mismo HTML/texto que el envío masivo del admin),
 * creando un token nuevo en Dosce25-SurveyInvitations.
 *
 * Sirve para: probarte el correo tú mismo, reenviar a alguien, o si el masivo los saltó
 * (ya tenían invitación) y quieres un enlace nuevo.
 *
 * Requiere credenciales AWS con permiso a DynamoDB (Put/Get) y SES SendEmail.
 *
 * Uso:
 *   export EVENT_ID='uuid-del-evento'
 *   export REGISTRATION_ID='uuid-del-registro'   # el mismo registrationId de Dosce25-Registrations
 *   export TO_EMAIL='tu@email.com'
 *   export FULL_NAME='Tu Nombre'                 # opcional
 *   export FRONTEND_URL='https://www.doce25.org'  # dominio donde carga /encuesta/[token]
 *   export AWS_REGION=us-east-1                  # opcional
 *   node scripts/send-survey-invite-one.mjs
 *
 * Mantén el HTML/texto alineado con: lambda/send-event-survey/survey-invite.ts
 */

import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb'
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses'
import { randomUUID } from 'crypto'

const region = process.env.AWS_REGION || 'us-east-1'
const doc = DynamoDBDocumentClient.from(new DynamoDBClient({ region }))
const ses = new SESClient({ region })

const EVENTS_TABLE = process.env.EVENTS_TABLE || 'Dosce25-Events'
const INVITATIONS_TABLE = process.env.SURVEY_INVITATIONS_TABLE || 'Dosce25-SurveyInvitations'
const SES_FROM = process.env.SES_FROM_EMAIL || 'doce25@precotracks.org'

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function buildSurveyInviteEmail(opts) {
  const { participantFirstName, eventName, surveyUrl } = opts
  const safeName = participantFirstName || 'Participante'
  const subject = `Tu opinión sobre ${eventName} — Doce25`

  const text = `Hola ${safeName},

Gracias por participar en ${eventName}. Tu feedback nos ayuda a mejorar futuras limpiezas.

Responde esta breve encuesta (menos de 1 minuto):
${surveyUrl}

— Equipo Doce25
Fundación Tortuga Club PR`

  const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f8fafc;padding:24px 12px;">
    <tr><td align="center">
      <table role="presentation" width="100%" style="max-width:560px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(15,23,42,.08);">
        <tr><td style="background:linear-gradient(135deg,#0ea5e9 0%,#0369a1 100%);padding:28px 24px;">
          <p style="margin:0;color:#e0f2fe;font-size:14px;">Doce25</p>
          <h1 style="margin:8px 0 0;color:#ffffff;font-size:22px;line-height:1.3;">Tu opinión importa</h1>
        </td></tr>
        <tr><td style="padding:28px 24px;color:#334155;font-size:16px;line-height:1.6;">
          <p style="margin:0 0 16px;">Hola <strong>${escapeHtml(safeName)}</strong>,</p>
          <p style="margin:0 0 16px;">Gracias por participar en <strong>${escapeHtml(eventName)}</strong>. Tu feedback nos ayuda a mejorar futuras limpiezas de costas.</p>
          <p style="margin:0 0 24px;">Solo te tomará un minuto.</p>
          <table role="presentation" cellspacing="0" cellpadding="0"><tr><td style="border-radius:9999px;background:linear-gradient(90deg,#f97316,#ea580c);">
            <a href="${surveyUrl}" style="display:inline-block;padding:14px 28px;color:#ffffff;font-weight:700;text-decoration:none;font-size:16px;">Responder encuesta</a>
          </td></tr></table>
          <p style="margin:24px 0 0;font-size:13px;color:#64748b;">Si el botón no funciona, copia y pega este enlace en tu navegador:<br/>
          <a href="${surveyUrl}" style="color:#0284c7;word-break:break-all;">${surveyUrl}</a></p>
        </td></tr>
        <tr><td style="padding:16px 24px;background:#f1f5f9;font-size:12px;color:#64748b;">
          Fundación Tortuga Club PR · Doce25
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`

  return { subject, text, html }
}

function publicSurveyBaseUrl(raw) {
  const u = raw.startsWith('http') ? raw : `https://${raw}`
  try {
    const parsed = new URL(u)
    let host = parsed.hostname.toLowerCase()
    if (host === 'doce25.org' || host === 'dosce25.org') host = 'www.doce25.org'
    return `${parsed.protocol}//${host}`.replace(/\/$/, '')
  } catch {
    return 'https://www.doce25.org'
  }
}

async function main() {
  const EVENT_ID = process.env.EVENT_ID?.trim()
  const REGISTRATION_ID = process.env.REGISTRATION_ID?.trim()
  const TO_EMAIL = process.env.TO_EMAIL?.trim().toLowerCase()
  const FULL_NAME = (process.env.FULL_NAME || 'Participante').trim()
  const FRONTEND_URL = process.env.FRONTEND_URL || 'https://www.doce25.org'

  if (!EVENT_ID || !REGISTRATION_ID || !TO_EMAIL) {
    console.error(
      'Faltan variables: EVENT_ID, REGISTRATION_ID, TO_EMAIL (ver comentario al inicio del script).'
    )
    process.exit(1)
  }

  const ev = await doc.send(
    new GetCommand({ TableName: EVENTS_TABLE, Key: { eventId: EVENT_ID } })
  )
  if (!ev.Item) {
    console.error('Evento no encontrado en DynamoDB:', EVENT_ID)
    process.exit(1)
  }
  const eventName = ev.Item.name || 'Evento Doce25'

  const token = randomUUID()
  const now = new Date().toISOString()
  await doc.send(
    new PutCommand({
      TableName: INVITATIONS_TABLE,
      Item: {
        token,
        eventId: EVENT_ID,
        registrationId: REGISTRATION_ID,
        email: TO_EMAIL,
        fullName: FULL_NAME,
        sentAt: now,
      },
    })
  )

  const base = publicSurveyBaseUrl(FRONTEND_URL)
  const surveyUrl = `${base}/encuesta/${token}`
  const firstName = FULL_NAME.split(/\s+/)[0] || 'Participante'
  const { subject, text, html } = buildSurveyInviteEmail({
    participantFirstName: firstName,
    eventName,
    surveyUrl,
  })

  await ses.send(
    new SendEmailCommand({
      Source: `Doce25 <${SES_FROM}>`,
      Destination: { ToAddresses: [TO_EMAIL] },
      Message: {
        Subject: { Data: subject, Charset: 'UTF-8' },
        Body: {
          Text: { Data: text, Charset: 'UTF-8' },
          Html: { Data: html, Charset: 'UTF-8' },
        },
      },
    })
  )

  console.log('Correo enviado a', TO_EMAIL)
  console.log('Enlace (mismo que en el correo):', surveyUrl)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

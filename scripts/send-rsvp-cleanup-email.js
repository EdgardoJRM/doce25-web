#!/usr/bin/env node

/**
 * Envía correo RSVP para confirmar asistencia a la limpieza del domingo 12 de abril de 2026.
 *
 * Uso:
 *   node scripts/send-rsvp-cleanup-email.js <eventId> [--before=YYYY-MM-DD] [--dry-run]
 *
 * Requiere en .env.local:
 *   NEXT_PUBLIC_API_ENDPOINT (base de la API para enlaces /rsvp/confirm)
 *   JWT_SECRET o RSVP_LINK_SECRET (debe coincidir con la Lambda desplegada)
 */

const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses')
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb')
const { DynamoDBDocumentClient, QueryCommand } = require('@aws-sdk/lib-dynamodb')
const crypto = require('crypto')
require('dotenv').config({ path: '.env.local' })

const AWS_REGION = process.env.AWS_REGION || 'us-east-1'
const SES_FROM_EMAIL = process.env.SES_FROM_EMAIL || 'doce25@precotracks.org'
const REGISTRATIONS_TABLE = process.env.REGISTRATIONS_TABLE || 'Dosce25-Registrations'
const API_BASE = (process.env.NEXT_PUBLIC_API_ENDPOINT || process.env.API_ENDPOINT || '').replace(/\/$/, '')
const RSVP_SECRET = process.env.RSVP_LINK_SECRET || process.env.JWT_SECRET

const RSVP_FIELD = 'rsvpCleanup20260412'
const TOKEN_EXP_DAYS = 120
const DEFAULT_BEFORE = '2026-03-22'

const sesClient = new SESClient({ region: AWS_REGION })
const dynamoClient = DynamoDBDocumentClient.from(new DynamoDBClient({ region: AWS_REGION }))

function base64UrlEncode(buf) {
  return buf
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

function signRsvpToken(eventId, registrationId, secret) {
  const exp = Math.floor(Date.now() / 1000) + TOKEN_EXP_DAYS * 24 * 60 * 60
  const payload = { e: eventId, r: registrationId, exp }
  const payloadB64 = base64UrlEncode(Buffer.from(JSON.stringify(payload), 'utf8'))
  const sig = crypto.createHmac('sha256', secret).update(payloadB64).digest()
  return `${payloadB64}.${base64UrlEncode(sig)}`
}

/** Fin del día en hora estándar de Puerto Rico (UTC-4, sin DST): 23:59:59.999 local = +4h UTC */
function endOfDayPuertoRico(yyyyMmDd) {
  const [y, m, d] = yyyyMmDd.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d, 23 + 4, 59, 59, 999))
}

function buildLinks(eventId, registrationId) {
  if (!API_BASE) throw new Error('NEXT_PUBLIC_API_ENDPOINT o API_ENDPOINT es requerido para los enlaces RSVP')
  if (!RSVP_SECRET) throw new Error('RSVP_LINK_SECRET o JWT_SECRET es requerido (debe coincidir con la Lambda)')
  const token = signRsvpToken(eventId, registrationId, RSVP_SECRET)
  const enc = encodeURIComponent(token)
  const yes = `${API_BASE}/rsvp/confirm?token=${enc}&answer=yes`
  const no = `${API_BASE}/rsvp/confirm?token=${enc}&answer=no`
  return { yes, no }
}

function buildEmailHtml(participantName) {
  const safeName = escapeHtml(participantName || 'Participante')
  return (yesUrl, noUrl) => `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #0ea5e9 0%, #14b8a6 100%); color: white; padding: 28px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 28px; border-radius: 0 0 8px 8px; }
    .btn-row { text-align: center; margin: 28px 0; }
    .btn { display: inline-block; padding: 14px 28px; margin: 8px; border-radius: 8px; font-weight: bold; text-decoration: none; color: #fff !important; }
    .btn-yes { background: #059669; }
    .btn-no { background: #6b7280; }
    .date-box { background: #fff; border: 2px solid #0ea5e9; padding: 16px; text-align: center; border-radius: 8px; margin: 20px 0; }
    .footer { font-size: 12px; color: #6b7280; margin-top: 24px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin:0;font-size:1.5rem;">🌊 Doce25</h1>
      <p style="margin:8px 0 0;">Confirmación — Limpieza de playa</p>
    </div>
    <div class="content">
      <p>Saludos, <strong>${safeName}</strong>,</p>
      <p>Esperamos que te encuentres bien. La limpieza de playa quedó reprogramada para el <strong>domingo 12 de abril de 2026</strong>.</p>
      <div class="date-box">
        <p style="margin:0;color:#0ea5e9;font-weight:bold;">📅 ¿Podrás asistir ese día?</p>
        <p style="margin:8px 0 0;font-size:0.95rem;">Un clic nos ayuda a planificar materiales y seguridad.</p>
      </div>
      <div class="btn-row">
        <a class="btn btn-yes" href="${yesUrl}">Sí, asisto</a>
        <a class="btn btn-no" href="${noUrl}">No podré asistir</a>
      </div>
      <p style="font-size:0.9rem;color:#4b5563;">Si los botones no funcionan, copia y pega en el navegador el enlace que corresponda (responde solo una vez).</p>
      <p class="footer">Gracias por tu compromiso con nuestras playas.<br/>Doce25</p>
    </div>
  </div>
</body>
</html>
`
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function buildEmailText(participantName, yesUrl, noUrl) {
  return `Saludos ${participantName || 'Participante'},

La limpieza de playa es el domingo 12 de abril de 2026.

¿Podrás asistir? Abre solo uno de estos enlaces en el navegador (una sola respuesta):

Sí, asisto:
${yesUrl}

No podré asistir:
${noUrl}

Gracias,
Doce25
`
}

async function getRegistrationsByEvent(eventId) {
  const result = await dynamoClient.send(
    new QueryCommand({
      TableName: REGISTRATIONS_TABLE,
      IndexName: 'EventIdIndex',
      KeyConditionExpression: 'eventId = :eventId',
      ExpressionAttributeValues: { ':eventId': eventId },
    })
  )
  return result.Items || []
}

async function sendEmail(to, subject, html, text) {
  await sesClient.send(
    new SendEmailCommand({
      Source: SES_FROM_EMAIL,
      Destination: { ToAddresses: [to] },
      Message: {
        Subject: { Data: subject, Charset: 'UTF-8' },
        Body: {
          Html: { Data: html, Charset: 'UTF-8' },
          Text: { Data: text, Charset: 'UTF-8' },
        },
      },
    })
  )
}

function parseArgs(argv) {
  const out = { eventId: null, before: DEFAULT_BEFORE, dryRun: false }
  for (const a of argv) {
    if (a === '--dry-run') out.dryRun = true
    else if (a.startsWith('--before=')) out.before = a.slice('--before='.length)
    else if (!a.startsWith('-') && !out.eventId) out.eventId = a
  }
  return out
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  const { eventId, before, dryRun } = args

  if (!eventId) {
    console.error('Uso: node scripts/send-rsvp-cleanup-email.js <eventId> [--before=YYYY-MM-DD] [--dry-run]')
    process.exit(1)
  }

  if (!RSVP_SECRET) {
    console.error('Falta RSVP_LINK_SECRET o JWT_SECRET en .env.local')
    process.exit(1)
  }
  if (!API_BASE && !dryRun) {
    console.error('Falta NEXT_PUBLIC_API_ENDPOINT para construir enlaces (o usa --dry-run para solo contar)')
    process.exit(1)
  }

  const cutoff = endOfDayPuertoRico(before)
  console.log(`\n📅 Corte de registro: createdAt <= ${cutoff.toISOString()} (fin del día ${before} en PR)\n`)

  let registrations = await getRegistrationsByEvent(eventId)
  registrations = registrations.filter((r) => {
    const ca = r.createdAt ? new Date(r.createdAt) : null
    return ca && ca <= cutoff
  })

  const seen = new Map()
  const unique = []
  for (const r of registrations) {
    const em = (r.email || '').toLowerCase().trim()
    if (!em || seen.has(em)) continue
    seen.set(em, true)
    unique.push(r)
  }

  console.log(`📊 Registros tras filtro + dedupe por email: ${unique.length}\n`)

  if (dryRun) {
    unique.slice(0, 15).forEach((r) => console.log(`  - ${r.email} (${r.fullName || r.name})`))
    if (unique.length > 15) console.log(`  ... y ${unique.length - 15} más`)
    console.log('\n(dry-run: no se enviaron correos)\n')
    return
  }

  const subject = '¿Confirmas tu asistencia? — Limpieza 12 de abril (Doce25)'
  let ok = 0
  let fail = 0

  for (let i = 0; i < unique.length; i++) {
    const r = unique[i]
    const name = r.fullName || r.name || 'Participante'
    const { yes, no } = buildLinks(eventId, r.registrationId)
    const htmlFn = buildEmailHtml(name)
    const html = htmlFn(yes, no)
    const text = buildEmailText(name, yes, no)
    try {
      await sendEmail(r.email, subject, html, text)
      console.log(`✅ ${r.email} (${name})`)
      ok++
    } catch (e) {
      console.error(`❌ ${r.email}:`, e.message)
      fail++
    }
    if (i < unique.length - 1) await new Promise((res) => setTimeout(res, 100))
  }

  console.log(`\n✅ ${ok}  ❌ ${fail}  Total ${unique.length}\n`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

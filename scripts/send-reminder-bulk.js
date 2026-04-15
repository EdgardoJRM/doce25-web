#!/usr/bin/env node
/**
 * Envía el email de recordatorio a TODOS los participantes del evento,
 * incluyendo su QR de entrada (descargado desde S3) embebido en el HTML.
 *
 * Uso:
 *   node scripts/send-reminder-bulk.js
 *   DRY_RUN=1 node scripts/send-reminder-bulk.js          # solo lista, no envía
 *   TO_OVERRIDE=tu@email.com node scripts/send-reminder-bulk.js  # prueba a un solo email
 *   LIMIT=5 node scripts/send-reminder-bulk.js            # envía solo los primeros N
 *
 * Requiere en .env.local:
 *   AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION
 *   SES_FROM_EMAIL   (ej. doce25@precotracks.org)
 *   REGISTRATIONS_TABLE (default: Dosce25-Registrations)
 *   S3_BUCKET        (default: dosce25-qr-codes)
 *   FRONTEND_BASE    (default: https://doce25.precotracks.org)
 */

const path = require('path')
const fs   = require('fs')
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') })

const { DynamoDBClient }                   = require('@aws-sdk/client-dynamodb')
const { DynamoDBDocumentClient, QueryCommand } = require('@aws-sdk/lib-dynamodb')
const { S3Client, GetObjectCommand }        = require('@aws-sdk/client-s3')
const { SESClient, SendRawEmailCommand }    = require('@aws-sdk/client-ses')

// ── Configuración ────────────────────────────────────────────────────────────
const REGION     = process.env.AWS_REGION            || 'us-east-1'
const TABLE      = process.env.REGISTRATIONS_TABLE   || 'Dosce25-Registrations'
const EVENT_ID   = process.env.EVENT_ID              || 'ea44d757-de19-4a13-aa9f-afbf0da433f2'
const S3_BUCKET  = process.env.S3_BUCKET             || 'dosce25-qr-codes'
const FROM_EMAIL = process.env.SES_FROM_EMAIL        || 'doce25@precotracks.org'
const DRY        = process.env.DRY_RUN  === '1'
const TO_OVERRIDE = process.env.TO_OVERRIDE || null   // para pruebas
const LIMIT      = process.env.LIMIT ? parseInt(process.env.LIMIT, 10) : null
const DELAY_MS   = 120   // pausa entre envíos (evitar throttle de SES)

const SUBJECT = process.env.EMAIL_SUBJECT || '¡Nos vemos hoy! Tu entrada al evento 🌊'
const TEMPLATE_PATH = process.env.TEMPLATE_PATH
  ? path.join(__dirname, '..', process.env.TEMPLATE_PATH)
  : path.join(__dirname, '..', 'public', 'email-templates', 'recordatorio-playa-aviones-hoy.html')

const dynamo = DynamoDBDocumentClient.from(new DynamoDBClient({ region: REGION }))
const s3     = new S3Client({ region: REGION })
const ses    = new SESClient({ region: REGION })

// ── Helpers ──────────────────────────────────────────────────────────────────

function htmlToText(html) {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

async function getAllRegistrations() {
  const items = []
  let lastKey
  do {
    const res = await dynamo.send(new QueryCommand({
      TableName: TABLE,
      IndexName: 'EventIdIndex',
      KeyConditionExpression: 'eventId = :eid',
      ExpressionAttributeValues: { ':eid': EVENT_ID },
      ExclusiveStartKey: lastKey,
    }))
    items.push(...(res.Items || []))
    lastKey = res.LastEvaluatedKey
  } while (lastKey)
  return items
}

async function getQrFromS3(registrationId) {
  const key = `qr-codes/${registrationId}.png`
  try {
    const res = await s3.send(new GetObjectCommand({ Bucket: S3_BUCKET, Key: key }))
    const chunks = []
    for await (const chunk of res.Body) chunks.push(chunk)
    return Buffer.concat(chunks)
  } catch (err) {
    console.warn(`  ⚠️  QR no encontrado en S3 para ${registrationId}: ${err.message}`)
    return null
  }
}

async function sendEmail(toEmail, htmlBody, qrBuffer) {
  const textBody = htmlToText(htmlBody)
  const boundary    = `----Doce25_${Date.now()}_${Math.random().toString(36).slice(2)}`
  const boundaryAlt = `----Doce25Alt_${Date.now()}_${Math.random().toString(36).slice(2)}`

  const lines = [
    `From: Doce25 <${FROM_EMAIL}>`,
    `Reply-To: info@doce25.org`,
    `To: ${toEmail}`,
    `Subject: ${SUBJECT}`,
    `MIME-Version: 1.0`,
    `Content-Type: multipart/mixed; boundary="${boundary}"`,
    ``,
    `--${boundary}`,
    `Content-Type: multipart/alternative; boundary="${boundaryAlt}"`,
    ``,
    `--${boundaryAlt}`,
    `Content-Type: text/plain; charset=UTF-8`,
    `Content-Transfer-Encoding: 7bit`,
    ``,
    textBody,
    ``,
    `--${boundaryAlt}`,
    `Content-Type: text/html; charset=UTF-8`,
    `Content-Transfer-Encoding: 7bit`,
    ``,
    htmlBody,
    ``,
    `--${boundaryAlt}--`,
  ]

  if (qrBuffer) {
    lines.push(
      ``,
      `--${boundary}`,
      `Content-Type: image/png; name="entrada-qr.png"`,
      `Content-Transfer-Encoding: base64`,
      `Content-Disposition: inline; filename="entrada-qr.png"`,
      `Content-ID: <qrcode>`,
      ``,
      qrBuffer.toString('base64'),
    )
  }

  lines.push(``, `--${boundary}--`)

  await ses.send(new SendRawEmailCommand({
    RawMessage: { Data: Buffer.from(lines.join('\r\n')) },
  }))
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log(DRY ? '[DRY RUN] Sin envíos reales.' : 'Iniciando envío masivo de recordatorios...')
  console.log(`Evento: ${EVENT_ID} | Bucket S3: ${S3_BUCKET}`)
  if (TO_OVERRIDE) console.log(`🔀 Override destinatario → ${TO_OVERRIDE}`)
  if (LIMIT)       console.log(`🔢 Límite: ${LIMIT} envíos`)
  console.log('')

  const templateHtml = fs.readFileSync(TEMPLATE_PATH, 'utf8')

  const all = await getAllRegistrations()
  // Solo los que tienen email
  let registrations = all.filter(r => r.email && r.email.trim())
  console.log(`Total registros con email: ${registrations.length} / ${all.length}`)

  // Si hay TO_OVERRIDE, enviar solo el registro del propio destinatario (modo prueba)
  if (TO_OVERRIDE) {
    const match = registrations.find(r => r.email.trim().toLowerCase() === TO_OVERRIDE.toLowerCase())
    if (match) {
      console.log(`✅ Registro encontrado para ${TO_OVERRIDE}: ${match.name || match.fullName}`)
      registrations = [match]
    } else {
      console.log(`⚠️  No hay registro con email ${TO_OVERRIDE} — usando el primero de la lista`)
      registrations = registrations.slice(0, 1)
    }
  } else if (LIMIT) {
    registrations = registrations.slice(0, LIMIT)
  }

  let sent = 0, skipped = 0, failed = 0

  for (const reg of registrations) {
    const toEmail  = reg.email.trim()
    const nombre   = (reg.name || reg.fullName || '').split(' ')[0]
    const nombreParte = nombre ? ` ${nombre}` : ''

    // Personalizar HTML
    let html = templateHtml.replace(/\{\{NOMBRE_PARTE\}\}/g, nombreParte)

    // QR desde S3
    const qrBuffer = await getQrFromS3(reg.registrationId)
    if (!qrBuffer) {
      // Sin QR: reemplazar la sección cid por mensaje de fallback
      html = html.replace(
        '<img src="cid:qrcode"',
        `<p style="color:#64748b;font-size:13px;">QR no disponible — contacta a info@doce25.org</p><img style="display:none" src="cid:qrcode"`,
      )
    }

    console.log(`  → ${toEmail} (${reg.name || reg.fullName})${qrBuffer ? ' ✅ QR' : ' ⚠️  sin QR'}`)

    if (DRY) { skipped++; continue }

    try {
      await sendEmail(toEmail, html, qrBuffer)
      sent++
    } catch (err) {
      console.error(`     ❌ Error: ${err.message}`)
      failed++
    }

    await new Promise(r => setTimeout(r, DELAY_MS))
  }

  console.log('')
  console.log(`Listo. Enviados: ${sent} | Saltados (dry): ${skipped} | Fallidos: ${failed}`)
}

main().catch(e => { console.error(e); process.exit(1) })

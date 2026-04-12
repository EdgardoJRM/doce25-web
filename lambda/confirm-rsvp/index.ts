import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, GetCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb'
import { createHmac, timingSafeEqual } from 'crypto'

const dynamoClient = DynamoDBDocumentClient.from(new DynamoDBClient({}))

const TABLES = {
  REGISTRATIONS: process.env.REGISTRATIONS_TABLE || 'Dosce25-Registrations',
}

const RSVP_FIELD = 'rsvpCleanup20260412'
const RSVP_AT_FIELD = 'rsvpCleanup20260412At'

function getSecret(): string {
  const s = process.env.RSVP_LINK_SECRET || process.env.JWT_SECRET
  if (!s) {
    throw new Error('RSVP_LINK_SECRET or JWT_SECRET must be set')
  }
  return s
}

function base64UrlEncode(buf: Buffer): string {
  return buf
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

function base64UrlDecode(s: string): Buffer {
  let b = s.replace(/-/g, '+').replace(/_/g, '/')
  while (b.length % 4) b += '='
  return Buffer.from(b, 'base64')
}

interface Payload {
  e: string
  r: string
  exp: number
}

function verifyToken(token: string): Payload | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 2) return null
    const [payloadB64, sigB64] = parts
    const secret = getSecret()
    const expectedSig = createHmac('sha256', secret).update(payloadB64).digest()
    const gotSig = base64UrlDecode(sigB64)
    if (expectedSig.length !== gotSig.length || !timingSafeEqual(expectedSig, gotSig)) {
      return null
    }
    const payload = JSON.parse(base64UrlDecode(payloadB64).toString('utf8')) as Payload
    if (!payload.e || !payload.r || !payload.exp) return null
    if (Date.now() / 1000 > payload.exp) return null
    return payload
  } catch {
    return null
  }
}

function htmlPage(title: string, body: string, status: 'ok' | 'info' | 'err' = 'ok'): string {
  const color =
    status === 'ok' ? '#059669' : status === 'info' ? '#0ea5e9' : '#dc2626'
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <style>
    body { font-family: system-ui, sans-serif; background: #f0fdfa; margin: 0; padding: 24px; }
    .card { max-width: 480px; margin: 40px auto; background: #fff; border-radius: 12px; padding: 32px; box-shadow: 0 4px 24px rgba(0,0,0,.08); }
    h1 { color: ${color}; font-size: 1.5rem; margin-top: 0; }
    p { color: #374151; line-height: 1.6; }
    .logo { font-size: 2rem; margin-bottom: 8px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="logo">🌊</div>
    <h1>${title}</h1>
    ${body}
    <p style="margin-top:24px;font-size:0.875rem;color:#6b7280;">Doce25 — Limpieza de playas</p>
  </div>
</body>
</html>`
}

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const headersHtml = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'text/html; charset=utf-8',
  }

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: { 'Access-Control-Allow-Origin': '*' }, body: '' }
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: headersHtml,
      body: htmlPage('Método no permitido', '<p>Usa el enlace del correo.</p>', 'err'),
    }
  }

  const token = event.queryStringParameters?.token || ''
  const answerRaw = (event.queryStringParameters?.answer || '').toLowerCase()
  const answer = answerRaw === 'yes' || answerRaw === 'si' || answerRaw === 'sí' ? 'yes' : answerRaw === 'no' ? 'no' : ''

  if (!token || !answer) {
    return {
      statusCode: 400,
      headers: headersHtml,
      body: htmlPage(
        'Enlace incompleto',
        '<p>Falta información en el enlace. Abre el botón Sí o No del correo que te enviamos.</p>',
        'err'
      ),
    }
  }

  const payload = verifyToken(token)
  if (!payload) {
    return {
      statusCode: 400,
      headers: headersHtml,
      body: htmlPage(
        'Enlace inválido o vencido',
        '<p>El enlace ya no es válido o expiró. Si necesitas confirmar, escríbenos respondiendo al correo de Doce25.</p>',
        'err'
      ),
    }
  }

  const { e: eventId, r: registrationId } = payload

  try {
    const getResult = await dynamoClient.send(
      new GetCommand({
        TableName: TABLES.REGISTRATIONS,
        Key: { registrationId },
      })
    )

    const reg = getResult.Item
    if (!reg || reg.eventId !== eventId) {
      return {
        statusCode: 404,
        headers: headersHtml,
        body: htmlPage('Registro no encontrado', '<p>No encontramos tu inscripción.</p>', 'err'),
      }
    }

    const existing = reg[RSVP_FIELD] as string | undefined
    if (existing === 'yes' || existing === 'no') {
      const label = existing === 'yes' ? 'Sí, asistes' : 'No podrás asistir'
      return {
        statusCode: 200,
        headers: headersHtml,
        body: htmlPage(
          'Ya tenemos tu respuesta',
          `<p>Registramos anteriormente: <strong>${label}</strong>.</p><p>Si necesitas cambiar algo, responde al correo de Doce25.</p>`,
          'info'
        ),
      }
    }

    const now = new Date().toISOString()
    await dynamoClient.send(
      new UpdateCommand({
        TableName: TABLES.REGISTRATIONS,
        Key: { registrationId },
        UpdateExpression: `SET ${RSVP_FIELD} = :a, ${RSVP_AT_FIELD} = :t`,
        ExpressionAttributeValues: {
          ':a': answer,
          ':t': now,
        },
      })
    )

    if (answer === 'yes') {
      return {
        statusCode: 200,
        headers: headersHtml,
        body: htmlPage(
          '¡Gracias por confirmar!',
          '<p>Registramos que <strong>sí asistirás</strong> a la limpieza del domingo <strong>12 de abril de 2026</strong>.</p><p>Nos vemos en la playa. ¡Gracias por ser parte del cambio!</p>',
          'ok'
        ),
      }
    }

    return {
      statusCode: 200,
      headers: headersHtml,
      body: htmlPage(
        'Gracias por avisarnos',
        '<p>Registramos que <strong>no podrás asistir</strong> a la limpieza del 12 de abril.</p><p>Esperamos verte en una próxima actividad.</p>',
        'info'
      ),
    }
  } catch (err: any) {
    console.error('confirm-rsvp error', err)
    return {
      statusCode: 500,
      headers: headersHtml,
      body: htmlPage('Error', '<p>No pudimos guardar tu respuesta. Intenta de nuevo más tarde o escríbenos por correo.</p>', 'err'),
    }
  }
}

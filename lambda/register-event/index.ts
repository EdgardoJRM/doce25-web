import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, PutCommand, GetCommand, QueryCommand } from '@aws-sdk/lib-dynamodb'
import { v4 as uuidv4 } from 'uuid'
import * as QRCode from 'qrcode'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { SESClient, SendRawEmailCommand } from '@aws-sdk/client-ses'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import { readFileSync } from 'fs'
import { join } from 'path'

const dynamoClient = DynamoDBDocumentClient.from(new DynamoDBClient({}))
const s3Client = new S3Client({})
const sesClient = new SESClient({})

const TABLES = {
  EVENTS: 'Dosce25-Events',
  REGISTRATIONS: 'Dosce25-Registrations',
}

const ADMIN_NOTIFICATION_EMAILS = [
  'r.tirado@doce25.org',
  'info@doce25.org',
  'edgardoehernandezjr@gmail.com',
  'a.delvalle@doce25.org',
]

async function sendAdminNotification(data: {
  name: string
  fullName: string
  email: string
  phone?: string
  eventName: string
  eventDate: string
  eventLocation: string
  organization: string
  city: string
  ageRange: string
  gender: string
  registrationId: string
}) {
  const fromEmail = process.env.SES_FROM_EMAIL || 'doce25@precotracks.org'
  const subject = `🎉 Nuevo registro: ${data.fullName} → ${data.eventName}`

  const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 0; }
        .wrap { max-width: 580px; margin: 30px auto; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #0ea5e9 0%, #14b8a6 100%); padding: 28px 30px; }
        .header h2 { color: #fff; margin: 0; font-size: 20px; }
        .header p { color: rgba(255,255,255,0.85); margin: 6px 0 0; font-size: 14px; }
        .body { padding: 28px 30px; }
        .event-box { background: #f0fdf4; border-left: 4px solid #14b8a6; padding: 14px 16px; border-radius: 4px; margin-bottom: 24px; }
        .event-box p { margin: 0; font-size: 15px; font-weight: 600; color: #065f46; }
        .event-box span { font-size: 13px; color: #047857; font-weight: 400; }
        .row { display: flex; padding: 10px 0; border-bottom: 1px solid #f3f4f6; }
        .row:last-child { border-bottom: none; }
        .label { width: 140px; font-size: 13px; color: #6b7280; flex-shrink: 0; }
        .value { font-size: 14px; color: #111827; font-weight: 500; }
        .footer { background: #f9fafb; padding: 16px 30px; text-align: center; font-size: 12px; color: #9ca3af; }
        .badge { display: inline-block; background: #ecfdf5; color: #065f46; border: 1px solid #6ee7b7; border-radius: 99px; padding: 3px 10px; font-size: 12px; font-weight: 600; }
      </style>
    </head>
    <body>
      <div class="wrap">
        <div class="header">
          <h2>🎉 Nuevo registro recibido</h2>
          <p>Un participante se ha inscrito a un evento de Doce25</p>
        </div>
        <div class="body">
          <div class="event-box">
            <p>📅 ${data.eventName}</p>
            <span>${data.eventDate ? new Date(data.eventDate).toLocaleDateString('es-PR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : ''} · ${data.eventLocation}</span>
          </div>

          <div class="row"><span class="label">Nombre completo</span><span class="value">${data.fullName}</span></div>
          <div class="row"><span class="label">Email</span><span class="value">${data.email}</span></div>
          <div class="row"><span class="label">Teléfono</span><span class="value">${data.phone || '—'}</span></div>
          <div class="row"><span class="label">Organización</span><span class="value">${data.organization || '—'}</span></div>
          <div class="row"><span class="label">Ciudad</span><span class="value">${data.city || '—'}</span></div>
          <div class="row"><span class="label">Rango de edad</span><span class="value">${data.ageRange || '—'}</span></div>
          <div class="row"><span class="label">Género</span><span class="value">${data.gender || '—'}</span></div>
          <div class="row"><span class="label">ID Registro</span><span class="value" style="font-size:12px;color:#6b7280;">${data.registrationId}</span></div>

          <p style="margin-top:20px;font-size:13px;color:#6b7280;">
            Este es un aviso automático. Para gestionar registros visita el 
            <a href="https://doce25.precotracks.org/admin" style="color:#0ea5e9;">panel de administración</a>.
          </p>
        </div>
        <div class="footer">© ${new Date().getFullYear()} Doce25 · Fundación Tortuga Club PR, Inc.</div>
      </div>
    </body>
    </html>
  `

  const text = `Nuevo registro: ${data.fullName} → ${data.eventName}\n\nEmail: ${data.email}\nTeléfono: ${data.phone || '—'}\nOrganización: ${data.organization || '—'}\nCiudad: ${data.city || '—'}\nID: ${data.registrationId}`

  const boundary = `----=_Notif_${Date.now()}`
  const rawEmail = [
    `From: Doce25 <${fromEmail}>`,
    `To: ${ADMIN_NOTIFICATION_EMAILS.join(', ')}`,
    `Subject: ${subject}`,
    `MIME-Version: 1.0`,
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    ``,
    `--${boundary}`,
    `Content-Type: text/plain; charset=UTF-8`,
    ``,
    text,
    ``,
    `--${boundary}`,
    `Content-Type: text/html; charset=UTF-8`,
    ``,
    html,
    ``,
    `--${boundary}--`,
  ].join('\r\n')

  await sesClient.send(new SendRawEmailCommand({
    RawMessage: { Data: Buffer.from(rawEmail) },
  }))
}

// Generar código alternativo de 8 caracteres
function generateAlternativeCode(registrationId: string): string {
  return registrationId.substring(0, 8).toUpperCase()
}

// Cargar el logo local (más rápido que descargarlo)
function loadLogo(): Buffer | null {
  try {
    const logoPath = join(__dirname, 'doce25-logo.png')
    return readFileSync(logoPath)
  } catch (err) {
    console.error('Error loading logo:', err)
    return null
  }
}

// Helper: center text on page
function centerText(text: string, font: any, size: number, pageWidth: number): number {
  return (pageWidth - font.widthOfTextAtSize(text, size)) / 2
}

// Helper: draw dashed horizontal line
function drawDashedLine(page: any, x1: number, x2: number, y: number, color: any, dashLen = 4, gapLen = 4) {
  let x = x1
  while (x < x2) {
    page.drawLine({
      start: { x, y },
      end: { x: Math.min(x + dashLen, x2), y },
      color,
      thickness: 1,
    })
    x += dashLen + gapLen
  }
}

// Generar PDF profesional del ticket
async function generateTicketPDF(
  name: string,
  email: string,
  eventName: string,
  eventDate: string,
  eventLocation: string,
  qrCodeDataUrl: string,
  alternativeCode: string,
  registrationId: string,
  logoBuffer: Buffer | null
): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create()
  // Ticket size: wider than tall — like a real boarding-pass ticket
  const W = 595.28
  const H = 841.89
  const page = pdfDoc.addPage([W, H])

  const boldFont   = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica)

  // ── Color palette ──────────────────────────────────────────────
  const cyan      = rgb(0.055, 0.647, 0.914)   // #0ea5e9
  const teal      = rgb(0.082, 0.722, 0.647)   // #14b8a6
  const dark      = rgb(0.086, 0.110, 0.133)   // #16191c
  const midGray   = rgb(0.435, 0.463, 0.494)   // #6f7680
  const lightBg   = rgb(0.965, 0.980, 0.996)   // #f6fafe
  const border    = rgb(0.859, 0.898, 0.941)   // #dbe5f0
  const white     = rgb(1, 1, 1)
  const stubBg    = rgb(0.941, 0.980, 0.996)   // #f0faff

  // ── Page background ────────────────────────────────────────────
  page.drawRectangle({ x: 0, y: 0, width: W, height: H, color: rgb(0.949, 0.961, 0.976) })

  // ── HEADER BAND (gradient via two overlapping rects) ───────────
  const headerH = 210
  page.drawRectangle({ x: 0, y: H - headerH, width: W, height: headerH, color: cyan })
  // Teal accent strip on the right 40% of the header for a gradient feel
  page.drawRectangle({ x: W * 0.60, y: H - headerH, width: W * 0.40, height: headerH, color: teal, opacity: 0.55 })

  // Decorative circles in header
  page.drawEllipse({ x: W - 60,  y: H - 30,  xScale: 90,  yScale: 90,  color: white, opacity: 0.06 })
  page.drawEllipse({ x: W - 20,  y: H - 140, xScale: 60,  yScale: 60,  color: white, opacity: 0.06 })
  page.drawEllipse({ x: 30,      y: H - 190, xScale: 50,  yScale: 50,  color: white, opacity: 0.06 })

  // ── LOGO in header ─────────────────────────────────────────────
  let logoPlaced = false
  if (logoBuffer) {
    try {
      const logoImage = await pdfDoc.embedPng(logoBuffer)
      const maxLogoW = 160
      const maxLogoH = 70
      const natural   = logoImage.scale(1)
      const ratio     = Math.min(maxLogoW / natural.width, maxLogoH / natural.height)
      const logoW     = natural.width  * ratio
      const logoH     = natural.height * ratio
      const logoX     = (W - logoW) / 2
      const logoY     = H - headerH / 2 - logoH / 2 + 20
      page.drawImage(logoImage, { x: logoX, y: logoY, width: logoW, height: logoH })
      logoPlaced = true
    } catch (err) {
      console.error('Error embedding logo in PDF:', err)
    }
  }

  if (!logoPlaced) {
    // Fallback text logo
    const logoText = 'DOCE25'
    const logoSize = 44
    page.drawText(logoText, {
      x: centerText(logoText, boldFont, logoSize, W),
      y: H - headerH / 2 - logoSize / 2 + 22,
      size: logoSize, font: boldFont, color: white,
    })
  }

  // Tagline below logo
  const tagline = 'Fundación Tortuga Club PR, Inc.'
  page.drawText(tagline, {
    x: centerText(tagline, regularFont, 11, W),
    y: H - headerH + 18,
    size: 11, font: regularFont, color: rgb(0.85, 0.96, 1),
  })

  // ── MAIN TICKET CARD ──────────────────────────────────────────
  const cardX = 40
  const cardW = W - 80
  const cardTop = H - headerH - 20
  const stubH  = 110
  const cardH  = 490
  const cardY  = cardTop - cardH

  // Card shadow (offset rect)
  page.drawRectangle({ x: cardX + 4, y: cardY - 4, width: cardW, height: cardH, color: rgb(0.78, 0.82, 0.88), opacity: 0.4 })
  // Card body
  page.drawRectangle({ x: cardX, y: cardY, width: cardW, height: cardH, color: white })

  // ── CYAN LEFT ACCENT STRIP ────────────────────────────────────
  page.drawRectangle({ x: cardX, y: cardY, width: 6, height: cardH, color: cyan })

  // ── EVENT BADGE / LABEL ───────────────────────────────────────
  const badgeTxt = 'ENTRADA OFICIAL'
  const badgeW   = boldFont.widthOfTextAtSize(badgeTxt, 9) + 20
  page.drawRectangle({ x: cardX + 24, y: cardTop - 28, width: badgeW, height: 18, color: cyan })
  page.drawText(badgeTxt, { x: cardX + 34, y: cardTop - 23, size: 9, font: boldFont, color: white })

  // ── EVENT NAME ────────────────────────────────────────────────
  const evName = (eventName || 'Evento Doce25').toUpperCase()
  // Wrap long event names
  const evFontSize = evName.length > 30 ? 16 : 20
  page.drawText(evName, {
    x: cardX + 24,
    y: cardTop - 60,
    size: evFontSize,
    font: boldFont,
    color: dark,
    maxWidth: cardW - 48,
  })

  // ── DATE & LOCATION ROW ───────────────────────────────────────
  let infoY = cardTop - 95

  if (eventDate) {
    // Small cyan square as date icon
    page.drawRectangle({ x: cardX + 24, y: infoY - 3, width: 14, height: 14, color: cyan })
    page.drawText('F', { x: cardX + 27, y: infoY - 1, size: 9, font: boldFont, color: white })
    const dateLabel = 'FECHA'
    page.drawText(dateLabel, { x: cardX + 46, y: infoY + 6, size: 7, font: regularFont, color: midGray })
    page.drawText(eventDate, { x: cardX + 46, y: infoY - 4, size: 11, font: boldFont, color: dark })
    infoY -= 32
  }

  if (eventLocation) {
    // Small teal square as location icon
    page.drawRectangle({ x: cardX + 24, y: infoY - 3, width: 14, height: 14, color: teal })
    page.drawText('L', { x: cardX + 27, y: infoY - 1, size: 9, font: boldFont, color: white })
    const locLabel = 'LUGAR'
    page.drawText(locLabel, { x: cardX + 46, y: infoY + 6, size: 7, font: regularFont, color: midGray })
    page.drawText(eventLocation, { x: cardX + 46, y: infoY - 4, size: 11, font: boldFont, color: dark, maxWidth: cardW - 100 })
    infoY -= 32
  }

  // ── DIVIDER ───────────────────────────────────────────────────
  infoY -= 8
  page.drawLine({ start: { x: cardX + 24, y: infoY }, end: { x: cardX + cardW - 24, y: infoY }, color: border, thickness: 0.8 })
  infoY -= 20

  // ── ATTENDEE SECTION ─────────────────────────────────────────
  page.drawText('ASISTENTE', { x: cardX + 24, y: infoY, size: 8, font: regularFont, color: cyan })
  infoY -= 16
  page.drawText(name, { x: cardX + 24, y: infoY, size: 16, font: boldFont, color: dark })
  infoY -= 18
  page.drawText(email, { x: cardX + 24, y: infoY, size: 10, font: regularFont, color: midGray })
  infoY -= 28

  // ── DASHED STUB SEPARATOR ─────────────────────────────────────
  // Semicircle notches on the sides
  page.drawEllipse({ x: cardX,        y: infoY, xScale: 10, yScale: 10, color: rgb(0.949, 0.961, 0.976) })
  page.drawEllipse({ x: cardX + cardW, y: infoY, xScale: 10, yScale: 10, color: rgb(0.949, 0.961, 0.976) })
  drawDashedLine(page, cardX + 10, cardX + cardW - 10, infoY, border, 6, 5)
  infoY -= 20

  // ── QR SECTION (stub area) ───────────────────────────────────
  page.drawRectangle({ x: cardX, y: cardY, width: cardW, height: infoY - cardY + 10, color: stubBg })

  // "Presenta en entrada" label
  const scanTxt = 'PRESENTA ESTE CÓDIGO EN LA ENTRADA'
  page.drawText(scanTxt, {
    x: centerText(scanTxt, boldFont, 9, W),
    y: infoY - 2,
    size: 9, font: boldFont, color: cyan,
  })
  infoY -= 22

  // QR code — centered, large
  const qrImageBuffer = Buffer.from(qrCodeDataUrl.split(',')[1], 'base64')
  const qrImage = await pdfDoc.embedPng(qrImageBuffer)
  const qrSize  = 140
  const qrX     = (W - qrSize) / 2

  // White QR background pad
  page.drawRectangle({ x: qrX - 8, y: infoY - qrSize - 8, width: qrSize + 16, height: qrSize + 16, color: white, borderColor: border, borderWidth: 1 })
  page.drawImage(qrImage, { x: qrX, y: infoY - qrSize, width: qrSize, height: qrSize })

  // Alternative code below QR
  const codeY = infoY - qrSize - 30
  page.drawText('Código alternativo', {
    x: centerText('Código alternativo', regularFont, 9, W),
    y: codeY,
    size: 9, font: regularFont, color: midGray,
  })
  page.drawText(alternativeCode, {
    x: centerText(alternativeCode, boldFont, 18, W),
    y: codeY - 20,
    size: 18, font: boldFont, color: cyan,
  })

  // ── FOOTER ────────────────────────────────────────────────────
  const footerY = 55
  const regLine  = `ID: ${registrationId}`
  page.drawText(regLine, {
    x: centerText(regLine, regularFont, 8, W),
    y: footerY + 14,
    size: 8, font: regularFont, color: midGray,
  })
  const copy = `© ${new Date().getFullYear()} Doce25 · Todos los derechos reservados`
  page.drawText(copy, {
    x: centerText(copy, regularFont, 8, W),
    y: footerY,
    size: 8, font: regularFont, color: border,
  })

  // ── OUTER CARD BORDER ─────────────────────────────────────────
  page.drawRectangle({ x: cardX, y: cardY, width: cardW, height: cardH, borderColor: border, borderWidth: 1 })

  const pdfBytes = await pdfDoc.save()
  return Buffer.from(pdfBytes)
}

async function sendEmailWithAttachments(
  to: string,
  subject: string,
  htmlBody: string,
  textBody: string,
  qrCodeBuffer: Buffer,
  pdfBuffer: Buffer,
  logoBuffer: Buffer | null = null
) {
  const fromEmail = process.env.SES_FROM_EMAIL || 'doce25@precotracks.org'
  const boundary = `----=_Part_${Date.now()}_${Math.random().toString(36).substring(7)}`
  const boundaryAlt = `----=_Part_Alt_${Date.now()}_${Math.random().toString(36).substring(7)}`

  // Crear el email MIME multipart con el QR embebido y PDF adjunto
  const rawEmail = [
    `From: Doce25 <${fromEmail}>`,
    `Reply-To: info@doce25.org`,
    `To: ${to}`,
    `Subject: ${subject}`,
    `List-Unsubscribe: <mailto:info@doce25.org?subject=unsubscribe>`,
    `List-Unsubscribe-Post: List-Unsubscribe=One-Click`,
    `Precedence: bulk`,
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
    ``,
    `--${boundary}`,
    `Content-Type: image/png; name="qr-code.png"`,
    `Content-Transfer-Encoding: base64`,
    `Content-Disposition: inline; filename="qr-code.png"`,
    `Content-ID: <qrcode>`,
    ``,
    qrCodeBuffer.toString('base64'),
    ``,
  ]

  // Agregar logo si está disponible
  if (logoBuffer) {
    rawEmail.push(
      `--${boundary}`,
      `Content-Type: image/png; name="doce25-logo.png"`,
      `Content-Transfer-Encoding: base64`,
      `Content-Disposition: inline; filename="doce25-logo.png"`,
      `Content-ID: <logo>`,
      ``,
      logoBuffer.toString('base64'),
      ``,
    )
  }

  // Agregar PDF
  rawEmail.push(
    `--${boundary}`,
    `Content-Type: application/pdf; name="entrada-doce25.pdf"`,
    `Content-Transfer-Encoding: base64`,
    `Content-Disposition: attachment; filename="entrada-doce25.pdf"`,
    ``,
    pdfBuffer.toString('base64'),
    ``,
    `--${boundary}--`,
  )

  const rawEmailString = rawEmail.join('\r\n')

  const command = new SendRawEmailCommand({
    RawMessage: {
      Data: Buffer.from(rawEmailString),
    },
  })

  return sesClient.send(command)
}

interface RegisterEventBody {
  name: string
  email: string
  phone?: string
  fullName?: string
  ageRange?: string
  gender?: string
  city?: string
  organization?: string
  otherOrganization?: string
  termsAccepted?: boolean
  signature?: string
  signatureDate?: string
}

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': 'https://doce25.precotracks.org',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  }

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    }
  }

  try {
    const eventId = event.pathParameters?.eventId
    if (!eventId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: 'Event ID is required' }),
      }
    }

    const body: RegisterEventBody = JSON.parse(event.body || '{}')
    const { 
      name, email, phone, termsAccepted,
      fullName, ageRange, gender, city, organization, otherOrganization,
      signature, signatureDate
    } = body

    // Extraer userId del token JWT si existe (usuario logueado)
    let userId: string | undefined
    try {
      const authHeader = event.headers.Authorization || event.headers.authorization
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7)
        const jwt = await import('jsonwebtoken')
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'secret')
        userId = decoded.userId
      }
    } catch (err) {
      // Si falla la verificación del token, continuamos como guest
      console.log('No valid token, registering as guest')
    }

    if (!name || !email) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: 'Name and email are required' }),
      }
    }

    if (!termsAccepted) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: 'You must accept the terms and conditions' }),
      }
    }

    // Validar campos del formulario completo
    if (!fullName || !ageRange || !gender || !city || !organization || !signature) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: 'All required fields must be completed' }),
      }
    }

    // Verificar si el email ya está registrado para este evento
    const existingRegistrations = await dynamoClient.send(
      new QueryCommand({
        TableName: TABLES.REGISTRATIONS,
        IndexName: 'EmailIndex',
        KeyConditionExpression: 'email = :email',
        FilterExpression: 'eventId = :eventId',
        ExpressionAttributeValues: {
          ':email': email.toLowerCase().trim(),
          ':eventId': eventId,
        },
        Limit: 1, // Solo necesitamos saber si existe uno
      })
    )

    if (existingRegistrations.Items && existingRegistrations.Items.length > 0) {
      return {
        statusCode: 409, // Conflict
        headers,
        body: JSON.stringify({ 
          message: 'Ya estás registrado para este evento. Revisa tu correo electrónico para ver tu entrada.',
          registrationExists: true
        }),
      }
    }

    // Generar token único para el QR
    const qrToken = uuidv4()
    const registrationId = uuidv4()

    // Normalizar email (lowercase y trim)
    const normalizedEmail = email.toLowerCase().trim()

    // Guardar registro en DynamoDB
    await dynamoClient.send(
      new PutCommand({
        TableName: TABLES.REGISTRATIONS,
        Item: {
          registrationId,
          eventId,
          name,
          email: normalizedEmail,
          phone: phone || '',
          qrToken,
          termsAccepted: termsAccepted || false,
          // userId si el usuario está logueado
          ...(userId && { userId }),
          // Campos adicionales del formulario completo
          fullName: fullName || name,
          ageRange: ageRange || '',
          gender: gender || '',
          city: city || '',
          organization: organization || '',
          otherOrganization: otherOrganization || '',
          signature: signature || '',
          signatureDate: signatureDate || new Date().toISOString().split('T')[0],
          createdAt: new Date().toISOString(),
          checkedIn: false,
        },
      })
    )

    // Obtener información del evento
    const eventResult = await dynamoClient.send(
      new GetCommand({
        TableName: TABLES.EVENTS,
        Key: { eventId },
      })
    )

    const eventInfo = eventResult.Item || {}

    // Generar QR code
    const qrUrl = `${process.env.FRONTEND_URL || 'https://dosce25.org'}/checkin/${qrToken}`
    const qrCodeDataUrl = await QRCode.toDataURL(qrUrl)

    // Convertir data URL a buffer
    const qrCodeBuffer = Buffer.from(qrCodeDataUrl.split(',')[1], 'base64')

    // Guardar QR en S3
    const qrKey = `qr-codes/${registrationId}.png`
    await s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.S3_BUCKET || 'dosce25-qr-codes',
        Key: qrKey,
        Body: qrCodeBuffer,
        ContentType: 'image/png',
      })
    )

    const qrCodeUrl = `https://${process.env.S3_BUCKET || 'dosce25-qr-codes'}.s3.amazonaws.com/${qrKey}`

    // Generar código alternativo y PDF del ticket
    const alternativeCode = generateAlternativeCode(registrationId)
    const logoBuffer = loadLogo() // Cargar logo local (instantáneo)
    const pdfBuffer = await generateTicketPDF(
      fullName || name,
      email,
      eventInfo.name || 'Evento Doce25',
      eventInfo.date || '',
      eventInfo.location || '',
      qrCodeDataUrl,
      alternativeCode,
      registrationId,
      logoBuffer
    )

    // Email profesional estilo Eventbrite
    const emailHtml = `
      <!DOCTYPE html>
      <html lang="es">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
              line-height: 1.6;
              color: #3d3d3d;
              background-color: #f8f8f8;
              -webkit-font-smoothing: antialiased;
              -moz-osx-font-smoothing: grayscale;
            }
            .email-wrapper {
              width: 100%;
              background-color: #f8f8f8;
              padding: 40px 20px;
            }
            .email-container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              border-radius: 8px;
              overflow: hidden;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            }
            .header {
              background: linear-gradient(135deg, #0ea5e9 0%, #14b8a6 100%);
              padding: 40px 30px;
              text-align: center;
            }
            .header h1 {
              color: #ffffff;
              font-size: 28px;
              font-weight: 600;
              margin: 0;
              letter-spacing: -0.5px;
            }
            .brand-name {
              display: inline-block;
              margin: 0 auto 20px;
              font-size: 32px;
              font-weight: 800;
              color: #ffffff;
              letter-spacing: -1px;
              text-shadow: 0 2px 8px rgba(0,0,0,0.15);
            }
            .content {
              padding: 40px 30px;
            }
            .greeting {
              font-size: 18px;
              color: #3d3d3d;
              margin-bottom: 20px;
              font-weight: 500;
            }
            .message {
              font-size: 15px;
              color: #6f6f6f;
              margin-bottom: 30px;
              line-height: 1.7;
            }
            .ticket-section {
              background-color: #f8fafc;
              border: 2px dashed #cbd5e1;
              border-radius: 12px;
              padding: 30px;
              margin: 30px 0;
              text-align: center;
            }
            .ticket-title {
              font-size: 16px;
              font-weight: 600;
              color: #3d3d3d;
              margin-bottom: 20px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .qr-code-container {
              background-color: #ffffff;
              padding: 20px;
              border-radius: 8px;
              display: inline-block;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
            }
            .qr-code-container img {
              display: block;
              width: 220px;
              height: 220px;
              margin: 0 auto;
            }
            .qr-instructions {
              font-size: 14px;
              color: #6f6f6f;
              margin-top: 20px;
              padding: 0 20px;
            }
            .info-box {
              background-color: #eff6ff;
              border-left: 4px solid #0ea5e9;
              padding: 20px;
              margin: 25px 0;
              border-radius: 4px;
            }
            .info-box p {
              font-size: 14px;
              color: #1e40af;
              margin: 0;
              line-height: 1.6;
            }
            .info-box strong {
              color: #0c4a6e;
            }
            .button {
              display: inline-block;
              background: linear-gradient(135deg, #0ea5e9 0%, #14b8a6 100%);
              color: #ffffff !important;
              padding: 14px 32px;
              text-decoration: none;
              border-radius: 6px;
              font-weight: 600;
              font-size: 15px;
              margin: 20px 0;
              text-align: center;
              transition: all 0.3s ease;
            }
            .divider {
              height: 1px;
              background-color: #e5e7eb;
              margin: 30px 0;
            }
            .footer {
              background-color: #f8fafc;
              padding: 30px;
              text-align: center;
              border-top: 1px solid #e5e7eb;
            }
            .footer-logo {
              font-size: 20px;
              font-weight: 700;
              color: #0ea5e9;
              margin-bottom: 15px;
            }
            .footer-text {
              font-size: 13px;
              color: #6f6f6f;
              line-height: 1.6;
              margin-bottom: 15px;
            }
            .social-links {
              margin-top: 20px;
            }
            .social-links a {
              display: inline-block;
              margin: 0 8px;
              color: #6f6f6f;
              text-decoration: none;
              font-size: 14px;
            }
            @media only screen and (max-width: 600px) {
              .email-wrapper { padding: 20px 10px; }
              .content { padding: 30px 20px; }
              .header { padding: 30px 20px; }
              .header h1 { font-size: 24px; }
              .qr-code-container img { width: 180px; height: 180px; }
              .ticket-section { padding: 20px; }
            }
          </style>
        </head>
        <body>
          <div class="email-wrapper">
            <div class="email-container">
              <!-- Header -->
            <div class="header">
                ${logoBuffer ? '<img src="cid:logo" alt="Doce25 Logo" style="max-width: 200px; height: auto; margin-bottom: 20px;" />' : '<div class="brand-name">Doce25</div>'}
              <h1>¡Registro Confirmado!</h1>
            </div>

              <!-- Content -->
            <div class="content">
                <p class="greeting">Hola ${name},</p>
                
                <p class="message">
                  ¡Estamos emocionados de confirmar tu registro para nuestro evento! 
                  Tu participación es muy importante para nosotros.
                </p>

                <div class="info-box">
                  <p>
                    <strong>📅 Importante:</strong> Guarda este email y descarga tu entrada en PDF adjunta. 
                    Necesitarás presentar tu código QR en la entrada del evento para acceder.
                  </p>
                </div>

                <!-- Ticket Section with QR -->
                <div class="ticket-section">
                  <div class="ticket-title">Tu Boleto Digital</div>
                  <div class="qr-code-container">
                    <img src="cid:qrcode" alt="Código QR de Entrada" />
                  </div>
                  <p class="qr-instructions">
                    <strong>Instrucciones:</strong><br>
                    Presenta este código QR en la entrada del evento.<br>
                    Puedes mostrarlo desde tu teléfono o imprimirlo.<br><br>
                    <strong>Código alternativo:</strong> <span style="color: #0ea5e9; font-weight: 600;">${alternativeCode}</span>
                  </p>
                </div>

                <div class="info-box" style="background-color: #fef3c7; border-left-color: #f59e0b;">
                  <p style="color: #92400e;">
                    <strong>📎 Entrada PDF Adjunta:</strong> Hemos incluido tu entrada en formato PDF 
                    para que puedas descargarla e imprimirla si lo prefieres.
                  </p>
                </div>

                <div class="divider"></div>

                <p class="message" style="margin-bottom: 15px;">
                  <strong>Detalles de tu registro:</strong>
                </p>
                <p class="message" style="margin-top: 0;">
                  <strong>Nombre:</strong> ${fullName || name}<br>
                  <strong>Email:</strong> ${email}<br>
                  <strong>Organización:</strong> ${organization || 'N/A'}
                </p>

                <div class="divider"></div>

                <p class="message">
                  Si tienes alguna pregunta o necesitas asistencia, no dudes en contactarnos.
                  ¡Nos vemos en el evento!
                </p>
              </div>

              <!-- Footer -->
              <div class="footer">
                ${logoBuffer ? '<img src="cid:logo" alt="Doce25 Logo" style="max-width: 150px; height: auto; margin-bottom: 15px;" />' : '<div class="footer-logo">DOCE25</div>'}
                <p class="footer-text">
                  Fundación Tortuga Club PR, Inc.<br>
                  Comprometidos con el cambio y el desarrollo comunitario
                </p>
                <p class="footer-text" style="font-size: 12px; color: #9ca3af;">
                  Este es un email automático, por favor no respondas a este mensaje.<br>
                  © ${new Date().getFullYear()} Doce25. Todos los derechos reservados.
                </p>
            </div>
            </div>
          </div>
        </body>
      </html>
    `

    const textBody = `
¡Registro Confirmado!

Hola ${name},

¡Estamos emocionados de confirmar tu registro para nuestro evento! Tu participación es muy importante para nosotros.

IMPORTANTE: Guarda este email. Necesitarás presentar tu código QR en la entrada del evento para acceder.

Detalles de tu registro:
- Nombre: ${fullName || name}
- Email: ${email}
- Organización: ${organization || 'N/A'}

Presenta tu código QR en la entrada del evento. El QR está adjunto en este email.

Si tienes alguna pregunta o necesitas asistencia, no dudes en contactarnos.
¡Nos vemos en el evento!

---
DOCE25
Fundación Tortuga Club PR, Inc.
Comprometidos con el cambio y el desarrollo comunitario

© ${new Date().getFullYear()} Doce25. Todos los derechos reservados.
    `.trim()

    await sendEmailWithAttachments(
      email,
      '✓ Confirmación de Registro - Doce25 Event',
      emailHtml,
      textBody,
      qrCodeBuffer,
      pdfBuffer,
      logoBuffer
    )

    // Notificación interna al equipo de Doce25
    try {
      await sendAdminNotification({
        name,
        fullName: fullName || name,
        email: normalizedEmail,
        phone,
        eventName: eventInfo.name || 'Evento Doce25',
        eventDate: eventInfo.date || '',
        eventLocation: eventInfo.location || '',
        organization: organization || '',
        city: city || '',
        ageRange: ageRange || '',
        gender: gender || '',
        registrationId,
      })
    } catch (notifErr) {
      // No bloquear el registro si falla la notificación interna
      console.error('Error sending admin notification:', notifErr)
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: 'Registration successful',
        registrationId,
        qrToken,
      }),
    }
  } catch (error: any) {
    console.error('Error:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        message: 'Internal server error',
        error: error.message,
      }),
    }
  }
}

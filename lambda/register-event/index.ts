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
  // Create PDF document
  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage([595.28, 841.89]) // A4
  
  // Load fonts
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
  
  // Colors
  const primaryColor = rgb(0.055, 0.647, 0.914) // #0ea5e9
  const darkGray = rgb(0.239, 0.239, 0.239) // #3d3d3d
  const lightGray = rgb(0.973, 0.980, 0.988) // #f8fafc
  const borderColor = rgb(0.796, 0.835, 0.878) // #cbd5e1
  const gray = rgb(0.435, 0.435, 0.435) // #6f6f6f
  const lightGrayFooter = rgb(0.612, 0.639, 0.686) // #9ca3af
  
  // Header background
  page.drawRectangle({
    x: 0,
    y: 841.89 - 180,
    width: 595.28,
    height: 180,
    color: primaryColor,
  })
  
  // Logo
  if (logoBuffer) {
    try {
      const logoImage = await pdfDoc.embedPng(logoBuffer)
      const logoDims = logoImage.scale(0.3)
      page.drawImage(logoImage, {
        x: 50,
        y: 841.89 - 100,
        width: Math.min(logoDims.width, 120),
        height: Math.min(logoDims.height, 60),
      })
    } catch (err) {
      console.error('Error embedding logo:', err)
      // Fallback to text
      page.drawText('DOCE25', {
        x: 50,
        y: 841.89 - 82,
        size: 32,
        font: boldFont,
        color: rgb(1, 1, 1),
      })
    }
  } else {
    page.drawText('DOCE25', {
      x: 50,
      y: 841.89 - 82,
      size: 32,
      font: boldFont,
      color: rgb(1, 1, 1),
    })
  }
  
  // Subtitle
  page.drawText('Fundación Tortuga Club PR', {
    x: 50,
    y: 841.89 - 121,
    size: 14,
    font: regularFont,
    color: rgb(1, 1, 1),
  })
  
  // Title
  page.drawText('ENTRADA AL EVENTO', {
    x: 50,
    y: 841.89 - 151,
    size: 24,
    font: boldFont,
    color: rgb(1, 1, 1),
  })
  
  // Ticket container
  const ticketTop = 841.89 - 220
  const ticketLeft = 50
  const ticketWidth = 495.28
  const ticketHeight = 500
  
  // White background for ticket
  page.drawRectangle({
    x: ticketLeft,
    y: ticketTop - ticketHeight,
    width: ticketWidth,
    height: ticketHeight,
    color: rgb(1, 1, 1),
    borderColor: borderColor,
    borderWidth: 1,
  })
  
  let yPos = ticketTop - 40
  
  // Event name
  page.drawText(eventName || 'Evento Doce25', {
    x: ticketLeft + 30,
    y: yPos,
    size: 20,
    font: boldFont,
    color: darkGray,
    maxWidth: ticketWidth - 60,
  })
  
  yPos -= 40
  
  // Date and location
  if (eventDate) {
    page.drawText('Fecha: ' + eventDate, {
      x: ticketLeft + 30,
      y: yPos,
      size: 12,
      font: regularFont,
      color: gray,
    })
    yPos -= 25
  }
  
  if (eventLocation) {
    page.drawText('Lugar: ' + eventLocation, {
      x: ticketLeft + 30,
      y: yPos,
      size: 12,
      font: regularFont,
      color: gray,
    })
    yPos -= 25
  }
  
  // Divider line
  yPos -= 10
  page.drawLine({
    start: { x: ticketLeft + 30, y: yPos },
    end: { x: ticketLeft + ticketWidth - 30, y: yPos },
    color: borderColor,
    thickness: 1,
  })
  yPos -= 30
  
  // Attendee label
  page.drawText('ASISTENTE', {
    x: ticketLeft + 30,
    y: yPos,
    size: 11,
    font: regularFont,
    color: gray,
  })
  
  yPos -= 20
  
  // Attendee name
  page.drawText(name, {
    x: ticketLeft + 30,
    y: yPos,
    size: 14,
    font: boldFont,
    color: darkGray,
  })
  
  yPos -= 25
  
  // Email
  page.drawText(email, {
    x: ticketLeft + 30,
    y: yPos,
    size: 11,
    font: regularFont,
    color: gray,
  })
  
  yPos -= 50
  
  // QR Code section background
  page.drawRectangle({
    x: ticketLeft + 30,
    y: yPos - 200,
    width: ticketWidth - 60,
    height: 200,
    color: lightGray,
  })
  
  yPos -= 20
  
  // Section title
  const titleText = 'PRESENTA ESTE CODIGO EN LA ENTRADA'
  const titleWidth = boldFont.widthOfTextAtSize(titleText, 12)
  page.drawText(titleText, {
    x: ticketLeft + (ticketWidth - titleWidth) / 2,
    y: yPos,
    size: 12,
    font: boldFont,
    color: darkGray,
  })
  
  yPos -= 30
  
  // QR Code
  const qrImageBuffer = Buffer.from(qrCodeDataUrl.split(',')[1], 'base64')
  const qrImage = await pdfDoc.embedPng(qrImageBuffer)
  const qrSize = 120
  const qrX = (595.28 - qrSize) / 2
  
  page.drawImage(qrImage, {
    x: qrX,
    y: yPos - qrSize,
    width: qrSize,
    height: qrSize,
  })
  
  yPos -= qrSize + 15
  
  // Alternative code label
  const altLabel = 'Codigo alternativo:'
  const altLabelWidth = regularFont.widthOfTextAtSize(altLabel, 10)
  page.drawText(altLabel, {
    x: ticketLeft + (ticketWidth - altLabelWidth) / 2,
    y: yPos,
    size: 10,
    font: regularFont,
    color: gray,
  })
  
  yPos -= 18
  
  // Alternative code value
  const altCodeWidth = boldFont.widthOfTextAtSize(alternativeCode, 16)
  page.drawText(alternativeCode, {
    x: ticketLeft + (ticketWidth - altCodeWidth) / 2,
    y: yPos,
    size: 16,
    font: boldFont,
    color: primaryColor,
  })
  
  // Footer
  const footerY = 80
  const registrationText = 'ID de Registro: ' + registrationId
  const registrationWidth = regularFont.widthOfTextAtSize(registrationText, 9)
  page.drawText(registrationText, {
    x: (595.28 - registrationWidth) / 2,
    y: footerY,
    size: 9,
    font: regularFont,
    color: lightGrayFooter,
  })
  
  const copyrightText = `© ${new Date().getFullYear()} Doce25. Todos los derechos reservados.`
  const copyrightWidth = regularFont.widthOfTextAtSize(copyrightText, 8)
  page.drawText(copyrightText, {
    x: (595.28 - copyrightWidth) / 2,
    y: footerY - 15,
    size: 8,
    font: regularFont,
    color: lightGrayFooter,
  })
  
  // Dashed border
  page.drawRectangle({
    x: ticketLeft,
    y: ticketTop - ticketHeight,
    width: ticketWidth,
    height: ticketHeight,
    borderColor: borderColor,
    borderWidth: 2,
    borderDashArray: [5, 3],
  })
  
  // Save and return
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

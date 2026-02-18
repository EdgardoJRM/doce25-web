import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb'
import { SESClient, SendRawEmailCommand } from '@aws-sdk/client-ses'
import QRCode from 'qrcode'
import PDFDocument from 'pdfkit'
import https from 'https'

const dynamoClient = DynamoDBDocumentClient.from(new DynamoDBClient({}))
const sesClient = new SESClient({})

const TABLES = {
  REGISTRATIONS: 'Dosce25-Registrations',
  EVENTS: 'Dosce25-Events',
}

// Generar código alternativo de 8 caracteres
function generateAlternativeCode(registrationId: string): string {
  return registrationId.substring(0, 8).toUpperCase()
}

// Descargar el logo desde URL
async function downloadLogo(): Promise<Buffer | null> {
  return new Promise((resolve) => {
    const logoUrl = `${process.env.FRONTEND_URL || 'https://dosce25.org'}/doce25-logo.png`
    
    https.get(logoUrl, (response) => {
      if (response.statusCode !== 200) {
        console.error('Error downloading logo:', response.statusCode)
        resolve(null)
        return
      }

      const chunks: Buffer[] = []
      response.on('data', (chunk) => chunks.push(chunk))
      response.on('end', () => resolve(Buffer.concat(chunks)))
      response.on('error', (err) => {
        console.error('Error downloading logo:', err)
        resolve(null)
      })
    }).on('error', (err) => {
      console.error('Error downloading logo:', err)
      resolve(null)
    })
  })
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
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: [595.28, 841.89], // A4
        margins: { top: 0, bottom: 0, left: 0, right: 0 }
      })

      const chunks: Buffer[] = []
      doc.on('data', (chunk) => chunks.push(chunk))
      doc.on('end', () => resolve(Buffer.concat(chunks)))
      doc.on('error', reject)

      // Colores corporativos
      const primaryColor = '#0ea5e9'
      const secondaryColor = '#14b8a6'
      const darkGray = '#3d3d3d'
      const lightGray = '#f8fafc'
      const borderColor = '#cbd5e1'

      // Header con gradiente (simulado con rectángulos)
      doc.rect(0, 0, 595.28, 180).fill(primaryColor)
      
      // Logo de la organización
      if (logoBuffer) {
        try {
          doc.image(logoBuffer, 50, 40, {
            width: 120,
            height: 60,
            fit: [120, 60]
          })
        } catch (err) {
          console.error('Error adding logo to PDF:', err)
          // Fallback al texto si falla
          doc.fontSize(32)
             .fillColor('#ffffff')
             .font('Helvetica-Bold')
             .text('DOCE25', 50, 50)
        }
      } else {
        // Fallback al texto si no hay logo
        doc.fontSize(32)
           .fillColor('#ffffff')
           .font('Helvetica-Bold')
           .text('DOCE25', 50, 50)
      }
      
      doc.fontSize(14)
         .fillColor('#ffffff')
         .font('Helvetica')
         .text('Fundación Tortuga Club PR', 50, 110)

      // Título del ticket
      doc.fontSize(24)
         .fillColor('#ffffff')
         .font('Helvetica-Bold')
         .text('ENTRADA AL EVENTO', 50, 140)

      // Contenedor principal del ticket
      const ticketTop = 220
      const ticketLeft = 50
      const ticketWidth = 495.28
      const ticketHeight = 500

      // Fondo blanco del ticket
      doc.rect(ticketLeft, ticketTop, ticketWidth, ticketHeight)
         .fill('#ffffff')
         .stroke(borderColor)

      // Información del evento
      let yPosition = ticketTop + 40

      doc.fontSize(20)
         .fillColor(darkGray)
         .font('Helvetica-Bold')
         .text(eventName || 'Evento Doce25', ticketLeft + 30, yPosition, {
           width: ticketWidth - 60,
           align: 'left'
         })

      yPosition += 40

      // Fecha y ubicación
      if (eventDate) {
        doc.fontSize(12)
           .fillColor('#6f6f6f')
           .font('Helvetica')
           .text('📅 ' + eventDate, ticketLeft + 30, yPosition)
        yPosition += 25
      }

      if (eventLocation) {
        doc.fontSize(12)
           .fillColor('#6f6f6f')
           .font('Helvetica')
           .text('📍 ' + eventLocation, ticketLeft + 30, yPosition)
        yPosition += 25
      }

      // Línea divisoria
      yPosition += 10
      doc.moveTo(ticketLeft + 30, yPosition)
         .lineTo(ticketLeft + ticketWidth - 30, yPosition)
         .stroke(borderColor)
      yPosition += 30

      // Información del asistente
      doc.fontSize(11)
         .fillColor('#6f6f6f')
         .font('Helvetica')
         .text('ASISTENTE', ticketLeft + 30, yPosition)
      
      yPosition += 20
      doc.fontSize(14)
         .fillColor(darkGray)
         .font('Helvetica-Bold')
         .text(name, ticketLeft + 30, yPosition)

      yPosition += 25
      doc.fontSize(11)
         .fillColor('#6f6f6f')
         .font('Helvetica')
         .text(email, ticketLeft + 30, yPosition)

      // Sección del QR Code y código alternativo
      yPosition += 50

      // Fondo gris claro para la sección de códigos
      doc.rect(ticketLeft + 30, yPosition, ticketWidth - 60, 200)
         .fill(lightGray)

      yPosition += 20

      // Título de la sección
      doc.fontSize(12)
         .fillColor(darkGray)
         .font('Helvetica-Bold')
         .text('PRESENTA ESTE CÓDIGO EN LA ENTRADA', ticketLeft + 30, yPosition, {
           width: ticketWidth - 60,
           align: 'center'
         })

      yPosition += 30

      // QR Code (centrado)
      const qrImageBuffer = Buffer.from(qrCodeDataUrl.split(',')[1], 'base64')
      const qrSize = 120
      const qrX = (595.28 - qrSize) / 2
      
      doc.image(qrImageBuffer, qrX, yPosition, {
        width: qrSize,
        height: qrSize
      })

      yPosition += qrSize + 15

      // Código alternativo
      doc.fontSize(10)
         .fillColor('#6f6f6f')
         .font('Helvetica')
         .text('Código alternativo:', ticketLeft + 30, yPosition, {
           width: ticketWidth - 60,
           align: 'center'
         })

      yPosition += 18
      doc.fontSize(16)
         .fillColor(primaryColor)
         .font('Helvetica-Bold')
         .text(alternativeCode, ticketLeft + 30, yPosition, {
           width: ticketWidth - 60,
           align: 'center'
         })

      // Footer con información adicional
      const footerY = 760
      doc.fontSize(9)
         .fillColor('#9ca3af')
         .font('Helvetica')
         .text('ID de Registro: ' + registrationId, 50, footerY, {
           width: 495.28,
           align: 'center'
         })

      doc.fontSize(8)
         .fillColor('#9ca3af')
         .text('© ' + new Date().getFullYear() + ' Doce25. Todos los derechos reservados.', 50, footerY + 15, {
           width: 495.28,
           align: 'center'
         })

      // Borde decorativo del ticket con línea punteada
      doc.save()
         .strokeColor(borderColor)
         .lineWidth(2)
         .dash(5, { space: 3 })
         .rect(ticketLeft, ticketTop, ticketWidth, ticketHeight)
         .stroke()
         .restore()

      doc.end()
    } catch (error) {
      reject(error)
    }
  })
}

async function sendEmailWithAttachments(
  to: string,
  subject: string,
  htmlBody: string,
  textBody: string,
  qrCodeBuffer: Buffer,
  pdfBuffer: Buffer
) {
  const fromEmail = process.env.SES_FROM_EMAIL || 'doce25@precotracks.org'
  const boundary = `----=_Part_${Date.now()}_${Math.random().toString(36).substring(7)}`
  const boundaryAlt = `----=_Part_Alt_${Date.now()}_${Math.random().toString(36).substring(7)}`

  // Crear el email MIME multipart con el QR embebido y PDF adjunto
  const rawEmail = [
    `From: Doce25 <${fromEmail}>`,
    `To: ${to}`,
    `Subject: ${subject}`,
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
    `--${boundary}`,
    `Content-Type: application/pdf; name="entrada-doce25.pdf"`,
    `Content-Transfer-Encoding: base64`,
    `Content-Disposition: attachment; filename="entrada-doce25.pdf"`,
    ``,
    pdfBuffer.toString('base64'),
    ``,
    `--${boundary}--`,
  ].join('\r\n')

  const command = new SendRawEmailCommand({
    RawMessage: {
      Data: Buffer.from(rawEmail),
    },
  })

  return sesClient.send(command)
}

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
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
    const registrationId = event.pathParameters?.registrationId

    if (!registrationId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: 'Registration ID is required' }),
      }
    }

    // Obtener registro
    const registrationResult = await dynamoClient.send(
      new GetCommand({
        TableName: TABLES.REGISTRATIONS,
        Key: { registrationId },
      })
    )

    if (!registrationResult.Item) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ message: 'Registration not found' }),
      }
    }

    const registration = registrationResult.Item

    // Obtener información del evento
    const eventResult = await dynamoClient.send(
      new GetCommand({
        TableName: TABLES.EVENTS,
        Key: { eventId: registration.eventId },
      })
    )

    const eventInfo = eventResult.Item

    // Construir URL y regenerar QR
    const qrUrl = `${process.env.FRONTEND_URL || 'https://dosce25.org'}/checkin/${registration.qrToken}`
    
    // Regenerar QR code
    const qrCodeDataUrl = await QRCode.toDataURL(qrUrl)
    const qrCodeBuffer = Buffer.from(qrCodeDataUrl.split(',')[1], 'base64')

    // Generar código alternativo y PDF del ticket
    const alternativeCode = generateAlternativeCode(registrationId)
    const logoBuffer = await downloadLogo()
    const pdfBuffer = await generateTicketPDF(
      registration.fullName || registration.name,
      registration.email,
      eventInfo?.name || 'Evento Doce25',
      eventInfo?.date || '',
      eventInfo?.location || '',
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
            .resend-icon {
              width: 60px;
              height: 60px;
              background-color: #ffffff;
              border-radius: 50%;
              margin: 0 auto 20px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 32px;
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
            .event-info {
              background-color: #f8fafc;
              padding: 20px;
              border-radius: 8px;
              margin: 20px 0;
            }
            .event-info h3 {
              font-size: 16px;
              color: #3d3d3d;
              margin-bottom: 10px;
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
                <div class="resend-icon">📧</div>
                <h1>Tu Código QR</h1>
            </div>

              <!-- Content -->
            <div class="content">
                <p class="greeting">Hola ${registration.name},</p>
                
                <p class="message">
                  Aquí está tu código QR para el evento. Lo hemos reenviado según tu solicitud.
                </p>

                ${eventInfo?.name ? `
                <div class="event-info">
                  <h3>📅 ${eventInfo.name}</h3>
                  ${eventInfo.date ? `<p style="font-size: 14px; color: #6f6f6f; margin-top: 5px;">${eventInfo.date}</p>` : ''}
                  ${eventInfo.location ? `<p style="font-size: 14px; color: #6f6f6f; margin-top: 5px;">📍 ${eventInfo.location}</p>` : ''}
                </div>
                ` : ''}

                <div class="info-box">
                  <p>
                    <strong>📱 Importante:</strong> Guarda este email y descarga tu entrada en PDF adjunta. 
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
                  <strong>Nombre:</strong> ${registration.fullName || registration.name}<br>
                  <strong>Email:</strong> ${registration.email}<br>
                  ${registration.organization ? `<strong>Organización:</strong> ${registration.organization}<br>` : ''}
                </p>

                <div class="divider"></div>

                <p class="message">
                  Si tienes alguna pregunta o necesitas asistencia, no dudes en contactarnos.
                  ¡Nos vemos en el evento!
                </p>
              </div>

              <!-- Footer -->
              <div class="footer">
                <div class="footer-logo">DOCE25</div>
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
Tu Código QR - Doce25

Hola ${registration.name},

Aquí está tu código QR para el evento. Lo hemos reenviado según tu solicitud.

${eventInfo?.name ? `EVENTO: ${eventInfo.name}` : ''}
${eventInfo?.date ? `Fecha: ${eventInfo.date}` : ''}
${eventInfo?.location ? `Ubicación: ${eventInfo.location}` : ''}

IMPORTANTE: Guarda este email. Necesitarás presentar tu código QR en la entrada del evento para acceder.

Detalles de tu registro:
- Nombre: ${registration.fullName || registration.name}
- Email: ${registration.email}
${registration.organization ? `- Organización: ${registration.organization}` : ''}

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
      registration.email,
      '📧 Tu Código QR - Doce25 Event',
      emailHtml,
      textBody,
      qrCodeBuffer,
      pdfBuffer
    )

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: 'QR code email resent successfully',
        registrationId,
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


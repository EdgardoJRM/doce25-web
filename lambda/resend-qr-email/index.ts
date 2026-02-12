import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb'
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses'

const dynamoClient = DynamoDBDocumentClient.from(new DynamoDBClient({}))
const sesClient = new SESClient({})

const TABLES = {
  REGISTRATIONS: 'Dosce25-Registrations',
  EVENTS: 'Dosce25-Events',
}

async function sendEmail(to: string, subject: string, htmlBody: string, textBody?: string) {
  const command = new SendEmailCommand({
    Source: process.env.SES_FROM_EMAIL || 'noreply@dosce25.org',
    Destination: {
      ToAddresses: [to],
    },
    Message: {
      Subject: {
        Data: subject,
        Charset: 'UTF-8',
      },
      Body: {
        Html: {
          Data: htmlBody,
          Charset: 'UTF-8',
        },
        Text: textBody ? {
          Data: textBody,
          Charset: 'UTF-8',
        } : undefined,
      },
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

    // Construir URLs
    const qrUrl = `${process.env.FRONTEND_URL || 'https://dosce25.org'}/checkin/${registration.qrToken}`
    const qrCodeUrl = `https://${process.env.S3_BUCKET || 'dosce25-qr-codes'}.s3.amazonaws.com/qr-codes/${registrationId}.png`

    // Enviar email
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #0ea5e9 0%, #14b8a6 100%); color: white; padding: 30px; text-align: center; }
            .content { padding: 20px; background: #f9fafb; }
            .qr-code { text-align: center; margin: 20px 0; }
            .qr-code img { max-width: 200px; border: 2px solid #ddd; padding: 10px; background: white; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Código QR Reenviado</h1>
            </div>
            <div class="content">
              <p>Hola <strong>${registration.name}</strong>,</p>
              <p>Has solicitado que te reenviemos tu código QR para el evento:</p>
              <p><strong>${eventInfo?.name || 'Evento'}</strong></p>
              <p>Presenta este código QR en la entrada del evento:</p>
              <div class="qr-code">
                <img src="${qrCodeUrl}" alt="Código QR" />
              </div>
              <p>O visita este enlace: <a href="${qrUrl}">${qrUrl}</a></p>
              <p>¡Te esperamos!</p>
            </div>
            <div class="footer">
              <p>Fundación Dosce25</p>
            </div>
          </div>
        </body>
      </html>
    `

    await sendEmail(
      registration.email,
      'Tu Código QR - Dosce25',
      emailHtml,
      `Hola ${registration.name},\n\nTu código QR para el evento: ${qrUrl}`
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


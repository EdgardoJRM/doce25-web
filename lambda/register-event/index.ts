import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb'
import { v4 as uuidv4 } from 'uuid'
import QRCode from 'qrcode'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses'

const dynamoClient = DynamoDBDocumentClient.from(new DynamoDBClient({}))
const s3Client = new S3Client({})
const sesClient = new SESClient({})

const TABLES = {
  EVENTS: 'Dosce25-Events',
  REGISTRATIONS: 'Dosce25-Registrations',
}

async function sendEmail(to: string, subject: string, htmlBody: string, textBody?: string) {
  const command = new SendEmailCommand({
    Source: process.env.SES_FROM_EMAIL || 'doce25@precotracks.org',
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

    // Generar token único para el QR
    const qrToken = uuidv4()
    const registrationId = uuidv4()

    // Guardar registro en DynamoDB
    await dynamoClient.send(
      new PutCommand({
        TableName: TABLES.REGISTRATIONS,
        Item: {
          registrationId,
          eventId,
          name,
          email,
          phone: phone || '',
          qrToken,
          termsAccepted: termsAccepted || false,
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

    // Enviar email con QR
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
              <h1>¡Registro Confirmado!</h1>
            </div>
            <div class="content">
              <p>Hola <strong>${name}</strong>,</p>
              <p>Tu registro al evento ha sido confirmado exitosamente.</p>
              <p>Presenta este código QR en la entrada del evento:</p>
              <div class="qr-code">
                <img src="${qrCodeUrl}" alt="Código QR" />
              </div>
              <p>O visita este enlace: <a href="${qrUrl}">${qrUrl}</a></p>
              <p>¡Te esperamos!</p>
            </div>
            <div class="footer">
              <p>Dosce25 - Fundación</p>
            </div>
          </div>
        </body>
      </html>
    `

    await sendEmail(
      email,
      'Confirmación de Registro - Dosce25',
      emailHtml,
      `Hola ${name},\n\nTu registro ha sido confirmado. Presenta este código QR en la entrada: ${qrUrl}`
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


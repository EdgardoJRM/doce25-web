import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses'

const sesClient = new SESClient({})

interface ContactFormBody {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
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
    const body: ContactFormBody = JSON.parse(event.body || '{}')
    const { name, email, phone, subject, message } = body

    if (!name || !email || !subject || !message) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: 'Missing required fields' }),
      }
    }

    // Email al equipo de Doce25
    const adminEmailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #0ea5e9 0%, #14b8a6 100%); color: white; padding: 20px; }
            .content { padding: 20px; background: #f9fafb; }
            .info-row { margin: 10px 0; padding: 10px; background: white; border-left: 3px solid #0ea5e9; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>Nuevo Mensaje de Contacto</h2>
            </div>
            <div class="content">
              <div class="info-row">
                <strong>Nombre:</strong> ${name}
              </div>
              <div class="info-row">
                <strong>Email:</strong> ${email}
              </div>
              ${phone ? `<div class="info-row"><strong>Teléfono:</strong> ${phone}</div>` : ''}
              <div class="info-row">
                <strong>Asunto:</strong> ${subject}
              </div>
              <div class="info-row">
                <strong>Mensaje:</strong><br/>
                ${message.replace(/\n/g, '<br/>')}
              </div>
            </div>
          </div>
        </body>
      </html>
    `

    await sendEmail(
      'info@doce25.org', // Email del equipo
      `Contacto Web: ${subject}`,
      adminEmailHtml,
      `Nuevo mensaje de contacto\n\nNombre: ${name}\nEmail: ${email}\nTeléfono: ${phone || 'No proporcionado'}\nAsunto: ${subject}\n\nMensaje:\n${message}`
    )

    // Email de confirmación al usuario
    const userEmailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #0ea5e9 0%, #14b8a6 100%); color: white; padding: 30px; text-align: center; }
            .content { padding: 20px; background: #f9fafb; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>¡Gracias por Contactarnos!</h1>
            </div>
            <div class="content">
              <p>Hola <strong>${name}</strong>,</p>
              <p>Hemos recibido tu mensaje y te responderemos lo antes posible.</p>
              <p>Tu asunto: <strong>${subject}</strong></p>
              <p>Normalmente respondemos en un plazo de 24-48 horas.</p>
              <p>¡Gracias por tu interés en Doce25!</p>
            </div>
          </div>
        </body>
      </html>
    `

    await sendEmail(
      email,
      'Gracias por contactarnos - Doce25',
      userEmailHtml,
      `Hola ${name},\n\nHemos recibido tu mensaje y te responderemos pronto.\n\n¡Gracias!\n\nFundación Doce25`
    )

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: 'Contact email sent successfully',
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


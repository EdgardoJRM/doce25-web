import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses'

const sesClient = new SESClient({})

const NOTIFICATION_EMAILS = [
  'r.tirado@doce25.org',
  'info@doce25.org',
  'edgardoehernandezjr@gmail.com',
  'a.delvalle@doce25.org',
]

interface AuspiciadorFormBody {
  type: 'auspiciador'
  companyName: string
  contactName: string
  email: string
  phone?: string
  website?: string
  interestArea?: string
  message?: string
}

interface StaffFormBody {
  type: 'staff'
  fullName: string
  email: string
  phone?: string
  experience?: string
  availability?: string
  message?: string
}

type FormBody = AuspiciadorFormBody | StaffFormBody

async function sendEmail(to: string[], subject: string, htmlBody: string, textBody: string) {
  const command = new SendEmailCommand({
    Source: 'Doce25 <doce25@precotracks.org>',
    ReplyToAddresses: ['info@doce25.org'],
    Destination: {
      ToAddresses: to,
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
        Text: {
          Data: textBody,
          Charset: 'UTF-8',
        },
      },
    },
  })
  return sesClient.send(command)
}

function buildAuspiciadorEmail(body: AuspiciadorFormBody): { html: string; text: string } {
  const html = `
    <!DOCTYPE html>
    <html>
      <head><meta charset="UTF-8"></head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #0ea5e9 0%, #14b8a6 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0;">
            <h2 style="margin: 0;">🏢 Nueva Solicitud de Auspiciador</h2>
          </div>
          <div style="padding: 20px; background: #f9fafb; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
            <div style="margin: 10px 0; padding: 10px; background: white; border-left: 4px solid #0ea5e9;">
              <strong>Empresa/Compañía:</strong> ${body.companyName}
            </div>
            <div style="margin: 10px 0; padding: 10px; background: white; border-left: 4px solid #0ea5e9;">
              <strong>Contacto:</strong> ${body.contactName}
            </div>
            <div style="margin: 10px 0; padding: 10px; background: white; border-left: 4px solid #0ea5e9;">
              <strong>Email:</strong> ${body.email}
            </div>
            ${body.phone ? `<div style="margin: 10px 0; padding: 10px; background: white; border-left: 4px solid #0ea5e9;"><strong>Teléfono:</strong> ${body.phone}</div>` : ''}
            ${body.website ? `<div style="margin: 10px 0; padding: 10px; background: white; border-left: 4px solid #0ea5e9;"><strong>Sitio web:</strong> ${body.website}</div>` : ''}
            ${body.interestArea ? `<div style="margin: 10px 0; padding: 10px; background: white; border-left: 4px solid #0ea5e9;"><strong>Área de interés:</strong> ${body.interestArea}</div>` : ''}
            ${body.message ? `<div style="margin: 10px 0; padding: 10px; background: white; border-left: 4px solid #0ea5e9;"><strong>Mensaje:</strong><br/>${body.message.replace(/\n/g, '<br/>')}</div>` : ''}
          </div>
        </div>
      </body>
    </html>
  `
  const text = `Nueva Solicitud de Auspiciador\n\nEmpresa: ${body.companyName}\nContacto: ${body.contactName}\nEmail: ${body.email}\n${body.phone ? `Teléfono: ${body.phone}\n` : ''}${body.website ? `Web: ${body.website}\n` : ''}${body.interestArea ? `Área de interés: ${body.interestArea}\n` : ''}${body.message ? `\nMensaje: ${body.message}` : ''}`
  return { html, text }
}

function buildStaffEmail(body: StaffFormBody): { html: string; text: string } {
  const html = `
    <!DOCTYPE html>
    <html>
      <head><meta charset="UTF-8"></head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #14b8a6 0%, #0ea5e9 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0;">
            <h2 style="margin: 0;">👥 Nueva Solicitud de Voluntario Staff</h2>
          </div>
          <div style="padding: 20px; background: #f9fafb; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
            <div style="margin: 10px 0; padding: 10px; background: white; border-left: 4px solid #14b8a6;">
              <strong>Nombre completo:</strong> ${body.fullName}
            </div>
            <div style="margin: 10px 0; padding: 10px; background: white; border-left: 4px solid #14b8a6;">
              <strong>Email:</strong> ${body.email}
            </div>
            ${body.phone ? `<div style="margin: 10px 0; padding: 10px; background: white; border-left: 4px solid #14b8a6;"><strong>Teléfono:</strong> ${body.phone}</div>` : ''}
            ${body.experience ? `<div style="margin: 10px 0; padding: 10px; background: white; border-left: 4px solid #14b8a6;"><strong>Experiencia:</strong><br/>${body.experience.replace(/\n/g, '<br/>')}</div>` : ''}
            ${body.availability ? `<div style="margin: 10px 0; padding: 10px; background: white; border-left: 4px solid #14b8a6;"><strong>Disponibilidad:</strong> ${body.availability}</div>` : ''}
            ${body.message ? `<div style="margin: 10px 0; padding: 10px; background: white; border-left: 4px solid #14b8a6;"><strong>Mensaje:</strong><br/>${body.message.replace(/\n/g, '<br/>')}</div>` : ''}
          </div>
        </div>
      </body>
    </html>
  `
  const text = `Nueva Solicitud de Voluntario Staff\n\nNombre: ${body.fullName}\nEmail: ${body.email}\n${body.phone ? `Teléfono: ${body.phone}\n` : ''}${body.experience ? `Experiencia: ${body.experience}\n` : ''}${body.availability ? `Disponibilidad: ${body.availability}\n` : ''}${body.message ? `\nMensaje: ${body.message}` : ''}`
  return { html, text }
}

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const headers = {
    'Access-Control-Allow-Origin': 'https://doce25.precotracks.org',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  }

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' }
  }

  try {
    const body: FormBody = JSON.parse(event.body || '{}')
    const isAuspiciador = event.path?.includes('auspiciador') || body.type === 'auspiciador'

    if (isAuspiciador) {
      const data = body as AuspiciadorFormBody
      if (!data.companyName || !data.contactName || !data.email) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ message: 'Empresa, nombre de contacto y email son requeridos' }),
        }
      }
      const { html, text } = buildAuspiciadorEmail(data)
      await sendEmail(
        NOTIFICATION_EMAILS,
        `🏢 Nueva solicitud de auspiciador: ${data.companyName}`,
        html,
        text
      )
    } else {
      const data = body as StaffFormBody
      if (!data.fullName || !data.email) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ message: 'Nombre completo y email son requeridos' }),
        }
      }
      const { html, text } = buildStaffEmail(data)
      await sendEmail(
        NOTIFICATION_EMAILS,
        `👥 Nueva solicitud de voluntario staff: ${data.fullName}`,
        html,
        text
      )
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'Solicitud enviada correctamente' }),
    }
  } catch (error: any) {
    console.error('Error:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        message: 'Error al enviar la solicitud',
        error: error.message,
      }),
    }
  }
}




const sesClient = new SESClient({})

const NOTIFICATION_EMAILS = [
  'r.tirado@doce25.org',
  'info@doce25.org',
  'edgardoehernandezjr@gmail.com',
  'a.delvalle@doce25.org',
]

interface AuspiciadorFormBody {
  type: 'auspiciador'
  companyName: string
  contactName: string
  email: string
  phone?: string
  website?: string
  interestArea?: string
  message?: string
}

interface StaffFormBody {
  type: 'staff'
  fullName: string
  email: string
  phone?: string
  experience?: string
  availability?: string
  message?: string
}

type FormBody = AuspiciadorFormBody | StaffFormBody

async function sendEmail(to: string[], subject: string, htmlBody: string, textBody: string) {
  const command = new SendEmailCommand({
    Source: 'Doce25 <doce25@precotracks.org>',
    ReplyToAddresses: ['info@doce25.org'],
    Destination: {
      ToAddresses: to,
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
        Text: {
          Data: textBody,
          Charset: 'UTF-8',
        },
      },
    },
  })
  return sesClient.send(command)
}

function buildAuspiciadorEmail(body: AuspiciadorFormBody): { html: string; text: string } {
  const html = `
    <!DOCTYPE html>
    <html>
      <head><meta charset="UTF-8"></head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #0ea5e9 0%, #14b8a6 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0;">
            <h2 style="margin: 0;">🏢 Nueva Solicitud de Auspiciador</h2>
          </div>
          <div style="padding: 20px; background: #f9fafb; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
            <div style="margin: 10px 0; padding: 10px; background: white; border-left: 4px solid #0ea5e9;">
              <strong>Empresa/Compañía:</strong> ${body.companyName}
            </div>
            <div style="margin: 10px 0; padding: 10px; background: white; border-left: 4px solid #0ea5e9;">
              <strong>Contacto:</strong> ${body.contactName}
            </div>
            <div style="margin: 10px 0; padding: 10px; background: white; border-left: 4px solid #0ea5e9;">
              <strong>Email:</strong> ${body.email}
            </div>
            ${body.phone ? `<div style="margin: 10px 0; padding: 10px; background: white; border-left: 4px solid #0ea5e9;"><strong>Teléfono:</strong> ${body.phone}</div>` : ''}
            ${body.website ? `<div style="margin: 10px 0; padding: 10px; background: white; border-left: 4px solid #0ea5e9;"><strong>Sitio web:</strong> ${body.website}</div>` : ''}
            ${body.interestArea ? `<div style="margin: 10px 0; padding: 10px; background: white; border-left: 4px solid #0ea5e9;"><strong>Área de interés:</strong> ${body.interestArea}</div>` : ''}
            ${body.message ? `<div style="margin: 10px 0; padding: 10px; background: white; border-left: 4px solid #0ea5e9;"><strong>Mensaje:</strong><br/>${body.message.replace(/\n/g, '<br/>')}</div>` : ''}
          </div>
        </div>
      </body>
    </html>
  `
  const text = `Nueva Solicitud de Auspiciador\n\nEmpresa: ${body.companyName}\nContacto: ${body.contactName}\nEmail: ${body.email}\n${body.phone ? `Teléfono: ${body.phone}\n` : ''}${body.website ? `Web: ${body.website}\n` : ''}${body.interestArea ? `Área de interés: ${body.interestArea}\n` : ''}${body.message ? `\nMensaje: ${body.message}` : ''}`
  return { html, text }
}

function buildStaffEmail(body: StaffFormBody): { html: string; text: string } {
  const html = `
    <!DOCTYPE html>
    <html>
      <head><meta charset="UTF-8"></head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #14b8a6 0%, #0ea5e9 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0;">
            <h2 style="margin: 0;">👥 Nueva Solicitud de Voluntario Staff</h2>
          </div>
          <div style="padding: 20px; background: #f9fafb; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
            <div style="margin: 10px 0; padding: 10px; background: white; border-left: 4px solid #14b8a6;">
              <strong>Nombre completo:</strong> ${body.fullName}
            </div>
            <div style="margin: 10px 0; padding: 10px; background: white; border-left: 4px solid #14b8a6;">
              <strong>Email:</strong> ${body.email}
            </div>
            ${body.phone ? `<div style="margin: 10px 0; padding: 10px; background: white; border-left: 4px solid #14b8a6;"><strong>Teléfono:</strong> ${body.phone}</div>` : ''}
            ${body.experience ? `<div style="margin: 10px 0; padding: 10px; background: white; border-left: 4px solid #14b8a6;"><strong>Experiencia:</strong><br/>${body.experience.replace(/\n/g, '<br/>')}</div>` : ''}
            ${body.availability ? `<div style="margin: 10px 0; padding: 10px; background: white; border-left: 4px solid #14b8a6;"><strong>Disponibilidad:</strong> ${body.availability}</div>` : ''}
            ${body.message ? `<div style="margin: 10px 0; padding: 10px; background: white; border-left: 4px solid #14b8a6;"><strong>Mensaje:</strong><br/>${body.message.replace(/\n/g, '<br/>')}</div>` : ''}
          </div>
        </div>
      </body>
    </html>
  `
  const text = `Nueva Solicitud de Voluntario Staff\n\nNombre: ${body.fullName}\nEmail: ${body.email}\n${body.phone ? `Teléfono: ${body.phone}\n` : ''}${body.experience ? `Experiencia: ${body.experience}\n` : ''}${body.availability ? `Disponibilidad: ${body.availability}\n` : ''}${body.message ? `\nMensaje: ${body.message}` : ''}`
  return { html, text }
}

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const headers = {
    'Access-Control-Allow-Origin': 'https://doce25.precotracks.org',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  }

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' }
  }

  try {
    const body: FormBody = JSON.parse(event.body || '{}')
    const isAuspiciador = event.path?.includes('auspiciador') || body.type === 'auspiciador'

    if (isAuspiciador) {
      const data = body as AuspiciadorFormBody
      if (!data.companyName || !data.contactName || !data.email) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ message: 'Empresa, nombre de contacto y email son requeridos' }),
        }
      }
      const { html, text } = buildAuspiciadorEmail(data)
      await sendEmail(
        NOTIFICATION_EMAILS,
        `🏢 Nueva solicitud de auspiciador: ${data.companyName}`,
        html,
        text
      )
    } else {
      const data = body as StaffFormBody
      if (!data.fullName || !data.email) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ message: 'Nombre completo y email son requeridos' }),
        }
      }
      const { html, text } = buildStaffEmail(data)
      await sendEmail(
        NOTIFICATION_EMAILS,
        `👥 Nueva solicitud de voluntario staff: ${data.fullName}`,
        html,
        text
      )
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'Solicitud enviada correctamente' }),
    }
  } catch (error: any) {
    console.error('Error:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        message: 'Error al enviar la solicitud',
        error: error.message,
      }),
    }
  }
}

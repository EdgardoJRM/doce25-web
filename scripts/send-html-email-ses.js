#!/usr/bin/env node
/**
 * Envía un archivo HTML por AWS SES.
 * Uso: node scripts/send-html-email-ses.js <email> <ruta.html> [asunto] [nombre]
 *
 * Personalización: si el HTML contiene {{NOMBRE_PARTE}}, se reemplaza por " Nombre" (con espacio)
 * o por cadena vacía si no pasas [nombre].
 *
 * Requiere: .env.local con AWS credenciales, SES_FROM_EMAIL verificado en SES.
 */

const fs = require('fs')
const path = require('path')
const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses')
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') })

const AWS_REGION = process.env.AWS_REGION || 'us-east-1'
const SES_FROM_EMAIL = process.env.SES_FROM_EMAIL || 'doce25@precotracks.org'
const sesClient = new SESClient({ region: AWS_REGION })

function htmlToPlainText(html) {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 12000)
}

async function main() {
  const to = process.argv[2]
  const fileArg = process.argv[3]
  const subject = process.argv[4] || 'Mensaje de Doce25'
  const nombre = process.argv[5] || ''

  if (!to || !fileArg) {
    console.error(
      'Uso: node scripts/send-html-email-ses.js <email> <archivo.html> [asunto] [nombre]'
    )
    process.exit(1)
  }

  const filePath = path.resolve(__dirname, '..', fileArg)
  if (!fs.existsSync(filePath)) {
    console.error('No existe el archivo:', filePath)
    process.exit(1)
  }

  let htmlBody = fs.readFileSync(filePath, 'utf8')
  const nombreParte = nombre.trim() ? ` ${nombre.trim()}` : ''
  htmlBody = htmlBody.replace(/\{\{NOMBRE_PARTE\}\}/g, nombreParte)

  const textBody = htmlToPlainText(htmlBody)

  console.log('Destino:', to)
  console.log('Desde:', SES_FROM_EMAIL)
  console.log('Archivo:', filePath)
  if (nombre.trim()) console.log('Nombre:', nombre.trim())

  const command = new SendEmailCommand({
    Source: SES_FROM_EMAIL,
    Destination: { ToAddresses: [to] },
    Message: {
      Subject: { Data: subject, Charset: 'UTF-8' },
      Body: {
        Html: { Data: htmlBody, Charset: 'UTF-8' },
        Text: { Data: textBody, Charset: 'UTF-8' },
      },
    },
  })

  const response = await sesClient.send(command)
  console.log('Enviado. MessageId:', response.MessageId)
}

main().catch((err) => {
  console.error('Error:', err.message)
  process.exit(1)
})

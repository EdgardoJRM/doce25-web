import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses'

// Cliente SES para uso en Lambda functions
// No usar directamente en el frontend por seguridad

const sesClient = new SESClient({
  region: process.env.AWS_REGION || 'us-east-1',
})

export interface EmailData {
  to: string
  subject: string
  htmlBody: string
  textBody?: string
}

export async function sendEmail(data: EmailData) {
  const command = new SendEmailCommand({
    Source: process.env.SES_FROM_EMAIL || 'doce25@precotracks.org',
    Destination: {
      ToAddresses: [data.to],
    },
    Message: {
      Subject: {
        Data: data.subject,
        Charset: 'UTF-8',
      },
      Body: {
        Html: {
          Data: data.htmlBody,
          Charset: 'UTF-8',
        },
        Text: data.textBody
          ? {
              Data: data.textBody,
              Charset: 'UTF-8',
            }
          : undefined,
      },
    },
  })

  return sesClient.send(command)
}


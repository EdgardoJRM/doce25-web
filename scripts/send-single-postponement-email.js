#!/usr/bin/env node

/**
 * Script para enviar email de postergación a un email específico
 * Uso: node scripts/send-single-postponement-email.js <email>
 */

const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses')
require('dotenv').config({ path: '.env.local' })

const AWS_REGION = process.env.AWS_REGION || 'us-east-1'
const SES_FROM_EMAIL = process.env.SES_FROM_EMAIL || 'doce25@precotracks.org'

// Inicializar cliente SES
const sesClient = new SESClient({ region: AWS_REGION })

// Contenido del email
const EMAIL_SUBJECT = '🗓️ Cambio de Fecha - Limpieza de Playa Doce25'

const EMAIL_HTML = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #0ea5e9 0%, #14b8a6 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
        .highlight { background: #fef3c7; padding: 15px; border-left: 4px solid #f59e0b; margin: 20px 0; border-radius: 4px; }
        .date-box { background: white; border: 2px solid #0ea5e9; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0; }
        .date-box h3 { color: #0ea5e9; margin: 0 0 10px 0; font-size: 14px; }
        .date-box .date { font-size: 28px; font-weight: bold; color: #1f2937; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; border-top: 1px solid #e5e7eb; margin-top: 20px; }
        .signature { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🌊 Doce25</h1>
            <p>Limpieza de Playas</p>
        </div>
        
        <div class="content">
            <p>Saludos,</p>
            
            <p>Esperamos que se encuentren muy bien. Queremos agradecerles sinceramente por haberse registrado y por su compromiso con nuestra misión de mantener nuestras playas limpias y seguras para todos.</p>
            
            <div class="highlight">
                <p><strong>⚠️ Aviso Importante:</strong> Debido a las condiciones del tiempo y pensando siempre en la seguridad de todos los voluntarios, nos vemos en la obligación de posponer la limpieza de playa que estaba programada para hoy.</p>
            </div>
            
            <p>Aunque teníamos todo listo para recibirles, las condiciones del clima no son favorables en este momento y nuestra prioridad es la seguridad y el bienestar de cada uno de ustedes.</p>
            
            <p><strong>La limpieza de playa ha sido reprogramada para la siguiente fecha:</strong></p>
            
            <div class="date-box">
                <h3>🗓️ Nueva Fecha</h3>
                <div class="date">12 de Abril</div>
            </div>
            
            <p><strong>✅ Su registro seguirá siendo válido automáticamente para la nueva fecha, por lo que no será necesario registrarse nuevamente.</strong></p>
            
            <p>Agradecemos enormemente su disposición para servir, su compromiso con el ambiente y su apoyo a nuestra fundación. Personas como ustedes hacen posible este movimiento y el impacto positivo que estamos logrando en nuestras costas.</p>
            
            <p>Si tienen alguna pregunta, pueden responder a este correo y con gusto les ayudaremos.</p>
            
            <p>Gracias nuevamente por ser parte del cambio.</p>
            
            <div class="signature">
                <p><strong>Atentamente,</strong></p>
                <p><strong>Doce25</strong></p>
                <p>🌊 Limpieza de Playas</p>
            </div>
        </div>
        
        <div class="footer">
            <p>Este es un correo automático. Por favor no responda a esta dirección.</p>
        </div>
    </div>
</body>
</html>
`

const EMAIL_TEXT = `
Saludos,

Esperamos que se encuentren muy bien. Queremos agradecerles sinceramente por haberse registrado y por su compromiso con nuestra misión de mantener nuestras playas limpias y seguras para todos.

Debido a las condiciones del tiempo y pensando siempre en la seguridad de todos los voluntarios, nos vemos en la obligación de posponer la limpieza de playa que estaba programada para hoy. Aunque teníamos todo listo para recibirles, las condiciones del clima no son favorables en este momento y nuestra prioridad es la seguridad y el bienestar de cada uno de ustedes.

La limpieza de playa ha sido reprogramada para la siguiente fecha:

🗓️ Nueva fecha: 12 de abril

Su registro seguirá siendo válido automáticamente para la nueva fecha, por lo que no será necesario registrarse nuevamente.

Agradecemos enormemente su disposición para servir, su compromiso con el ambiente y su apoyo a nuestra fundación. Personas como ustedes hacen posible este movimiento y el impacto positivo que estamos logrando en nuestras costas.

Si tienen alguna pregunta, pueden responder a este correo y con gusto les ayudaremos.

Gracias nuevamente por ser parte del cambio.

Atentamente,
Doce25
`

async function sendEmail(toEmail) {
  try {
    console.log(`\n📧 Enviando email a: ${toEmail}`)
    console.log(`📤 Desde: ${SES_FROM_EMAIL}`)
    console.log(`🌍 Región: ${AWS_REGION}\n`)

    const command = new SendEmailCommand({
      Source: SES_FROM_EMAIL,
      Destination: {
        ToAddresses: [toEmail],
      },
      Message: {
        Subject: {
          Data: EMAIL_SUBJECT,
          Charset: 'UTF-8',
        },
        Body: {
          Html: {
            Data: EMAIL_HTML,
            Charset: 'UTF-8',
          },
          Text: {
            Data: EMAIL_TEXT,
            Charset: 'UTF-8',
          },
        },
      },
    })

    const response = await sesClient.send(command)
    
    console.log('✅ Email enviado exitosamente!')
    console.log(`📨 Message ID: ${response.MessageId}\n`)
    
    return true
  } catch (error) {
    console.error('❌ Error enviando email:', error.message)
    console.error('Detalles:', error)
    return false
  }
}

async function main() {
  const email = process.argv[2]

  if (!email) {
    console.error('❌ Error: Debes proporcionar un email')
    console.log('Uso: node scripts/send-single-postponement-email.js <email>')
    console.log('Ejemplo: node scripts/send-single-postponement-email.js user@example.com')
    process.exit(1)
  }

  // Validar formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    console.error('❌ Error: El email no tiene un formato válido')
    process.exit(1)
  }

  console.log('\n🚀 Iniciando envío de email de postergación...')
  console.log('='.repeat(50))

  const success = await sendEmail(email)

  if (success) {
    console.log('='.repeat(50))
    console.log('🎉 ¡Email enviado correctamente!')
  } else {
    console.log('='.repeat(50))
    console.log('⚠️  Hubo un error al enviar el email')
    process.exit(1)
  }
}

main()

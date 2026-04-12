#!/usr/bin/env node

/**
 * Métricas RSVP para limpieza 12 abr 2026 (campos rsvpCleanup20260412 / rsvpCleanup20260412At)
 *
 * Uso: node scripts/rsvp-stats.js <eventId> [--csv]
 */

const { DynamoDBClient } = require('@aws-sdk/client-dynamodb')
const { DynamoDBDocumentClient, QueryCommand } = require('@aws-sdk/lib-dynamodb')
require('dotenv').config({ path: '.env.local' })

const REGISTRATIONS_TABLE = process.env.REGISTRATIONS_TABLE || 'Dosce25-Registrations'
const RSVP_FIELD = 'rsvpCleanup20260412'
const RSVP_AT = 'rsvpCleanup20260412At'

const dynamoClient = DynamoDBDocumentClient.from(new DynamoDBClient({ region: process.env.AWS_REGION || 'us-east-1' }))

async function main() {
  const eventId = process.argv[2]
  const csv = process.argv.includes('--csv')
  if (!eventId) {
    console.error('Uso: node scripts/rsvp-stats.js <eventId> [--csv]')
    process.exit(1)
  }

  const result = await dynamoClient.send(
    new QueryCommand({
      TableName: REGISTRATIONS_TABLE,
      IndexName: 'EventIdIndex',
      KeyConditionExpression: 'eventId = :eventId',
      ExpressionAttributeValues: { ':eventId': eventId },
    })
  )

  const items = result.Items || []
  let yes = 0
  let no = 0
  let pending = 0

  const rows = []
  for (const r of items) {
    const v = r[RSVP_FIELD]
    const name = r.fullName || r.name || ''
    const email = r.email || ''
    const at = r[RSVP_AT] || ''
    if (v === 'yes') {
      yes++
      rows.push({ name, email, rsvp: 'sí', at })
    } else if (v === 'no') {
      no++
      rows.push({ name, email, rsvp: 'no', at })
    } else {
      pending++
      rows.push({ name, email, rsvp: 'pendiente', at: '' })
    }
  }

  console.log('\n📊 RSVP — Limpieza 12 abril 2026\n')
  console.log(`Sí:        ${yes}`)
  console.log(`No:        ${no}`)
  console.log(`Pendiente: ${pending}`)
  console.log(`Total:     ${items.length}\n`)

  if (csv) {
    console.log('nombre,email,respuesta,fecha_respuesta')
    for (const row of rows) {
      const esc = (s) => `"${String(s).replace(/"/g, '""')}"`
      console.log([esc(row.name), esc(row.email), esc(row.rsvp), esc(row.at)].join(','))
    }
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

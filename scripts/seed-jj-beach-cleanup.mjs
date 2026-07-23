#!/usr/bin/env node
/**
 * Crea o actualiza el evento Johnson & Johnson Beach Cleanup (unlisted, capacity 60).
 *
 * Uso:
 *   AWS_PROFILE=... node scripts/seed-jj-beach-cleanup.mjs
 *
 * Requiere credenciales AWS con acceso a DynamoDB (tabla Dosce25-Events).
 */

import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import {
  DynamoDBDocumentClient,
  PutCommand,
  ScanCommand,
} from '@aws-sdk/lib-dynamodb'
import { randomUUID } from 'crypto'

const EVENTS_TABLE = process.env.EVENTS_TABLE || 'Dosce25-Events'
const SLUG = 'jj-beach-cleanup-2026'

const eventPayload = {
  name: 'Johnson & Johnson Beach Cleanup',
  slug: SLUG,
  description:
    'Actividad privada de voluntariado corporativo para empleados de Johnson & Johnson. Limpieza de Playa Aviones, Loíza, con orientación, materiales, pesaje, team building y clase de salsa. Organizado por Johnson & Johnson Innovative Medicine en colaboración con Doce25. Horario: 8:30 a.m. a 12:30 p.m.',
  date: '2026-08-14T08:30:00-04:00',
  dateTime: '2026-08-14T08:30:00-04:00',
  endDateTime: '2026-08-14T12:30:00-04:00',
  location: 'Playa Aviones, Loíza, Puerto Rico',
  capacity: 60,
  image: '',
  status: 'published',
  visibility: 'unlisted',
}

async function main() {
  const client = DynamoDBDocumentClient.from(new DynamoDBClient({}))

  const existing = await client.send(
    new ScanCommand({
      TableName: EVENTS_TABLE,
      FilterExpression: 'slug = :slug',
      ExpressionAttributeValues: { ':slug': SLUG },
    })
  )

  const found = existing.Items?.[0]
  const eventId = found?.eventId || randomUUID()
  const now = new Date().toISOString()

  await client.send(
    new PutCommand({
      TableName: EVENTS_TABLE,
      Item: {
        ...eventPayload,
        eventId,
        createdAt: found?.createdAt || now,
        updatedAt: now,
      },
    })
  )

  console.log(found ? 'Updated event' : 'Created event', {
    eventId,
    slug: SLUG,
    visibility: 'unlisted',
    capacity: 60,
    landing: '/jj-limpieza',
    legacyLanding: `/eventos/${SLUG}`,
  })
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

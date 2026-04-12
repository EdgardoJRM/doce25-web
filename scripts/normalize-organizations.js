#!/usr/bin/env node
/**
 * Normaliza el campo `organization` (y `eventOrganization`) de los registros
 * del evento, unificando variantes tipográficas al nombre canónico.
 *
 * Uso:
 *   node scripts/normalize-organizations.js
 *   DRY_RUN=1 node scripts/normalize-organizations.js   # solo lista cambios, no actualiza
 *
 * El update va directo a DynamoDB via AWS SDK (no usa el API REST).
 * Requiere: .env.local con AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION
 */

const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') })

const { DynamoDBClient } = require('@aws-sdk/client-dynamodb')
const { DynamoDBDocumentClient, QueryCommand, UpdateCommand } = require('@aws-sdk/lib-dynamodb')

const REGION = process.env.AWS_REGION || 'us-east-1'
const TABLE  = process.env.REGISTRATIONS_TABLE || 'Dosce25-Registrations'
const EVENT_ID = process.env.EVENT_ID || 'ea44d757-de19-4a13-aa9f-afbf0da433f2'
const DRY = process.env.DRY_RUN === '1' || process.env.DRY_RUN === 'true'

const client = DynamoDBDocumentClient.from(new DynamoDBClient({ region: REGION }))

// ── Mapa de normalización ──────────────────────────────────────────────────
// clave  = texto exacto guardado en DB
// valor  = nombre canónico al que se migra
const NORMALIZATION_MAP = {
  // AAPEDS
  'AAPEDS- Rio Piedras':                         'AAPEDS - Río Piedras',

  // AESPUG
  'AESPUG':                                      'AESPUG - RCM',
  'AESPUG -Recinto de Ciencias Medicas':         'AESPUG - RCM',
  'AESPUG RCM':                                  'AESPUG - RCM',
  'AESPUG-RCM':                                  'AESPUG - RCM',

  // Colegio de La Salle
  'Colegio De La Salle':                         'Colegio de La Salle',
  'Colegio de la salle':                         'Colegio de La Salle',
  'La Salle':                                    'Colegio de La Salle',

  // CPM
  'CPM- Mayagüez':                               'CPM - UPR Mayagüez',
  'CPM- UPR Mayagüez':                           'CPM - UPR Mayagüez',

  // Escuela Pedro Falú
  'Escuela Pedro falu orellano':                 'Escuela Pedro Falú Orellano',
  'Escuela pedro falu ..rio grande':             'Escuela Pedro Falú Orellano',

  // FPA UPRRP
  'FPA UPRRP':                                   'FPA - UPRRP',
  'FPA- UPR Rio Piedras':                        'FPA - UPRRP',
  'FPA- UPRRP':                                  'FPA - UPRRP',

  // HOSA
  'HOSA':                                        'HOSA - UPRRP',
  'HOSA-UPRRP':                                  'HOSA - UPRRP',

  // Hortus
  'Hortus, sociedad de honor':                   'Hortus',

  // IRP
  'IRP- Plus':                                   'IRP+',

  // MedLife Inter Metro (12 variantes)
  'MED LIFE Inter metro':                        'MedLife Inter Metro',
  'MEDLIFE INTER METRO':                         'MedLife Inter Metro',
  'MEDLIFE Inter Metro':                         'MedLife Inter Metro',
  'MEDLIFE Intermetro':                          'MedLife Inter Metro',
  'Med Life Inter Metro':                        'MedLife Inter Metro',
  'Med life Intermetro':                         'MedLife Inter Metro',
  'MedLife Capítulo Metro':                      'MedLife Inter Metro',
  'Medlife - Inter Recinto Metro':               'MedLife Inter Metro',
  'Medlife Inter Metro':                         'MedLife Inter Metro',
  'Medlife Inter metro':                         'MedLife Inter Metro',
  'Medlife InterMetro':                          'MedLife Inter Metro',
  'Medlife Intermetro':                          'MedLife Inter Metro',
  'Medlife inter metro':                         'MedLife Inter Metro',

  // Neuroboricuas Río Piedras (7 variantes)
  'NeuroBoricuas UPR Río Piedras':              'Neuroboricuas UPR - Río Piedras',
  'NeuroBoricuas UPRRP':                         'Neuroboricuas UPR - Río Piedras',
  'Neuroboricuas UPR Río Piedras':              'Neuroboricuas UPR - Río Piedras',
  'Neuroboricuas UPRRP':                         'Neuroboricuas UPR - Río Piedras',
  'Neuroboricuas rio piedras':                   'Neuroboricuas UPR - Río Piedras',
  'Neuroboricuas- Rio Piedras':                  'Neuroboricuas UPR - Río Piedras',
  'Neuroboricuas- UPR Rio Piedras':              'Neuroboricuas UPR - Río Piedras',

  // PVSA
  'PVSAUPRRP':                                   'PVSA - UPRRP',

  // Sociedad de Honor Junior - Fidei
  'Junior Honor society- Fidei':                 'Sociedad de Honor Junior - Fidei',

  // Sociedad Eco-Ambiental
  'Sociedad Eco Ambiental (SEA)':               'Sociedad Eco-Ambiental UPRRP',

  // University Gardens
  'University Gardens Highschool':               'University Gardens High School',

  // Veterinary UAGM
  'Veterinary Technology Community':             'Vet-Tech Community UAGM - Gurabo',
  'Veterinary Tecnology Community UAGM \u2014Gurabo': 'Vet-Tech Community UAGM - Gurabo',
}

async function getAllRegistrations() {
  const items = []
  let lastKey = undefined
  do {
    const res = await client.send(new QueryCommand({
      TableName: TABLE,
      IndexName: 'EventIdIndex',
      KeyConditionExpression: 'eventId = :eid',
      ExpressionAttributeValues: { ':eid': EVENT_ID },
      ExclusiveStartKey: lastKey,
    }))
    items.push(...(res.Items || []))
    lastKey = res.LastEvaluatedKey
  } while (lastKey)
  return items
}

async function updateField(registrationId, field, value) {
  const attrName = field === 'organization' ? '#org' : '#eo'
  const attrKey  = field === 'organization' ? 'organization' : 'eventOrganization'
  await client.send(new UpdateCommand({
    TableName: TABLE,
    Key: { registrationId },
    UpdateExpression: `SET ${attrName} = :val, updatedAt = :ts`,
    ExpressionAttributeNames: { [attrName]: attrKey },
    ExpressionAttributeValues: { ':val': value, ':ts': new Date().toISOString() },
  }))
}

async function main() {
  console.log(DRY ? '[DRY RUN] No se harán cambios en DB.' : 'Iniciando normalización en DynamoDB...')
  console.log('Tabla:', TABLE, '| Evento:', EVENT_ID)
  console.log('')

  const regs = await getAllRegistrations()
  console.log('Registros en el evento:', regs.length)

  let updated = 0, skipped = 0

  for (const r of regs) {
    const org = (r.organization || '').trim()
    const eo  = (r.eventOrganization || '').trim()

    const newOrg = NORMALIZATION_MAP[org]
    const newEo  = NORMALIZATION_MAP[eo]

    if (newOrg) {
      console.log(`  [org] ${r.name || r.fullName || r.registrationId}`)
      console.log(`        "${org}" → "${newOrg}"`)
      if (!DRY) await updateField(r.registrationId, 'organization', newOrg)
      updated++
      await new Promise(res => setTimeout(res, 80))
    }
    if (newEo) {
      console.log(`  [eo]  ${r.name || r.fullName || r.registrationId}`)
      console.log(`        "${eo}" → "${newEo}"`)
      if (!DRY) await updateField(r.registrationId, 'eventOrganization', newEo)
      updated++
      await new Promise(res => setTimeout(res, 80))
    }
    if (!newOrg && !newEo) skipped++
  }

  console.log('')
  console.log(`Listo. Actualizados: ${updated} | Sin cambio: ${skipped}`)
}

main().catch(e => { console.error(e); process.exit(1) })

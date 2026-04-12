#!/usr/bin/env node
/**
 * Borra registros de prueba viejos del evento, conservando solo los IDs del último seed.
 *
 * Criterio de borrado: nombre empieza por "Test " O email contiene @doce25test.dev
 * Conservados: registrationId listados en scripts/e2e-seed-latest.json
 *
 *   node scripts/prune-old-test-registrations.js
 *   DRY_RUN=1 node scripts/prune-old-test-registrations.js   # solo lista
 */

const fs = require('fs')
const path = require('path')

const API =
  process.env.API_ENDPOINT ||
  process.env.NEXT_PUBLIC_API_ENDPOINT ||
  'https://moo5jpvl56.execute-api.us-east-1.amazonaws.com/prod'

const SEED = path.join(__dirname, 'e2e-seed-latest.json')
const DRY = process.env.DRY_RUN === '1' || process.env.DRY_RUN === 'true'

function isTestRow(r) {
  const name = (r.name || '').trim()
  const email = (r.email || '').toLowerCase()
  return name.startsWith('Test ') || email.includes('@doce25test.dev')
}

async function main() {
  if (!fs.existsSync(SEED)) {
    console.error('Falta', SEED)
    process.exit(1)
  }

  const seed = JSON.parse(fs.readFileSync(SEED, 'utf8'))
  const eventId = seed.eventId
  const keep = new Set(
    (seed.registrations || []).map((x) => x.registrationId).filter(Boolean)
  )

  if (keep.size === 0) {
    console.error('e2e-seed-latest.json no tiene registrationId')
    process.exit(1)
  }

  const res = await fetch(`${API}/events/${eventId}/registrations`)
  if (!res.ok) {
    console.error('GET registrations', res.status, await res.text())
    process.exit(1)
  }

  const data = await res.json()
  const list = data.registrations || []

  const toDelete = list.filter(
    (r) => isTestRow(r) && !keep.has(r.registrationId)
  )

  console.log(
    `Evento ${eventId}: ${list.length} registros totales, ${toDelete.length} de prueba a eliminar (se conservan ${keep.size} del seed actual).`
  )
  if (DRY) {
    toDelete.forEach((r) =>
      console.log('  [DRY_RUN]', r.name, r.registrationId, r.email)
    )
    return
  }

  for (const r of toDelete) {
    const del = await fetch(
      `${API}/registrations/${r.registrationId}`,
      { method: 'DELETE' }
    )
    const txt = await del.text()
    if (!del.ok) {
      console.error('FAIL', r.registrationId, del.status, txt)
    } else {
      console.log('deleted', r.name, r.registrationId)
    }
    await new Promise((resolve) => setTimeout(resolve, 150))
  }

  console.log('Listo.')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

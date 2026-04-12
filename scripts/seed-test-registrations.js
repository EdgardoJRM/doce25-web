#!/usr/bin/env node
/**
 * Crea registros de prueba vía POST /events/{eventId}/register
 * Uso:
 *   node scripts/seed-test-registrations.js
 *   API_ENDPOINT=https://xxx.execute-api.../prod node scripts/seed-test-registrations.js
 *
 * Al final imprime URLs de check-in y una checklist para prueba manual E2E.
 * Escribe scripts/e2e-seed-latest.json para usar con scripts/e2e-api-smoke.js
 */

const fs = require('fs')
const path = require('path')

const API_ENDPOINT =
  process.env.API_ENDPOINT ||
  process.env.NEXT_PUBLIC_API_ENDPOINT ||
  'https://moo5jpvl56.execute-api.us-east-1.amazonaws.com/prod'

const EVENT_ID =
  process.env.EVENT_ID || 'ea44d757-de19-4a13-aa9f-afbf0da433f2'

const FRONTEND_BASE =
  process.env.FRONTEND_BASE || 'https://doce25.precotracks.org'

/** @type {{ name: string; fullName: string; email: string; note: string }[]} */
const PARTICIPANTS = [
  { name: 'Test Individual Uno', fullName: 'Test Individual Uno', email: '', note: 'individual' },
  { name: 'Test Duo A', fullName: 'Test Duo A', email: '', note: 'duo (emparejar con Duo B)' },
  { name: 'Test Duo B', fullName: 'Test Duo B', email: '', note: 'duo (emparejar con Duo A)' },
  { name: 'Test Grupo A', fullName: 'Test Grupo A', email: '', note: 'group (3 miembros A,B,C)' },
  { name: 'Test Grupo B', fullName: 'Test Grupo B', email: '', note: 'group' },
  { name: 'Test Grupo C', fullName: 'Test Grupo C', email: '', note: 'group' },
  { name: 'Test Org Alpha', fullName: 'Test Org Alpha', email: '', note: 'organization' },
  { name: 'Test Org Beta', fullName: 'Test Org Beta', email: '', note: 'organization' },
  { name: 'Test Solo Dos', fullName: 'Test Solo Dos', email: '', note: 'individual' },
  { name: 'Test Solo Tres', fullName: 'Test Solo Tres', email: '', note: 'individual' },
]

async function registerOne(row, index) {
  const suffix = `${Date.now()}-${index}`
  const email = row.email || `test+${suffix}@doce25test.dev`

  const body = {
    name: row.name,
    email,
    phone: '7875550000',
    fullName: row.fullName,
    ageRange: '18-25',
    gender: 'Otro',
    city: 'San Juan',
    organization: 'Test QA',
    otherOrganization: '',
    termsAccepted: true,
    signature: 'Test QA Seed',
    signatureDate: new Date().toISOString().split('T')[0],
  }

  const url = `${API_ENDPOINT}/events/${EVENT_ID}/register`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  const text = await res.text()
  let data
  try {
    data = JSON.parse(text)
  } catch {
    data = { raw: text }
  }

  if (!res.ok) {
    return {
      ok: false,
      status: res.status,
      name: row.name,
      note: row.note,
      email,
      error: data.message || data.error || text,
    }
  }

  return {
    ok: true,
    name: row.name,
    note: row.note,
    email,
    registrationId: data.registrationId,
    qrToken: data.qrToken,
  }
}

async function main() {
  console.log('API_ENDPOINT:', API_ENDPOINT)
  console.log('EVENT_ID:', EVENT_ID)
  console.log('---')

  const results = []
  for (let i = 0; i < PARTICIPANTS.length; i++) {
    const r = await registerOne(PARTICIPANTS[i], i)
    results.push(r)
    if (r.ok) {
      console.log(
        `[OK] ${r.name} | reg=${r.registrationId} | token=${r.qrToken}`
      )
    } else {
      console.error(`[FAIL] ${r.name} (${r.status}): ${r.error}`)
    }
    // pequeña pausa para no martillar SES/API
    await new Promise((resolve) => setTimeout(resolve, 400))
  }

  console.log('\n========== CHECK-IN URLs ==========')
  for (const r of results) {
    if (r.ok && r.qrToken) {
      console.log(`${r.name}`)
      console.log(`  ${FRONTEND_BASE}/checkin/${r.qrToken}`)
    }
  }

  console.log('\n========== ADMIN LINKS ==========')
  console.log(`Scanner: ${FRONTEND_BASE}/admin/scanner`)
  console.log(`Asistentes: ${FRONTEND_BASE}/admin/asistentes/${EVENT_ID}`)
  console.log(`Estadísticas: ${FRONTEND_BASE}/admin/eventos/${EVENT_ID}/estadisticas`)

  console.log('\n========== CHECKLIST MANUAL E2E ==========')
  console.log('1) Abre Scanner y escanea cada QR (o abre la URL de check-in).')
  console.log('2) En /checkin elige: Individual, Dúo (escanea compañero), Grupo (2 QR extra), u Organización.')
  console.log('3) En Scanner > Buscar, localiza al chequeado y registra peso.')
  console.log('4) Org: modo peso por organización en el scanner si aplica.')
  console.log('5) Verifica totales en Estadísticas del evento.')
  console.log('\nEstado API /events/' + EVENT_ID + '/stats:')
  try {
    const st = await fetch(`${API_ENDPOINT}/events/${EVENT_ID}/stats`)
    console.log('  HTTP', st.status, (await st.text()).slice(0, 500))
  } catch (e) {
    console.log('  (no se pudo leer stats)', e.message)
  }

  const seedFile = path.join(__dirname, 'e2e-seed-latest.json')
  const payload = {
    createdAt: new Date().toISOString(),
    apiEndpoint: API_ENDPOINT,
    eventId: EVENT_ID,
    frontendBase: FRONTEND_BASE,
    registrations: results
      .filter((r) => r.ok)
      .map((r) => ({
        name: r.name,
        note: r.note,
        email: r.email,
        registrationId: r.registrationId,
        qrToken: r.qrToken,
        checkinUrl: `${FRONTEND_BASE}/checkin/${r.qrToken}`,
      })),
  }
  fs.writeFileSync(seedFile, JSON.stringify(payload, null, 2), 'utf8')
  console.log('\nGuardado:', seedFile)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

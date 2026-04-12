#!/usr/bin/env node
/**
 * Smoke test API: check-in todos los registros del último seed, asigna tipos
 * (individual / duo / group / organization) y registra un peso de prueba por caso.
 *
 * Requiere: node scripts/seed-test-registrations.js (genera scripts/e2e-seed-latest.json)
 *
 *   node scripts/e2e-api-smoke.js
 */

const fs = require('fs')
const path = require('path')

const API =
  process.env.API_ENDPOINT ||
  process.env.NEXT_PUBLIC_API_ENDPOINT ||
  'https://moo5jpvl56.execute-api.us-east-1.amazonaws.com/prod'

const SEED_FILE = path.join(__dirname, 'e2e-seed-latest.json')

function byName(registrations, partial) {
  const r = registrations.find((x) => x.name.includes(partial))
  if (!r) throw new Error(`No registration matching: ${partial}`)
  return r
}

async function checkinToken(qrToken) {
  const res = await fetch(`${API}/checkin/${qrToken}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: '{}',
  })
  const text = await res.text()
  let data
  try {
    data = JSON.parse(text)
  } catch {
    data = { raw: text }
  }
  return { ok: res.ok, status: res.status, data }
}

async function putGroup(registrationId, body) {
  const res = await fetch(`${API}/registrations/${registrationId}/group`, {
    method: 'PUT',
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
  return { ok: res.ok, status: res.status, data }
}

async function postWeight(registrationId, weightCollected) {
  const res = await fetch(
    `${API}/registrations/${registrationId}/register-weight`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        weightCollected,
        trashType: 'plastic',
        registeredBy: 'staff',
        notes: 'e2e-api-smoke',
      }),
    }
  )
  const text = await res.text()
  let data
  try {
    data = JSON.parse(text)
  } catch {
    data = { raw: text }
  }
  return { ok: res.ok, status: res.status, data }
}

async function postOrgWeight(eventId, eventOrganization, weightCollected) {
  const res = await fetch(
    `${API}/events/${eventId}/register-organization-weight`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventOrganization,
        weightCollected,
        trashType: 'glass',
        registeredBy: 'staff',
        notes: 'e2e-org-weight',
      }),
    }
  )
  const text = await res.text()
  let data
  try {
    data = JSON.parse(text)
  } catch {
    data = { raw: text }
  }
  return { ok: res.ok, status: res.status, data }
}

async function main() {
  if (!fs.existsSync(SEED_FILE)) {
    console.error('Falta', SEED_FILE, '— ejecuta primero: node scripts/seed-test-registrations.js')
    process.exit(1)
  }

  const seed = JSON.parse(fs.readFileSync(SEED_FILE, 'utf8'))
  const { registrations, eventId } = seed
  if (!registrations?.length) {
    console.error('e2e-seed-latest.json sin registrations')
    process.exit(1)
  }

  console.log('API', API)
  console.log('Event', eventId)
  console.log('--- Check-in (10) ---')

  for (const r of registrations) {
    const out = await checkinToken(r.qrToken)
    if (!out.ok) {
      console.error('FAIL checkin', r.name, out.status, out.data)
    } else {
      const st = out.data?.status || out.data?.message || 'ok'
      console.log('checkin', r.name, st)
    }
  }

  const ind1 = byName(registrations, 'Individual Uno')
  const duoA = byName(registrations, 'Duo A')
  const duoB = byName(registrations, 'Duo B')
  const gA = byName(registrations, 'Grupo A')
  const gB = byName(registrations, 'Grupo B')
  const gC = byName(registrations, 'Grupo C')
  const orgA = byName(registrations, 'Org Alpha')
  const orgB = byName(registrations, 'Org Beta')
  const solo2 = byName(registrations, 'Solo Dos')
  const solo3 = byName(registrations, 'Solo Tres')

  console.log('--- Grupos ---')

  const steps = [
    ['individual', () => putGroup(ind1.registrationId, { participationType: 'individual' })],
    ['individual', () => putGroup(solo2.registrationId, { participationType: 'individual' })],
    ['individual', () => putGroup(solo3.registrationId, { participationType: 'individual' })],
    [
      'duo leader A',
      () =>
        putGroup(duoA.registrationId, {
          participationType: 'duo',
          groupMembers: [duoB.registrationId],
        }),
    ],
    [
      'group leader A',
      () =>
        putGroup(gA.registrationId, {
          participationType: 'group',
          groupMembers: [gB.registrationId, gC.registrationId],
        }),
    ],
    [
      'org Alpha',
      () =>
        putGroup(orgA.registrationId, {
          participationType: 'organization',
          eventOrganization: 'QA Org Alpha E2E',
        }),
    ],
    [
      'org Beta',
      () =>
        putGroup(orgB.registrationId, {
          participationType: 'organization',
          eventOrganization: 'QA Org Beta E2E',
        }),
    ],
  ]

  for (const [label, fn] of steps) {
    const out = await fn()
    if (!out.ok) {
      console.error('FAIL', label, out.status, out.data)
    } else {
      console.log('OK', label, out.data?.participationType || out.data?.message || '')
    }
  }

  console.log('--- Peso (lb) ---')
  const weights = [
    ['ind1', ind1.registrationId, 2.5],
    ['solo2', solo2.registrationId, 3.0],
    ['solo3', solo3.registrationId, 1.0],
    ['duo leader', duoA.registrationId, 4.0],
    ['group leader', gA.registrationId, 12.0],
    ['org Alpha reg', orgA.registrationId, 0.5],
  ]

  for (const [label, regId, w] of weights) {
    const out = await postWeight(regId, w)
    if (!out.ok) console.error('FAIL weight', label, out.status, out.data)
    else console.log('OK weight', label, w, 'lb')
  }

  console.log('--- Peso solo organización (sin QR participante) ---')
  const ow = await postOrgWeight(eventId, 'QA Org Beta E2E', 15.0)
  if (!ow.ok) console.error('FAIL org-weight', ow.status, ow.data)
  else console.log('OK org-weight QA Org Beta E2E', 15, 'lb')

  console.log('--- GET stats ---')
  const st = await fetch(`${API}/events/${eventId}/stats`)
  const body = await st.text()
  console.log('HTTP', st.status, body.slice(0, 1200))
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

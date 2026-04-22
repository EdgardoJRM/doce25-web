#!/usr/bin/env node
/**
 * One-off: POST /events/{eventId}/survey/send for Piñones (o cualquier evento).
 *
 * Requiere un ID token de Cognito de un usuario admin (mismo que el panel /admin).
 *
 * Uso:
 *   export COGNITO_ID_TOKEN="eyJ..."
 *   export NEXT_PUBLIC_API_ENDPOINT="https://xxxxx.execute-api.us-east-1.amazonaws.com/prod"
 *   node scripts/send-survey-pinones.mjs
 *
 * Opcional: EVENT_ID=ea44d757-de19-4a13-aa9f-afbf0da433f2 (default Piñones)
 */

const API = process.env.NEXT_PUBLIC_API_ENDPOINT || process.env.API_ENDPOINT
const EVENT_ID =
  process.env.EVENT_ID || 'ea44d757-de19-4a13-aa9f-afbf0da433f2'
const TOKEN = process.env.COGNITO_ID_TOKEN

if (!API || !TOKEN) {
  console.error('Faltan NEXT_PUBLIC_API_ENDPOINT (o API_ENDPOINT) y/o COGNITO_ID_TOKEN')
  process.exit(1)
}

const url = `${API.replace(/\/$/, '')}/events/${EVENT_ID}/survey/send`
const res = await fetch(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${TOKEN}`,
  },
  body: '{}',
})

const text = await res.text()
console.log(res.status, text)
if (!res.ok) process.exit(1)

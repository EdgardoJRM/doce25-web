#!/usr/bin/env node
/**
 * Envía certificados de labor comunitaria personalizados (PDF adjunto) a todos
 * los participantes que hicieron check-in Y recogieron al menos 0.01 lb en el
 * evento de Playa Aviones.
 *
 * Uso:
 *   node scripts/send-certificates-bulk.js
 *   DRY_RUN=1 node scripts/send-certificates-bulk.js          # lista sin enviar
 *   TO_OVERRIDE=tu@email.com node scripts/send-certificates-bulk.js  # prueba
 *   LIMIT=5 node scripts/send-certificates-bulk.js            # solo primeros N
 *
 * Requiere en .env.local:
 *   AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION
 *   SES_FROM_EMAIL   (default: doce25@precotracks.org)
 *   REGISTRATIONS_TABLE (default: Dosce25-Registrations)
 *   WEIGHT_RECORDS_TABLE (default: Dosce25-WeightRecords)
 *   EVENT_ID         (default: ea44d757-de19-4a13-aa9f-afbf0da433f2 — Playa Aviones)
 */

const path = require('path')
const fs   = require('fs')
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') })

const { DynamoDBClient }                             = require('@aws-sdk/client-dynamodb')
const { DynamoDBDocumentClient, QueryCommand }       = require('@aws-sdk/lib-dynamodb')
const { SESClient, SendRawEmailCommand }             = require('@aws-sdk/client-ses')
const { PDFDocument, rgb, StandardFonts }            = require('pdf-lib')

// ── Configuración ─────────────────────────────────────────────────────────────
const REGION      = process.env.AWS_REGION             || 'us-east-1'
const REG_TABLE   = process.env.REGISTRATIONS_TABLE    || 'Dosce25-Registrations'
const WR_TABLE    = process.env.WEIGHT_RECORDS_TABLE   || 'Dosce25-WeightRecords'
const EVENT_ID    = process.env.EVENT_ID               || 'ea44d757-de19-4a13-aa9f-afbf0da433f2'
const FROM_EMAIL  = process.env.SES_FROM_EMAIL         || 'doce25@precotracks.org'
const DRY         = process.env.DRY_RUN === '1'
const TO_OVERRIDE = process.env.TO_OVERRIDE || null
const LIMIT       = process.env.LIMIT ? parseInt(process.env.LIMIT, 10) : null
const DELAY_MS    = 200   // pausa entre envíos para no throttlear SES

const SUBJECT         = '🌊 Tu Certificado de Labor Comunitaria – Doce25'
const TEMPLATE_PATH   = path.join(__dirname, '..', 'public', 'email-templates', 'certificado-labor.html')
const BASE_PDF_PATH   = path.join(__dirname, '..', 'public', 'Certificado Labor Comunitaria Playa Aviones.pdf')

// Nombre en PDF: mantener alineado con lib/certificatePdfLayout.ts (solo texto; la firma manuscrita es solo en /perfil).
const NAME_X  = 245
const NAME_Y  = 457.1
const NAME_FONT_SIZE = 11

const dynamo = DynamoDBDocumentClient.from(new DynamoDBClient({ region: REGION }))
const ses    = new SESClient({ region: REGION })

/** Mismo criterio que lib/formatCertificateName.ts — nombre en el PDF del certificado */
function formatCertificateName(raw) {
  const collapsed = String(raw || '').trim().replace(/\s+/g, ' ')
  if (!collapsed) return collapsed
  return collapsed
    .split(/\s+/)
    .map((part) => {
      if (!part) return part
      const lower = part.toLocaleLowerCase('es-PR')
      return lower.charAt(0).toLocaleUpperCase('es-PR') + lower.slice(1)
    })
    .join(' ')
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function htmlToText(html) {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function firstName(reg) {
  const raw = (reg.fullName || reg.name || '').trim()
  return raw.split(/\s+/)[0] || raw
}

function fullName(reg) {
  return (reg.fullName || reg.name || '').trim()
}

function participationLabel(type) {
  const map = {
    individual:   'Individual',
    duo:          'Dúo',
    group:        'Grupo',
    organization: 'Organización',
  }
  return map[type] || 'Individual'
}

/** Páginas de DynamoDB con paginación automática */
async function queryAll(params) {
  const items = []
  let lastKey
  do {
    const res = await dynamo.send(new QueryCommand({ ...params, ExclusiveStartKey: lastKey }))
    items.push(...(res.Items || []))
    lastKey = res.LastEvaluatedKey
  } while (lastKey)
  return items
}

/** Todos los registros del evento */
async function getAllRegistrations() {
  return queryAll({
    TableName: TABLE_NAME_WORKAROUND_REG(),
    IndexName: 'EventIdIndex',
    KeyConditionExpression: 'eventId = :eid',
    ExpressionAttributeValues: { ':eid': EVENT_ID },
  })
}
// tabla como función para evitar hoisting antes del require
function TABLE_NAME_WORKAROUND_REG() { return REG_TABLE }

/** Weight records de un grupo */
async function getGroupWeightRecords(groupId) {
  return queryAll({
    TableName: WR_TABLE,
    IndexName: 'GroupIndex',
    KeyConditionExpression: 'groupId = :gid',
    ExpressionAttributeValues: { ':gid': groupId },
  })
}

/** Weight records de un registro individual */
async function getRegistrationWeightRecords(registrationId) {
  return queryAll({
    TableName: WR_TABLE,
    IndexName: 'RegistrationIndex',
    KeyConditionExpression: 'registrationId = :rid',
    ExpressionAttributeValues: { ':rid': registrationId },
  })
}

/** Suma peso de un array de weight records */
function sumWeightRecords(records) {
  return records.reduce((acc, r) => acc + (parseFloat(r.weightCollected) || 0), 0)
}

/** Desglose por tipo de basura */
function aggregateTrashBreakdown(records) {
  const bd = { plastic: 0, metal: 0, glass: 0, organic: 0, other: 0 }
  for (const r of records) {
    if (r.trashBreakdown && typeof r.trashBreakdown === 'object') {
      for (const [k, v] of Object.entries(r.trashBreakdown)) {
        if (k in bd) bd[k] += parseFloat(v) || 0
      }
    }
  }
  return bd
}

/** Genera el bloque HTML de grupo/org */
function buildGroupSection(reg, groupTotalLbs, groupMembers) {
  const orgName = reg.eventOrganization || reg.organization || reg.otherOrganization || ''
  const label   = participationLabel(reg.participationType)

  if (!orgName && !groupMembers) return ''

  let membersHtml = ''
  if (groupMembers && groupMembers.length > 0) {
    const rows = groupMembers.map(m =>
      `<tr><td style="padding:6px 0;font-size:14px;color:#374151;border-bottom:1px solid #e2e8f0;">${m.name}</td>` +
      `<td style="padding:6px 0;font-size:14px;color:#374151;border-bottom:1px solid #e2e8f0;text-align:right;">${(parseFloat(m.weight) || 0).toFixed(1)} lbs</td></tr>`
    ).join('')
    membersHtml = `
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:12px;">
        <tr>
          <th style="padding:0 0 6px;font-size:12px;color:#6b7280;text-align:left;font-weight:600;">Miembro</th>
          <th style="padding:0 0 6px;font-size:12px;color:#6b7280;text-align:right;font-weight:600;">Aportación</th>
        </tr>
        ${rows}
      </table>`
  }

  return `
  <tr>
    <td style="padding:0 32px 28px;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
        <tr>
          <td style="background:#fdf4ff;border-left:4px solid #9333ea;border-radius:0 10px 10px 0;padding:20px 24px;">
            <p style="margin:0 0 4px 0;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#7e22ce;">Tu ${label}</p>
            ${orgName ? `<p style="margin:0 0 10px 0;font-size:17px;font-weight:700;color:#0f172a;">${orgName}</p>` : ''}
            <p style="margin:0;font-size:22px;font-weight:800;color:#0f172a;line-height:1;">
              ${groupTotalLbs.toFixed(1)} <span style="font-size:14px;font-weight:600;color:#4b5563;">lbs totales del ${label.toLowerCase()}</span>
            </p>
            ${membersHtml}
          </td>
        </tr>
      </table>
    </td>
  </tr>`
}

/** Genera el bloque HTML de desglose de basura */
function buildTrashSection(bd) {
  const entries = [
    { key: 'plastic',  label: 'Plástico',   emoji: '🧴' },
    { key: 'metal',    label: 'Metal',       emoji: '🥫' },
    { key: 'glass',    label: 'Vidrio',      emoji: '🍶' },
    { key: 'organic',  label: 'Orgánico',    emoji: '🍂' },
    { key: 'other',    label: 'Otro',        emoji: '🗑️' },
  ].filter(e => bd[e.key] > 0)

  if (entries.length === 0) return ''

  const rows = entries.map(e =>
    `<tr>
      <td style="padding:6px 0;font-size:14px;color:#374151;border-bottom:1px solid #e2e8f0;">${e.emoji} ${e.label}</td>
      <td style="padding:6px 0;font-size:14px;color:#374151;border-bottom:1px solid #e2e8f0;text-align:right;">${bd[e.key].toFixed(1)} lbs</td>
    </tr>`
  ).join('')

  return `
  <tr>
    <td style="padding:0 32px 28px;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
        <tr>
          <td style="background:#f8fafc;border-left:4px solid #64748b;border-radius:0 10px 10px 0;padding:18px 24px;">
            <p style="margin:0 0 12px 0;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#475569;">Desglose por tipo de basura</p>
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
              ${rows}
            </table>
          </td>
        </tr>
      </table>
    </td>
  </tr>`
}

/**
 * Genera un PDF personalizado overlay: carga el PDF base y escribe
 * el nombre completo del participante sobre la línea en blanco.
 */
async function generateCertificatePDF(participantFullName) {
  const nameOnPdf = formatCertificateName(participantFullName)
  const basePdfBytes = fs.readFileSync(BASE_PDF_PATH)
  const pdfDoc  = await PDFDocument.load(basePdfBytes)
  const pages   = pdfDoc.getPages()
  const page    = pages[0]

  const font = await pdfDoc.embedFont(StandardFonts.TimesRomanBold)

  page.drawText(nameOnPdf, {
    x:    NAME_X,
    y:    NAME_Y,
    size: NAME_FONT_SIZE,
    font,
    color: rgb(0.039, 0.039, 0.059),
  })

  const pdfBytes = await pdfDoc.save()
  return Buffer.from(pdfBytes)
}

/** Envía el email con el PDF adjunto vía SES SendRawEmailCommand */
async function sendEmail(toEmail, htmlBody, pdfBuffer, recipientName) {
  const textBody   = htmlToText(htmlBody)
  const boundary   = `----Doce25Cert_${Date.now()}_${Math.random().toString(36).slice(2)}`
  const boundaryAlt = `----Doce25CertAlt_${Date.now()}_${Math.random().toString(36).slice(2)}`
  const safeFile = formatCertificateName(recipientName).replace(/\s+/g, '-')
  const pdfName    = `Certificado-Labor-Comunitaria-${safeFile}.pdf`

  const lines = [
    `From: Doce25 <${FROM_EMAIL}>`,
    `Reply-To: info@doce25.org`,
    `To: ${toEmail}`,
    `Subject: ${SUBJECT}`,
    `MIME-Version: 1.0`,
    `Content-Type: multipart/mixed; boundary="${boundary}"`,
    ``,
    `--${boundary}`,
    `Content-Type: multipart/alternative; boundary="${boundaryAlt}"`,
    ``,
    `--${boundaryAlt}`,
    `Content-Type: text/plain; charset=UTF-8`,
    `Content-Transfer-Encoding: 7bit`,
    ``,
    textBody,
    ``,
    `--${boundaryAlt}`,
    `Content-Type: text/html; charset=UTF-8`,
    `Content-Transfer-Encoding: 7bit`,
    ``,
    htmlBody,
    ``,
    `--${boundaryAlt}--`,
    ``,
    `--${boundary}`,
    `Content-Type: application/pdf; name="${pdfName}"`,
    `Content-Transfer-Encoding: base64`,
    `Content-Disposition: attachment; filename="${pdfName}"`,
    ``,
    pdfBuffer.toString('base64'),
    ``,
    `--${boundary}--`,
  ]

  await ses.send(new SendRawEmailCommand({
    RawMessage: { Data: Buffer.from(lines.join('\r\n')) },
  }))
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log(DRY ? '[DRY RUN] Sin envíos reales.' : 'Iniciando envío de certificados...')
  console.log(`Evento: ${EVENT_ID}`)
  if (TO_OVERRIDE) console.log(`→ Override destinatario: ${TO_OVERRIDE}`)
  if (LIMIT)       console.log(`→ Límite: ${LIMIT} envíos`)
  console.log('')

  // 1. Cargar template HTML
  const templateHtml = fs.readFileSync(TEMPLATE_PATH, 'utf8')

  // 2. Obtener todos los registros del evento
  const all = await getAllRegistrations()
  console.log(`Total registros en evento: ${all.length}`)

  const checkedInWithEmail = all.filter(r => r.checkedIn && r.email && r.email.trim())

  // 3a. Con peso propio
  const withOwnWeight = checkedInWithEmail.filter(r =>
    r.weightCollected && parseFloat(r.weightCollected) >= 0.01
  )

  // 3b. Orgs/grupos que tienen al menos un miembro con peso
  const orgsWithWeight = new Set(
    withOwnWeight
      .filter(r => r.participationType === 'organization' && (r.eventOrganization || r.organization))
      .map(r => (r.eventOrganization || r.organization).trim().toLowerCase())
  )
  const groupsWithWeight = new Set(
    withOwnWeight
      .filter(r => (r.participationType === 'duo' || r.participationType === 'group') && r.groupId)
      .map(r => r.groupId)
  )

  // 3c. Miembros sin peso propio pero su org/grupo sí tiene
  const orgMembersNoWeight = checkedInWithEmail.filter(r =>
    r.participationType === 'organization' &&
    (!r.weightCollected || parseFloat(r.weightCollected) < 0.01) &&
    (r.eventOrganization || r.organization) &&
    orgsWithWeight.has((r.eventOrganization || r.organization).trim().toLowerCase())
  )
  const groupMembersNoWeight = checkedInWithEmail.filter(r =>
    (r.participationType === 'duo' || r.participationType === 'group') &&
    (!r.weightCollected || parseFloat(r.weightCollected) < 0.01) &&
    r.groupId && groupsWithWeight.has(r.groupId)
  )

  // 3d. Lista final sin duplicados
  const eligibleMap = new Map()
  for (const r of [...withOwnWeight, ...orgMembersNoWeight, ...groupMembersNoWeight]) {
    eligibleMap.set(r.registrationId, r)
  }
  let eligible = [...eligibleMap.values()]

  console.log(`  Con peso propio:                     ${withOwnWeight.length}`)
  console.log(`  Miembros de org sin peso (org sí):   ${orgMembersNoWeight.length}`)
  console.log(`  Miembros de grupo sin peso (grp sí): ${groupMembersNoWeight.length}`)
  console.log(`Total elegibles:                       ${eligible.length}`)

  // 4. Ranking global por peso individual (desc) — solo los que tienen peso propio
  const sorted = [...withOwnWeight].sort((a, b) =>
    (parseFloat(b.weightCollected) || 0) - (parseFloat(a.weightCollected) || 0)
  )
  const rankMap = new Map()
  sorted.forEach((r, i) => rankMap.set(r.registrationId, i + 1))
  // Los sin peso propio no tienen ranking individual
  const totalRanked = sorted.length

  // 5. Si hay TO_OVERRIDE, buscar ese registro (o usar el primero)
  if (TO_OVERRIDE) {
    const match = eligible.find(r => r.email.trim().toLowerCase() === TO_OVERRIDE.toLowerCase())
    if (match) {
      console.log(`✅ Registro encontrado para ${TO_OVERRIDE}: ${fullName(match)}`)
      eligible = [match]
    } else {
      console.log(`⚠️  No hay registro con email ${TO_OVERRIDE} — usando el primero de la lista`)
      eligible = eligible.slice(0, 1)
    }
  } else if (LIMIT) {
    eligible = eligible.slice(0, LIMIT)
  }

  const basePdfExists = fs.existsSync(BASE_PDF_PATH)
  if (!basePdfExists) {
    console.error(`❌ No se encontró el PDF base: ${BASE_PDF_PATH}`)
    process.exit(1)
  }

  let sent = 0, skipped = 0, failed = 0

  for (const reg of eligible) {
    const toEmail  = reg.email.trim()
    const fName    = firstName(reg)
    const fNameFull = fullName(reg)
    const weightLbs  = parseFloat(reg.weightCollected) || 0
    const hasOwnWeight = weightLbs >= 0.01
    const rank       = rankMap.get(reg.registrationId) || null
    const pType      = reg.participationType || 'individual'
    const pLabel     = participationLabel(pType)

    console.log(`  → ${toEmail} (${fNameFull}) | ${weightLbs} lbs | ${rank ? '#'+rank : 'sin ranking'} | ${pLabel}`)

    if (DRY) { skipped++; continue }

    try {
      // 6. Stats de grupo/org
      let groupTotalLbs    = weightLbs
      let groupMembersList = null
      let trashBd          = {}

      if (pType === 'duo' || pType === 'group') {
        if (reg.groupId) {
          const groupRecords = await getGroupWeightRecords(reg.groupId)
          groupTotalLbs = sumWeightRecords(groupRecords)
          trashBd = aggregateTrashBreakdown(groupRecords)

          // Buscar todos los miembros del grupo (líder + miembros)
          const leader = all.find(r => r.registrationId === reg.groupLeaderId)
          const memberIds = leader ? (leader.groupMembers || []) : (reg.groupMembers || [])
          const allMemberIds = [...new Set([reg.groupLeaderId, ...memberIds].filter(Boolean))]
          if (allMemberIds.length > 0) {
            groupMembersList = allMemberIds.map(mId => {
              const m = all.find(r => r.registrationId === mId)
              return m ? { name: fullName(m), weight: parseFloat(m.weightCollected) || 0 } : null
            }).filter(Boolean)
          }
        }
      } else if (pType === 'organization') {
        // Calcular total de la org sumando todos los miembros con peso
        const orgKey = (reg.eventOrganization || reg.organization || '').trim().toLowerCase()
        const orgMembers = all.filter(r =>
          r.participationType === 'organization' &&
          (r.eventOrganization || r.organization || '').trim().toLowerCase() === orgKey &&
          r.weightCollected && parseFloat(r.weightCollected) >= 0.01
        )
        groupTotalLbs = orgMembers.reduce((acc, r) => acc + (parseFloat(r.weightCollected) || 0), 0)
        if (hasOwnWeight) {
          const personalRecords = await getRegistrationWeightRecords(reg.registrationId)
          trashBd = aggregateTrashBreakdown(personalRecords)
        }
      } else {
        if (hasOwnWeight) {
          const personalRecords = await getRegistrationWeightRecords(reg.registrationId)
          trashBd = aggregateTrashBreakdown(personalRecords)
        }
      }

      // 7. Construir secciones HTML
      const groupSection = (pType !== 'individual')
        ? buildGroupSection(reg, groupTotalLbs, groupMembersList)
        : ''
      const trashSection = buildTrashSection(trashBd)

      // 8. Ranking: solo para los que tienen peso propio
      const rankingSection = rank ? `
  <tr>
    <td style="padding:0 32px 28px;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
        <tr>
          <td style="background:#eff6ff;border-left:4px solid #3b82f6;border-radius:0 10px 10px 0;padding:20px 24px;">
            <p style="margin:0 0 4px 0;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#1d4ed8;">Ranking global</p>
            <p style="margin:0 0 6px 0;font-size:26px;font-weight:800;color:#0f172a;line-height:1;">
              #${rank} <span style="font-size:14px;font-weight:500;color:#6b7280;">de ${totalRanked} participantes</span>
            </p>
            <p style="margin:0;font-size:13px;color:#374151;">Basado en libras recolectadas individualmente</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>` : ''

      // 9. Sección de peso (diferente si tiene peso propio o no)
      const weightSection = hasOwnWeight ? `
  <tr>
    <td style="padding:0 32px 28px;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
        <tr>
          <td style="background:#f0fdf4;border-left:4px solid #16a34a;border-radius:0 10px 10px 0;padding:20px 24px;">
            <p style="margin:0 0 4px 0;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#15803d;">Tu aportación</p>
            <p style="margin:0 0 14px 0;font-size:28px;font-weight:800;color:#0f172a;line-height:1;">
              ${weightLbs.toFixed(1)} <span style="font-size:15px;font-weight:600;color:#4b5563;">lbs de basura</span>
            </p>
            <p style="margin:0;font-size:14px;color:#374151;line-height:1.5;">
              Participación: <strong>${pLabel}</strong>
            </p>
          </td>
        </tr>
      </table>
    </td>
  </tr>` : `
  <tr>
    <td style="padding:0 32px 28px;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
        <tr>
          <td style="background:#f0fdf4;border-left:4px solid #16a34a;border-radius:0 10px 10px 0;padding:20px 24px;">
            <p style="margin:0 0 4px 0;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#15803d;">Tu aportación</p>
            <p style="margin:0 0 10px 0;font-size:16px;font-weight:700;color:#0f172a;">
              Participación en ${pLabel}
            </p>
            <p style="margin:0;font-size:14px;color:#374151;line-height:1.5;">
              Tu ${pLabel.toLowerCase()} contribuyó al total recolectado en el evento.
            </p>
          </td>
        </tr>
      </table>
    </td>
  </tr>`

      // 10. Personalizar HTML
      let html = templateHtml
        .replace(/\{\{FIRST_NAME\}\}/g,         fName)
        .replace(/\{\{FULL_NAME\}\}/g,           fNameFull)
        .replace(/\{\{PARTICIPATION_TYPE\}\}/g,   pLabel)
        .replace(/\{\{WEIGHT_SECTION\}\}/g,       weightSection)
        .replace(/\{\{RANKING_SECTION\}\}/g,      rankingSection)
        .replace(/\{\{GROUP_SECTION\}\}/g,        groupSection)
        .replace(/\{\{TRASH_SECTION\}\}/g,        trashSection)

      // 9. Generar PDF personalizado
      const pdfBuffer = await generateCertificatePDF(fNameFull)

      // 10. Enviar
      await sendEmail(toEmail, html, pdfBuffer, fNameFull)
      sent++
      console.log(`     ✅ Enviado`)
    } catch (err) {
      console.error(`     ❌ Error: ${err.message}`)
      failed++
    }

    await new Promise(r => setTimeout(r, DELAY_MS))
  }

  console.log('')
  console.log(`Listo. Enviados: ${sent} | Saltados (dry): ${skipped} | Fallidos: ${failed}`)
}

main().catch(e => { console.error(e); process.exit(1) })

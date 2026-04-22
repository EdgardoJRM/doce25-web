import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, QueryCommand, GetCommand } from '@aws-sdk/lib-dynamodb'
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import { requireCognitoAdmin, corsHeaders } from './requireCognitoAdmin'

const doc = DynamoDBDocumentClient.from(new DynamoDBClient({}))
const s3 = new S3Client({})

const REGISTRATIONS_TABLE = process.env.REGISTRATIONS_TABLE || 'Dosce25-Registrations'
const WEIGHT_RECORDS_TABLE = process.env.WEIGHT_RECORDS_TABLE || 'Dosce25-WeightRecords'
const EVENTS_TABLE = process.env.EVENTS_TABLE || 'Dosce25-Events'
const SURVEY_RESPONSES_TABLE = process.env.SURVEY_RESPONSES_TABLE || 'Dosce25-SurveyResponses'
const SURVEY_INVITATIONS_TABLE = process.env.SURVEY_INVITATIONS_TABLE || 'Dosce25-SurveyInvitations'
const REPORTS_BUCKET = process.env.REPORTS_BUCKET || ''

async function queryAll<T>(table: string, index: string, keyCond: string, vals: Record<string, unknown>): Promise<T[]> {
  const out: T[] = []
  let sk: Record<string, unknown> | undefined
  do {
    const res = await doc.send(
      new QueryCommand({
        TableName: table,
        IndexName: index,
        KeyConditionExpression: keyCond,
        ExpressionAttributeValues: vals,
        ExclusiveStartKey: sk,
      })
    )
    out.push(...((res.Items || []) as T[]))
    sk = res.LastEvaluatedKey
  } while (sk)
  return out
}

function tally(map: Record<string, number>, key: string | undefined, delta = 1) {
  const k = key?.trim() || '(sin dato)'
  map[k] = (map[k] || 0) + delta
}

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' }
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: corsHeaders, body: JSON.stringify({ message: 'Method not allowed' }) }
  }

  const admin = await requireCognitoAdmin(event)
  if (!admin.ok) return admin.response

  const eventId = event.pathParameters?.eventId
  if (!eventId) {
    return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ message: 'eventId requerido' }) }
  }

  if (!REPORTS_BUCKET) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ message: 'REPORTS_BUCKET no configurado' }),
    }
  }

  try {
    const evRes = await doc.send(new GetCommand({ TableName: EVENTS_TABLE, Key: { eventId } }))
    const ev = evRes.Item as Record<string, unknown> | undefined
    if (!ev) {
      return { statusCode: 404, headers: corsHeaders, body: JSON.stringify({ message: 'Evento no encontrado' }) }
    }

    const registrations = await queryAll<Record<string, unknown>>(
      REGISTRATIONS_TABLE,
      'EventIdIndex',
      'eventId = :e',
      { ':e': eventId }
    )

    const weightRecords = await queryAll<Record<string, unknown>>(
      WEIGHT_RECORDS_TABLE,
      'EventIndex',
      'eventId = :e',
      { ':e': eventId }
    )

    const weightByRegistrationId: Record<string, number> = {}
    const weightByGroupId: Record<string, number> = {}
    for (const wr of weightRecords) {
      const w = Number(wr.weightCollected) || 0
      if (wr.registrationId) {
        weightByRegistrationId[String(wr.registrationId)] =
          (weightByRegistrationId[String(wr.registrationId)] || 0) + w
      } else if (wr.groupId) {
        weightByGroupId[String(wr.groupId)] = (weightByGroupId[String(wr.groupId)] || 0) + w
      }
    }

    const enriched = registrations.map((r) => {
      const rid = String(r.registrationId)
      const byReg = weightByRegistrationId[rid] || 0
      const byGroup = r.groupId ? weightByGroupId[String(r.groupId)] || 0 : 0
      const totalW = byReg > 0 ? byReg : byGroup
      return {
        ...r,
        weightCollected: Math.round(totalW * 100) / 100,
      }
    })

    const checkedIn = enriched.filter((r) => r.checkedIn === true)
    const withWeight = enriched.filter((r) => (r.weightCollected as number) > 0)
    const totalWeight = withWeight.reduce((s, r) => s + (r.weightCollected as number), 0)

    const byAgeAll: Record<string, number> = {}
    const byGenderAll: Record<string, number> = {}
    const byCity: Record<string, number> = {}
    const weightByAge: Record<string, number> = {}
    const byAgeWithWeight: Record<string, number> = {}

    for (const r of checkedIn) {
      tally(byAgeAll, r.ageRange as string | undefined)
      tally(byGenderAll, r.gender as string | undefined)
      tally(byCity, r.city as string | undefined)
    }

    for (const r of withWeight) {
      tally(byAgeWithWeight, r.ageRange as string | undefined)
      tally(weightByAge, r.ageRange as string | undefined, r.weightCollected as number)
    }

    const surveyResponses = await queryAll<{
      wouldRecommend?: boolean
      organizationRating?: number
      satisfactionRating?: number
      comments?: string
      respondedAt?: string
    }>(SURVEY_RESPONSES_TABLE, 'EventIdIndex', 'eventId = :e', { ':e': eventId })

    const invitations = await queryAll<{ sentAt?: string }>(
      SURVEY_INVITATIONS_TABLE,
      'EventIdIndex',
      'eventId = :e',
      { ':e': eventId }
    )

    const nResp = surveyResponses.length
    const recommends = surveyResponses.filter((r) => r.wouldRecommend === true).length
    const recommendPct = nResp > 0 ? Math.round((recommends / nResp) * 1000) / 10 : 0
    const orgSum = surveyResponses.reduce((s, r) => s + (r.organizationRating || 0), 0)
    const satSum = surveyResponses.reduce((s, r) => s + (r.satisfactionRating || 0), 0)
    const avgOrg = nResp > 0 ? Math.round((orgSum / nResp) * 100) / 100 : 0
    const avgSat = nResp > 0 ? Math.round((satSum / nResp) * 100) / 100 : 0
    const comments = surveyResponses
      .filter((r) => (r.comments || '').trim())
      .sort((a, b) => (b.respondedAt || '').localeCompare(a.respondedAt || ''))
      .slice(0, 5)
      .map((r) => (r.comments || '').trim())

    const pdfDoc = await PDFDocument.create()
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
    const primary = rgb(0.02, 0.4, 0.55)
    const textMuted = rgb(0.25, 0.3, 0.35)

    const margin = 50
    let page = pdfDoc.addPage([595.28, 841.89])
    let y = 800

    const drawHeading = (t: string, size = 14) => {
      if (y < 100) {
        page = pdfDoc.addPage([595.28, 841.89])
        y = 800
      }
      page.drawText(t, { x: margin, y, size, font: fontBold, color: primary })
      y -= size + 10
    }

    const drawP = (t: string, size = 10) => {
      const maxW = 495
      const words = t.split(/\s+/)
      let line = ''
      for (const w of words) {
        const test = line ? `${line} ${w}` : w
        const width = font.widthOfTextAtSize(test, size)
        if (width > maxW && line) {
          if (y < 50) {
            page = pdfDoc.addPage([595.28, 841.89])
            y = 800
          }
          page.drawText(line, { x: margin, y, size, font, color: textMuted })
          y -= size + 4
          line = w
        } else {
          line = test
        }
      }
      if (line) {
        if (y < 50) {
          page = pdfDoc.addPage([595.28, 841.89])
          y = 800
        }
        page.drawText(line, { x: margin, y, size, font, color: textMuted })
        y -= size + 6
      }
    }

    const eventName = String(ev.name || 'Evento Doce25')
    const eventDate = String(ev.date || ev.dateTime || '')
    const location = String(ev.location || '')
    const presidentMsg = (ev.reportPresidentMessage as string) || ''
    const conclusion = (ev.reportConclusion as string) || ''

    page.drawText('DOCE25', { x: margin, y, size: 10, font, color: textMuted })
    y -= 14
    page.drawText('Reporte de evento', { x: margin, y, size: 22, font: fontBold, color: primary })
    y -= 28
    page.drawText(eventName, { x: margin, y, size: 16, font: fontBold, color: rgb(0.1, 0.1, 0.12) })
    y -= 22
    drawP(`Fecha: ${eventDate}   ·   Lugar: ${location}`)
    y -= 8

    drawHeading('Resumen')
    drawP(
      `Participantes con check-in: ${checkedIn.length}. Registros totales: ${enriched.length}. ` +
        `Peso total recolectado (estimado por registros): ${Math.round(totalWeight * 10) / 10} lbs. ` +
        `Personas con al menos un registro de peso: ${withWeight.length}.`
    )
    y -= 6

    if (presidentMsg) {
      drawHeading('Mensaje')
      drawP(presidentMsg)
      y -= 6
    }

    drawHeading('Demografía (check-in)')
    const ageRows = Object.entries(byAgeAll)
      .sort((a, b) => b[1] - a[1])
      .map(([k, v]) => `${k}: ${v}`)
    drawP(ageRows.length ? ageRows.join(' · ') : 'Sin datos')
    const genRows = Object.entries(byGenderAll)
      .sort((a, b) => b[1] - a[1])
      .map(([k, v]) => `${k}: ${v}`)
    drawP(`Género — ${genRows.length ? genRows.join(' · ') : 'Sin datos'}`)
    y -= 4

    drawHeading('Demografía (con peso registrado)')
    const ageW = Object.entries(byAgeWithWeight)
      .sort((a, b) => b[1] - a[1])
      .map(([k, v]) => `${k}: ${v}`)
    drawP(ageW.length ? ageW.join(' · ') : 'Sin datos')
    const wByAge = Object.entries(weightByAge)
      .sort((a, b) => b[1] - a[1])
      .map(([k, v]) => `${k}: ${Math.round(v * 10) / 10} lbs`)
    drawP(`Libras por rango de edad: ${wByAge.length ? wByAge.join(' · ') : '—'}`)
    y -= 6

    drawHeading('Encuesta post-evento')
    drawP(
      `Invitaciones enviadas (registros): ${invitations.length}. Respuestas: ${nResp}. ` +
        `Recomendarían el evento: ${recommendPct}%. ` +
        `Organización (promedio 1–5): ${avgOrg}. Satisfacción (promedio 1–10): ${avgSat}.`
    )
    if (comments.length) {
      drawHeading('Comentarios (muestra)')
      comments.forEach((c) => {
        drawP(`• ${c}`)
      })
    }
    y -= 6

    if (conclusion) {
      drawHeading('Conclusión y próximos pasos')
      drawP(conclusion)
    }

    const pdfBytes = await pdfDoc.save()
    const key = `reports/${eventId}/${Date.now()}-reporte.pdf`

    await s3.send(
      new PutObjectCommand({
        Bucket: REPORTS_BUCKET,
        Key: key,
        Body: Buffer.from(pdfBytes),
        ContentType: 'application/pdf',
      })
    )

    const downloadUrl = await getSignedUrl(
      s3,
      new GetObjectCommand({ Bucket: REPORTS_BUCKET, Key: key }),
      { expiresIn: 3600 }
    )

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        eventId,
        key,
        downloadUrl,
        expiresInSeconds: 3600,
      }),
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error(err)
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ message: 'Error al generar PDF', error: msg }),
    }
  }
}

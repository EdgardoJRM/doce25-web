'use server'

import { PutCommand } from '@aws-sdk/lib-dynamodb'
import { redirect } from 'next/navigation'
import { dynamoClient, TABLES } from '@/lib/dynamodb'
import { sendEmail } from '@/lib/ses'
import { webinarContent, WEBINAR_SLUG } from '@/app/webinar/content'

export type WebinarFormState = {
  error?: string
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(formData: FormData): string | null {
  const fullName = String(formData.get('fullName') || '').trim()
  const email = String(formData.get('email') || '').trim().toLowerCase()
  const company = String(formData.get('company') || '').trim()
  const role = String(formData.get('role') || '').trim()
  const consent = formData.get('consent') === 'on'

  if (!fullName || fullName.length < 2) {
    return 'Indica tu nombre completo.'
  }
  if (!email || !EMAIL_RE.test(email)) {
    return 'Indica un correo electrónico válido.'
  }
  if (!company || company.length < 2) {
    return 'Indica el nombre de tu empresa u organización.'
  }
  if (!role || role.length < 2) {
    return 'Indica tu rol o cargo.'
  }
  if (!consent) {
    return 'Debes aceptar recibir comunicación relacionada con este webinar para continuar.'
  }
  return null
}

function firstNameFromFull(fullName: string): string {
  const part = fullName.trim().split(/\s+/)[0]
  return part || 'equipo'
}

function interestLabel(value: string): string {
  const opt = webinarContent.interestOptions.find((o) => o.value === value)
  return opt?.label || value || '—'
}

export async function registerForWebinar(
  _prev: WebinarFormState,
  formData: FormData
): Promise<WebinarFormState> {
  const validationError = validate(formData)
  if (validationError) {
    return { error: validationError }
  }

  const fullName = String(formData.get('fullName') || '').trim()
  const email = String(formData.get('email') || '').trim().toLowerCase()
  const company = String(formData.get('company') || '').trim()
  const role = String(formData.get('role') || '').trim()
  const interest = String(formData.get('interest') || '').trim()

  const internalTo =
    process.env.WEBINAR_INTERNAL_NOTIFICATION_EMAIL || 'info@doce25.org'
  const site = process.env.NEXT_PUBLIC_SITE_URL || 'https://doce25.precotracks.org'

  const participantSubject = 'Confirmación: tu registro al webinar de Doce25'
  const participantHtml = `
<!DOCTYPE html>
<html><body style="font-family:system-ui,sans-serif;line-height:1.5;color:#0f172a;max-width:560px;">
  <p>Hola ${escapeHtml(fullName.split(/\s+/)[0])},</p>
  <p>Recibimos tu registro para el webinar de Doce25.</p>
  <p><strong>${escapeHtml(webinarContent.hero.headline)}</strong><br/>
  ${escapeHtml(webinarContent.event.dateDisplay)} · ${escapeHtml(webinarContent.event.modality)}</p>
  <p>Te enviaremos el enlace para unirte en vivo antes del evento (revisa también spam/promociones).</p>
  <p style="margin-top:24px;font-size:14px;color:#64748b;">Doce25 · Puerto Rico<br/>
  <a href="${site}">${site}</a></p>
</body></html>`
  const participantText = [
    `Hola ${fullName.split(/\s+/)[0]},`,
    '',
    'Recibimos tu registro para el webinar de Doce25.',
    '',
    webinarContent.hero.headline,
    `${webinarContent.event.dateDisplay} · ${webinarContent.event.modality}`,
    '',
    'Te enviaremos el enlace para unirte en vivo antes del evento.',
    '',
    `Doce25 · ${site}`,
  ].join('\n')

  const internalSubject = `[Webinar] Nuevo registro: ${company} — ${email}`
  const internalHtml = `
<!DOCTYPE html>
<html><body style="font-family:system-ui,sans-serif;line-height:1.5;color:#0f172a;">
  <h2 style="font-size:16px;">Nuevo registro webinar</h2>
  <table style="border-collapse:collapse;font-size:14px;">
    <tr><td style="padding:4px 12px 4px 0;font-weight:600;">Nombre</td><td>${escapeHtml(fullName)}</td></tr>
    <tr><td style="padding:4px 12px 4px 0;font-weight:600;">Email</td><td>${escapeHtml(email)}</td></tr>
    <tr><td style="padding:4px 12px 4px 0;font-weight:600;">Empresa</td><td>${escapeHtml(company)}</td></tr>
    <tr><td style="padding:4px 12px 4px 0;font-weight:600;">Rol</td><td>${escapeHtml(role)}</td></tr>
    <tr><td style="padding:4px 12px 4px 0;font-weight:600;">Interés</td><td>${escapeHtml(interestLabel(interest))}</td></tr>
    <tr><td style="padding:4px 12px 4px 0;font-weight:600;">Webinar</td><td>${escapeHtml(WEBINAR_SLUG)}</td></tr>
  </table>
</body></html>`
  const internalText = [
    'Nuevo registro webinar',
    `Nombre: ${fullName}`,
    `Email: ${email}`,
    `Empresa: ${company}`,
    `Rol: ${role}`,
    `Interés: ${interestLabel(interest)}`,
    `Webinar slug: ${WEBINAR_SLUG}`,
  ].join('\n')

  try {
    await dynamoClient.send(
      new PutCommand({
        TableName: TABLES.WEBINAR_REGISTRATIONS,
        Item: {
          email,
          webinarSlug: WEBINAR_SLUG,
          fullName,
          company,
          role,
          interest: interest || '',
          consentMarketing: true,
          createdAt: new Date().toISOString(),
          webinarTitle: webinarContent.hero.headline,
        },
      })
    )

    await sendEmail({
      to: email,
      subject: participantSubject.replace('…', ''),
      htmlBody: participantHtml,
      textBody: participantText,
    })

    await sendEmail({
      to: internalTo,
      subject: internalSubject,
      htmlBody: internalHtml,
      textBody: internalText,
    })
  } catch (e) {
    console.error('[webinar register]', e)
    return {
      error:
        'No pudimos completar el registro en este momento. Intenta de nuevo en unos minutos o escríbenos a info@doce25.org.',
    }
  }

  const first = firstNameFromFull(fullName)
  redirect(
    `/webinar/gracias?n=${encodeURIComponent(first)}&registered=1`
  )
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

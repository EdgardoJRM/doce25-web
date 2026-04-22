/** HTML + text for SES survey invitation (post-event satisfaction). */

export function buildSurveyInviteEmail(opts: {
  participantFirstName: string
  eventName: string
  surveyUrl: string
}) {
  const { participantFirstName, eventName, surveyUrl } = opts
  const safeName = participantFirstName || 'Participante'
  const subject = `Tu opinión sobre ${eventName} — Doce25`

  const text = `Hola ${safeName},

Gracias por participar en ${eventName}. Tu feedback nos ayuda a mejorar futuras limpiezas.

Responde esta breve encuesta (menos de 1 minuto):
${surveyUrl}

— Equipo Doce25
Fundación Tortuga Club PR`

  const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f8fafc;padding:24px 12px;">
    <tr><td align="center">
      <table role="presentation" width="100%" style="max-width:560px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(15,23,42,.08);">
        <tr><td style="background:linear-gradient(135deg,#0ea5e9 0%,#0369a1 100%);padding:28px 24px;">
          <p style="margin:0;color:#e0f2fe;font-size:14px;">Doce25</p>
          <h1 style="margin:8px 0 0;color:#ffffff;font-size:22px;line-height:1.3;">Tu opinión importa</h1>
        </td></tr>
        <tr><td style="padding:28px 24px;color:#334155;font-size:16px;line-height:1.6;">
          <p style="margin:0 0 16px;">Hola <strong>${escapeHtml(safeName)}</strong>,</p>
          <p style="margin:0 0 16px;">Gracias por participar en <strong>${escapeHtml(eventName)}</strong>. Tu feedback nos ayuda a mejorar futuras limpiezas de costas.</p>
          <p style="margin:0 0 24px;">Solo te tomará un minuto.</p>
          <table role="presentation" cellspacing="0" cellpadding="0"><tr><td style="border-radius:9999px;background:linear-gradient(90deg,#f97316,#ea580c);">
            <a href="${surveyUrl}" style="display:inline-block;padding:14px 28px;color:#ffffff;font-weight:700;text-decoration:none;font-size:16px;">Responder encuesta</a>
          </td></tr></table>
          <p style="margin:24px 0 0;font-size:13px;color:#64748b;">Si el botón no funciona, copia y pega este enlace en tu navegador:<br/>
          <a href="${surveyUrl}" style="color:#0284c7;word-break:break-all;">${surveyUrl}</a></p>
        </td></tr>
        <tr><td style="padding:16px 24px;background:#f1f5f9;font-size:12px;color:#64748b;">
          Fundación Tortuga Club PR · Doce25
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`

  return { subject, text, html }
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

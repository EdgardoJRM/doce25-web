'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/auth'
import {
  getEventById,
  updateEvent,
  getEventSurveyStats,
  sendEventSurveyEmails,
  generateEventReportPdf,
} from '@/lib/api'

export default function EventoReportePage() {
  const params = useParams()
  const router = useRouter()
  const eventId = params.eventId as string
  const { token, loading: authLoading } = useAuth()

  const [loading, setLoading] = useState(true)
  const [eventName, setEventName] = useState('')
  const [reportPresidentMessage, setReportPresidentMessage] = useState('')
  const [reportConclusion, setReportConclusion] = useState('')
  const [saving, setSaving] = useState(false)
  const [sending, setSending] = useState(false)
  const [statsLoading, setStatsLoading] = useState(false)
  const [stats, setStats] = useState<{
    totalSent: number
    totalResponded: number
    responseRate: number
    recommendPercent: number
    avgOrganization: number
    avgSatisfaction: number
  } | null>(null)
  const [pdfLoading, setPdfLoading] = useState(false)
  const [lastPdfUrl, setLastPdfUrl] = useState<string | null>(null)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    if (authLoading) return
    if (!token) return
    ;(async () => {
      try {
        const data = await getEventById(eventId)
        const ev = data.event || data
        setEventName(ev.name || '')
        setReportPresidentMessage(ev.reportPresidentMessage || '')
        setReportConclusion(ev.reportConclusion || '')
      } catch {
        setMsg('No se pudo cargar el evento')
      } finally {
        setLoading(false)
      }
    })()
  }, [eventId, token, authLoading])

  const handleSaveTexts = async () => {
    if (!token) return
    setSaving(true)
    setMsg('')
    try {
      await updateEvent(eventId, {
        reportPresidentMessage,
        reportConclusion,
      })
      setMsg('Textos guardados.')
    } catch (e: unknown) {
      setMsg(e instanceof Error ? e.message : 'Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  const handleSendSurvey = async () => {
    if (!token) return
    if (!confirm('¿Enviar correo de encuesta a todos los participantes con check-in que aún no tengan invitación?')) return
    setSending(true)
    setMsg('')
    try {
      const res = await sendEventSurveyEmails(eventId, token)
      setMsg(
        `Enviados: ${res.emailsSentThisRun}. Nuevas invitaciones: ${res.invitationsNewlyCreated}. ` +
          `Omitidos (ya tenían invitación): ${res.skippedAlreadyHadInvitation}.`
      )
    } catch (e: unknown) {
      setMsg(e instanceof Error ? e.message : 'Error al enviar')
    } finally {
      setSending(false)
    }
  }

  const handleLoadStats = async () => {
    if (!token) return
    setStatsLoading(true)
    try {
      const s = await getEventSurveyStats(eventId, token)
      setStats({
        totalSent: s.totalSent,
        totalResponded: s.totalResponded,
        responseRate: s.responseRate,
        recommendPercent: s.recommendPercent,
        avgOrganization: s.avgOrganization,
        avgSatisfaction: s.avgSatisfaction,
      })
    } catch (e: unknown) {
      setMsg(e instanceof Error ? e.message : 'Error al cargar estadísticas')
    } finally {
      setStatsLoading(false)
    }
  }

  const handlePdf = async () => {
    if (!token) return
    setPdfLoading(true)
    setLastPdfUrl(null)
    try {
      const res = await generateEventReportPdf(eventId, token)
      setLastPdfUrl(res.downloadUrl)
      setMsg('PDF generado. El enlace expira en ~1 hora.')
    } catch (e: unknown) {
      setMsg(e instanceof Error ? e.message : 'Error al generar PDF')
    } finally {
      setPdfLoading(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center text-slate-600">Cargando…</div>
    )
  }

  if (!token) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-3xl">
      <button
        type="button"
        onClick={() => router.back()}
        className="text-slate-600 hover:text-slate-900 mb-4"
      >
        ← Volver
      </button>
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Reporte y encuesta</h1>
      <p className="text-slate-600 mb-6">{eventName}</p>

      {msg && (
        <div className="mb-4 p-3 rounded-lg bg-blue-50 border border-blue-100 text-sm text-blue-900">{msg}</div>
      )}

      <div className="space-y-6">
        <section className="bg-white rounded-xl shadow border border-slate-100 p-6">
          <h2 className="font-bold text-slate-900 mb-3">Textos del PDF</h2>
          <label className="block text-sm text-slate-600 mb-1">Mensaje / introducción (opcional)</label>
          <textarea
            className="w-full border rounded-lg p-3 text-sm min-h-[100px] mb-4"
            value={reportPresidentMessage}
            onChange={(e) => setReportPresidentMessage(e.target.value)}
            placeholder="Mensaje para la portada o sección inicial del reporte…"
          />
          <label className="block text-sm text-slate-600 mb-1">Conclusión y próximos pasos (opcional)</label>
          <textarea
            className="w-full border rounded-lg p-3 text-sm min-h-[100px] mb-4"
            value={reportConclusion}
            onChange={(e) => setReportConclusion(e.target.value)}
          />
          <button
            type="button"
            onClick={handleSaveTexts}
            disabled={saving}
            className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50"
          >
            {saving ? 'Guardando…' : 'Guardar textos'}
          </button>
        </section>

        <section className="bg-white rounded-xl shadow border border-slate-100 p-6">
          <h2 className="font-bold text-slate-900 mb-2">Encuesta por correo</h2>
          <p className="text-sm text-slate-600 mb-4">
            Envía un enlace único a cada participante con check-in (SES). Quien ya tenga invitación en la base de datos no recibe duplicado.
          </p>
          <button
            type="button"
            onClick={handleSendSurvey}
            disabled={sending}
            className="bg-cyan-600 text-white px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50"
          >
            {sending ? 'Enviando…' : 'Enviar encuestas por email'}
          </button>
        </section>

        <section className="bg-white rounded-xl shadow border border-slate-100 p-6">
          <h2 className="font-bold text-slate-900 mb-2">Estadísticas de satisfacción</h2>
          <button
            type="button"
            onClick={handleLoadStats}
            disabled={statsLoading}
            className="mb-4 bg-slate-100 text-slate-800 px-4 py-2 rounded-lg text-sm font-semibold"
          >
            {statsLoading ? 'Cargando…' : 'Cargar estadísticas'}
          </button>
          {stats && (
            <ul className="text-sm text-slate-700 space-y-1">
              <li>Invitaciones registradas: {stats.totalSent}</li>
              <li>Respuestas: {stats.totalResponded}</li>
              <li>Tasa de respuesta: {stats.responseRate}%</li>
              <li>Recomendarían el evento: {stats.recommendPercent}%</li>
              <li>Organización (promedio 1–5): {stats.avgOrganization}</li>
              <li>Satisfacción (promedio 1–10): {stats.avgSatisfaction}</li>
            </ul>
          )}
        </section>

        <section className="bg-white rounded-xl shadow border border-slate-100 p-6">
          <h2 className="font-bold text-slate-900 mb-2">Generar PDF del reporte</h2>
          <p className="text-sm text-slate-600 mb-4">
            Incluye demografía, peso y resultados de encuesta (si hay respuestas). El enlace de descarga es temporal.
          </p>
          <button
            type="button"
            onClick={handlePdf}
            disabled={pdfLoading}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50"
          >
            {pdfLoading ? 'Generando…' : 'Generar PDF'}
          </button>
          {lastPdfUrl && (
            <p className="mt-4">
              <a
                href={lastPdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-700 font-semibold underline"
              >
                Descargar PDF
              </a>
            </p>
          )}
        </section>
      </div>

      <p className="mt-8 text-sm">
        <Link href={`/admin/eventos/${eventId}/manage`} className="text-cyan-700 hover:underline">
          Volver a gestión del evento
        </Link>
      </p>
    </div>
  )
}

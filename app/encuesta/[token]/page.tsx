'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { getSurveyInvitation, submitSurveyResponse } from '@/lib/api'

type LoadState = 'loading' | 'ready' | 'done' | 'error'

export default function EncuestaPage() {
  const params = useParams()
  const token = (params?.token as string) || ''

  const [load, setLoad] = useState<LoadState>('loading')
  const [err, setErr] = useState('')
  const [eventName, setEventName] = useState('')
  const [firstName, setFirstName] = useState('')
  const [eventDate, setEventDate] = useState('')
  const [alreadyAnswered, setAlreadyAnswered] = useState(false)

  const [wouldRecommend, setWouldRecommend] = useState<boolean | null>(null)
  const [organizationRating, setOrganizationRating] = useState(4)
  const [satisfactionRating, setSatisfactionRating] = useState(9)
  const [comments, setComments] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!token) {
      setLoad('error')
      setErr('Enlace inválido')
      return
    }
    ;(async () => {
      try {
        const data = await getSurveyInvitation(token)
        setEventName(data.eventName)
        setFirstName(data.firstName)
        setEventDate(data.eventDate)
        setAlreadyAnswered(data.alreadyAnswered)
        setLoad(data.alreadyAnswered ? 'done' : 'ready')
      } catch (e: unknown) {
        setErr(e instanceof Error ? e.message : 'No se pudo cargar la encuesta')
        setLoad('error')
      }
    })()
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (wouldRecommend === null) {
      alert('Indica si recomendarías el evento.')
      return
    }
    setSubmitting(true)
    try {
      await submitSurveyResponse(token, {
        wouldRecommend,
        organizationRating,
        satisfactionRating,
        comments: comments.trim() || undefined,
      })
      setLoad('done')
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Error al enviar')
    } finally {
      setSubmitting(false)
    }
  }

  const dateLabel = eventDate
    ? new Date(eventDate).toLocaleDateString('es-PR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : ''

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="relative min-h-[220px] md:min-h-[260px] flex flex-col justify-end overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/doce25-hero-main.jpg"
            alt=""
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/35 to-black/55" />
        </div>
        <div className="relative z-10 container mx-auto px-4 py-10 text-center text-white">
          <p className="text-sm text-white/90 mb-2">Doce25</p>
          <h1 className="text-2xl md:text-3xl font-bold mb-3 drop-shadow-md">
            Tu opinión sobre la limpieza
          </h1>
          <p className="text-lg font-semibold text-cyan-100">{eventName || '…'}</p>
          {load === 'ready' || load === 'loading' ? (
            <p className="mt-4 text-sm md:text-base text-white/95 max-w-2xl mx-auto">
              Hola <span className="font-bold">{firstName || 'Participante'}</span>
              {dateLabel ? (
                <>
                  , gracias por unirte el {dateLabel}. Tu feedback nos ayuda a mejorar.
                </>
              ) : (
                <>. Gracias por participar. Tu feedback nos ayuda a mejorar.</>
              )}
            </p>
          ) : null}
        </div>
      </section>

      <div className="container mx-auto px-4 py-8 md:py-10 max-w-[1200px]">
        {load === 'loading' && (
          <div className="text-center text-slate-600 py-16">Cargando encuesta…</div>
        )}

        {load === 'error' && (
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-2xl p-6 text-center space-y-3">
            <p className="font-medium">{err}</p>
            {err.includes('NEXT_PUBLIC_API_ENDPOINT') ? (
              <p className="text-sm text-red-700/90">
                Sin esa variable, la página no puede hablar con el API de encuestas. Configúrala en Amplify y
                redeploy del frontend.
              </p>
            ) : null}
            {err.includes('Encuesta no encontrada') || err.includes('404') ? (
              <p className="text-sm text-red-700/90">
                El enlace debe ser el completo que viene en el correo (incluye un token largo). Si ya
                respondiste, verás el mensaje de gracias.
              </p>
            ) : null}
          </div>
        )}

        {load === 'done' && (
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-10 text-center">
            <div className="text-4xl mb-4">✓</div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">
              {alreadyAnswered ? 'Ya recibimos tu respuesta' : '¡Gracias!'}
            </h2>
            <p className="text-slate-600">
              {alreadyAnswered
                ? 'Tu opinión ya estaba registrada. Si necesitas algo, escríbenos.'
                : 'Tu opinión fue registrada. ¡Nos vemos en la próxima limpieza!'}
            </p>
          </div>
        )}

        {load === 'ready' && (
          <form onSubmit={handleSubmit}>
            <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
                {/* 01 */}
                <div className="p-6 flex flex-col min-h-[200px]">
                  <p className="text-xs font-bold text-cyan-700 uppercase tracking-wide mb-2">
                    01 — Recomendación
                  </p>
                  <p className="text-sm text-slate-700 mb-4 flex-1">
                    ¿Recomendarías este evento a otra persona?
                  </p>
                  <div className="flex gap-3 justify-center">
                    <button
                      type="button"
                      onClick={() => setWouldRecommend(true)}
                      className={`flex-1 py-3 rounded-full font-bold transition-all ${
                        wouldRecommend === true
                          ? 'bg-cyan-700 text-white shadow-lg ring-2 ring-cyan-500'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      Sí
                    </button>
                    <button
                      type="button"
                      onClick={() => setWouldRecommend(false)}
                      className={`flex-1 py-3 rounded-full font-bold transition-all ${
                        wouldRecommend === false
                          ? 'bg-slate-800 text-white shadow-lg'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      No
                    </button>
                  </div>
                </div>

                {/* 02 */}
                <div className="p-6 flex flex-col min-h-[200px]">
                  <p className="text-xs font-bold text-cyan-700 uppercase tracking-wide mb-2">
                    02 — Organización
                  </p>
                  <p className="text-sm text-slate-700 mb-4 flex-1">
                    ¿Cómo calificas la organización del evento?
                  </p>
                  <div className="flex justify-center gap-1 flex-wrap">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setOrganizationRating(n)}
                        className={`text-2xl p-1 rounded transition-transform hover:scale-110 ${
                          n <= organizationRating ? 'opacity-100' : 'opacity-25'
                        }`}
                        aria-label={`${n} estrellas`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                  <p className="text-center text-xs text-slate-500 mt-2">
                    {organizationRating} de 5 estrellas
                  </p>
                </div>

                {/* 03 */}
                <div className="p-6 flex flex-col min-h-[200px]">
                  <p className="text-xs font-bold text-cyan-700 uppercase tracking-wide mb-2">
                    03 — Satisfacción
                  </p>
                  <p className="text-sm text-slate-700 mb-4 flex-1">
                    ¿Qué tan satisfecho estás en general? (1–10)
                  </p>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={satisfactionRating}
                    onChange={(e) => setSatisfactionRating(Number(e.target.value))}
                    className="w-full accent-cyan-600 h-3"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 px-0.5 mt-1">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                      <span key={n}>{n}</span>
                    ))}
                  </div>
                  <p className="text-center text-sm font-bold text-cyan-800 mt-2">{satisfactionRating}</p>
                </div>

                {/* 04 */}
                <div className="p-6 flex flex-col min-h-[200px]">
                  <p className="text-xs font-bold text-cyan-700 uppercase tracking-wide mb-2">
                    04 — Comentarios
                  </p>
                  <p className="text-sm text-slate-700 mb-2">Opcional</p>
                  <textarea
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    placeholder="¿Qué podemos mejorar?"
                    rows={5}
                    className="w-full flex-1 min-h-[100px] rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="p-6 bg-slate-50 border-t border-slate-100">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 rounded-full font-bold text-lg text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg disabled:opacity-60 transition-all"
                >
                  {submitting ? 'Enviando…' : 'Enviar mi feedback'}
                </button>
                <p className="text-center text-xs text-slate-500 mt-3">
                  Solo te tomará 30 segundos. Ya casi terminas.
                </p>
              </div>
            </div>
          </form>
        )}

        <p className="text-center text-xs text-slate-400 mt-10">
          Doce25 · Limpieza de costas de Puerto Rico
        </p>
      </div>
    </div>
  )
}

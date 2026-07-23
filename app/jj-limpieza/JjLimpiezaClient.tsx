'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { EventRegistrationForm } from '@/components/EventRegistrationForm'
import { getEventBySlug } from '@/lib/api'
import { JJ_EVENT_SLUG, jjLimpiezaContent as c } from './content'

interface EventRecord {
  eventId: string
  name: string
  capacity?: number
  status?: string
}

export function JjLimpiezaClient() {
  const router = useRouter()
  const [event, setEvent] = useState<EventRecord | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const data = await getEventBySlug(JJ_EVENT_SLUG)
        if (!cancelled) setEvent(data)
      } catch (err: unknown) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : 'No pudimos cargar el registro. Intenta de nuevo más tarde.'
          )
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const openForm = () => {
    if (!event) return
    setShowForm(true)
  }

  return (
    <>
      {/* Hero — full-bleed, brand first */}
      <section className="relative isolate min-h-[70vh] overflow-hidden text-white">
        <Image
          src="/images/doce25-hero-main.jpg"
          alt="Limpieza de playa Doce25"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-950/85 via-teal-900/75 to-slate-900/70" />
        <div className="relative mx-auto flex min-h-[70vh] max-w-5xl flex-col justify-end px-4 pb-16 pt-28 sm:pb-20">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-100/90">
            {c.hero.brand}
          </p>
          <h1 className="max-w-3xl font-display text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">
            {c.hero.headline}
          </h1>
          <p className="mt-5 max-w-2xl text-base text-cyan-50/95 sm:text-lg">
            {c.hero.subheadline}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={openForm}
              disabled={!event || loading}
              className="cursor-pointer rounded-lg bg-white px-6 py-3 text-sm font-bold text-cyan-900 shadow-lg transition hover:bg-cyan-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {c.hero.cta}
            </button>
            <p className="text-sm text-cyan-100/80">{c.event.dateLabel} · Loíza</p>
          </div>
        </div>
      </section>

      {/* Detalles */}
      <section className="border-b border-cyan-900/5 bg-white py-16">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="font-display text-3xl font-bold text-slate-900 sm:text-4xl">
            Detalles del evento
          </h2>
          <p className="mt-3 max-w-2xl text-slate-600">{c.privateNote}</p>

          <dl className="mt-10 grid gap-6 sm:grid-cols-2">
            {[
              ['Fecha', c.event.dateLabel],
              ['Hora', c.event.timeLabel],
              ['Lugar', c.event.location],
              ['Modalidad', c.event.modality],
              ['Cupos', c.event.capacityLabel],
              ['Organizado por', c.event.organizers],
            ].map(([label, value]) => (
              <div key={label} className="border-l-2 border-cyan-600 pl-4">
                <dt className="text-xs font-semibold uppercase tracking-wider text-cyan-800">
                  {label}
                </dt>
                <dd className="mt-1 text-base font-medium text-slate-800">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Descripción */}
      <section className="bg-[#eef8f9] py-16">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="font-display text-3xl font-bold text-slate-900">La experiencia</h2>
          <div className="mt-6 max-w-3xl space-y-4 text-slate-700 leading-relaxed">
            {c.description.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      {/* Incluye */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="font-display text-3xl font-bold text-slate-900">
            La experiencia incluirá
          </h2>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {c.includes.map((item) => (
              <li
                key={item}
                className="flex gap-3 text-slate-700"
              >
                <span
                  className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-teal-600"
                  aria-hidden
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Recomendaciones */}
      <section className="bg-slate-900 py-14 text-white">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">
            Recomendaciones para participantes
          </h2>
          <p className="mt-4 max-w-3xl text-slate-200 leading-relaxed">{c.recommendations}</p>
        </div>
      </section>

      {/* Registro */}
      <section id="registro" className="scroll-mt-24 bg-gradient-to-b from-cyan-50 to-white py-16">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="font-display text-3xl font-bold text-slate-900 sm:text-4xl">
            Registro
          </h2>
          <p className="mt-3 text-slate-600">
            Cupos limitados a {c.event.capacity} participantes. Al registrarte recibirás tu entrada
            con código QR por correo.
          </p>

          {loading && (
            <div className="mt-10">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-cyan-600 border-t-transparent" />
              <p className="mt-3 text-sm text-slate-500">Cargando formulario…</p>
            </div>
          )}

          {!loading && error && (
            <div className="mt-8 rounded-lg border border-amber-200 bg-amber-50 px-4 py-4 text-left text-amber-900">
              <p className="font-semibold">Registro no disponible todavía</p>
              <p className="mt-1 text-sm">{error}</p>
              <p className="mt-2 text-sm text-amber-800/80">
                Si el problema continúa, contacta al equipo de Doce25.
              </p>
            </div>
          )}

          {!loading && event && (
            <div className="mt-8">
              <button
                type="button"
                onClick={openForm}
                className="cursor-pointer rounded-lg bg-cyan-700 px-8 py-3.5 text-base font-bold text-white shadow-md transition hover:bg-cyan-800"
              >
                {c.hero.cta}
              </button>
              <p className="mt-3 text-xs text-slate-500">
                Empleados de Johnson &amp; Johnson · Capacidad {event.capacity || c.event.capacity}
              </p>
            </div>
          )}
        </div>
      </section>

      {showForm && event && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
          <div className="relative my-8 w-full max-w-3xl rounded-xl bg-white p-6 shadow-2xl sm:p-8">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="absolute right-4 top-4 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-2xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              aria-label="Cerrar"
            >
              ×
            </button>
            <h2 className="pr-12 text-2xl font-bold text-slate-900">Registro: {c.event.name}</h2>
            <p className="mb-6 mt-1 text-sm text-slate-600">
              Organización: {c.event.organizationFixed}. Completa tus datos y el relevo de
              responsabilidad.
            </p>
            <EventRegistrationForm
              eventId={event.eventId}
              fixedOrganization={c.event.organizationFixed}
              onSuccess={(email) => {
                setShowForm(false)
                router.push(
                  `/registro-exitoso?event=${encodeURIComponent(c.event.name)}&email=${encodeURIComponent(email)}`
                )
              }}
            />
          </div>
        </div>
      )}
    </>
  )
}

'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { registerForWebinar, type WebinarFormState } from '@/app/webinar/actions'
import { webinarContent } from '@/app/webinar/content'

const initialState: WebinarFormState = {}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-xl bg-cyan-400 py-3.5 text-base font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:min-w-[220px] sm:px-10"
    >
      {pending ? 'Enviando…' : webinarContent.cta.label}
    </button>
  )
}

export function Registro() {
  const [state, formAction] = useFormState(registerForWebinar, initialState)

  return (
    <section id="registro" className="scroll-mt-24 border-b border-white/10 py-20 md:py-24">
      <div className="mx-auto max-w-5xl px-4">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
          <div>
            <h2 className="font-display text-3xl font-semibold tracking-tight text-white md:text-4xl">
              {webinarContent.cta.headline}
            </h2>
            <p className="mt-4 text-slate-400 leading-relaxed">{webinarContent.cta.subheadline}</p>
            <ul className="mt-8 space-y-3 text-sm text-slate-500">
              <li className="flex gap-2">
                <span className="text-cyan-400">→</span>
                {webinarContent.event.modality}
              </li>
              <li className="flex gap-2">
                <span className="text-cyan-400">→</span>
                {webinarContent.event.dateDisplay}
              </li>
              <li className="flex gap-2">
                <span className="text-cyan-400">→</span>
                {webinarContent.event.price} · {webinarContent.event.capacity}
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
            <form action={formAction} className="space-y-5">
              {state?.error && (
                <div
                  role="alert"
                  className="rounded-lg border border-red-500/40 bg-red-950/40 px-4 py-3 text-sm text-red-200"
                >
                  {state.error}
                </div>
              )}

              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-slate-300">
                  Nombre completo <span className="text-red-400">*</span>
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  required
                  className="mt-1.5 w-full rounded-lg border border-white/10 bg-slate-900/80 px-4 py-2.5 text-white placeholder:text-slate-600 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/40"
                  placeholder="Ej. María Rodríguez"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-300">
                  Correo corporativo <span className="text-red-400">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="mt-1.5 w-full rounded-lg border border-white/10 bg-slate-900/80 px-4 py-2.5 text-white placeholder:text-slate-600 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/40"
                  placeholder="tu.nombre@empresa.com"
                />
              </div>

              <div>
                <label htmlFor="company" className="block text-sm font-medium text-slate-300">
                  Empresa u organización <span className="text-red-400">*</span>
                </label>
                <input
                  id="company"
                  name="company"
                  type="text"
                  autoComplete="organization"
                  required
                  className="mt-1.5 w-full rounded-lg border border-white/10 bg-slate-900/80 px-4 py-2.5 text-white placeholder:text-slate-600 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/40"
                  placeholder="Nombre legal o marca"
                />
              </div>

              <div>
                <label htmlFor="role" className="block text-sm font-medium text-slate-300">
                  Rol o cargo <span className="text-red-400">*</span>
                </label>
                <input
                  id="role"
                  name="role"
                  type="text"
                  autoComplete="organization-title"
                  required
                  className="mt-1.5 w-full rounded-lg border border-white/10 bg-slate-900/80 px-4 py-2.5 text-white placeholder:text-slate-600 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/40"
                  placeholder="Ej. Director de People, CSR Lead…"
                />
              </div>

              <div>
                <label htmlFor="interest" className="block text-sm font-medium text-slate-300">
                  ¿Qué te interesa más? <span className="text-slate-500">(opcional)</span>
                </label>
                <select
                  id="interest"
                  name="interest"
                  className="mt-1.5 w-full rounded-lg border border-white/10 bg-slate-900/80 px-4 py-2.5 text-white focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/40"
                  defaultValue=""
                >
                  {webinarContent.interestOptions.map((o) => (
                    <option key={o.value || 'empty'} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>

              <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-white/10 bg-slate-900/40 p-4">
                <input
                  type="checkbox"
                  name="consent"
                  required
                  className="mt-1 h-4 w-4 rounded border-white/20 bg-slate-900 text-cyan-500 focus:ring-cyan-500/40"
                />
                <span className="text-sm text-slate-400 leading-relaxed">
                  Acepto recibir por correo la confirmación, recordatorios e información relacionada con este
                  webinar y con iniciativas corporativas de Doce25. Puedes darte de baja cuando quieras.
                </span>
              </label>

              <div className="pt-2">
                <SubmitButton />
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

import { webinarContent } from '@/app/webinar/content'

export function Autoridad() {
  const { autoridad } = webinarContent
  return (
    <section className="border-b border-white/10 py-20 md:py-24">
      <div className="mx-auto max-w-5xl px-4">
        <h2 className="font-display text-3xl font-semibold tracking-tight text-white md:text-4xl">
          {autoridad.headline}
        </h2>
        <p className="mt-4 max-w-2xl text-slate-400">{autoridad.subline}</p>
        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {autoridad.stats.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-8 text-center"
            >
              <p className="font-display text-4xl font-semibold text-cyan-400 md:text-5xl">{s.value}</p>
              <p className="mt-2 text-sm font-medium uppercase tracking-wide text-slate-500">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

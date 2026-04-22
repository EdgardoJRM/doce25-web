import Link from 'next/link'
import { webinarContent } from '@/app/webinar/content'

export function Hero() {
  const { hero, event } = webinarContent
  return (
    <section className="relative overflow-hidden border-b border-white/10">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        aria-hidden
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(34, 211, 238, 0.25), transparent 55%)',
        }}
      />
      <div className="relative mx-auto max-w-5xl px-4 pb-20 pt-16 md:pb-28 md:pt-24">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400/90">
          {hero.eyebrow}
        </p>
        <h1 className="font-display text-4xl font-semibold leading-[1.08] tracking-tight text-white md:text-5xl lg:text-6xl animate-fade-in-up">
          {hero.headline}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-300 md:text-xl">
          {hero.subheadline}
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-400">
          <span>{event.modality}</span>
          <span className="hidden sm:inline text-slate-600">·</span>
          <span>{event.price}</span>
          <span className="hidden sm:inline text-slate-600">·</span>
          <span>{event.capacity}</span>
          <span className="hidden sm:inline text-slate-600">·</span>
          <span>{event.dateDisplay}</span>
        </div>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
          <Link
            href="#registro"
            className="inline-flex items-center justify-center rounded-xl bg-cyan-400 px-8 py-3.5 text-center text-base font-semibold text-slate-950 transition hover:bg-cyan-300"
          >
            {hero.ctaLabel}
          </Link>
          <p className="max-w-md text-sm text-slate-500">{hero.microcopy}</p>
        </div>
      </div>
    </section>
  )
}

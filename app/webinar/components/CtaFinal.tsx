import Link from 'next/link'
import { webinarContent } from '@/app/webinar/content'

export function CtaFinal() {
  const { cta } = webinarContent
  return (
    <section className="border-b border-white/10 py-20 md:py-24">
      <div className="mx-auto max-w-5xl px-4 text-center">
        <h2 className="font-display text-3xl font-semibold tracking-tight text-white md:text-4xl">
          {cta.headline}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-slate-400">{cta.subheadline}</p>
        <Link
          href="#registro"
          className="mt-10 inline-flex items-center justify-center rounded-xl bg-cyan-400 px-10 py-4 text-base font-semibold text-slate-950 transition hover:bg-cyan-300"
        >
          {cta.label}
        </Link>
      </div>
    </section>
  )
}

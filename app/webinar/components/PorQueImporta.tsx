import { webinarContent } from '@/app/webinar/content'

export function PorQueImporta() {
  const { porQueImporta } = webinarContent
  return (
    <section className="border-b border-white/10 py-20 md:py-24">
      <div className="mx-auto max-w-5xl px-4">
        <h2 className="font-display text-3xl font-semibold tracking-tight text-white md:text-4xl">
          {porQueImporta.headline}
        </h2>
        <div className="mt-8 max-w-3xl space-y-5 text-slate-300 leading-relaxed">
          {porQueImporta.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>
    </section>
  )
}

import { webinarContent } from '@/app/webinar/content'

export function ParaQuienEs() {
  const { paraQuienEs } = webinarContent
  return (
    <section className="border-b border-white/10 py-20 md:py-24">
      <div className="mx-auto max-w-5xl px-4">
        <h2 className="font-display text-3xl font-semibold tracking-tight text-white md:text-4xl">
          {paraQuienEs.headline}
        </h2>
        <p className="mt-4 max-w-2xl text-slate-400">{paraQuienEs.intro}</p>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {paraQuienEs.cards.map((card) => (
            <article
              key={card.title}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-cyan-500/30"
            >
              <h3 className="font-display text-lg font-semibold text-white">{card.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">{card.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

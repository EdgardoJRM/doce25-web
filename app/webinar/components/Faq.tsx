import { webinarContent } from '@/app/webinar/content'

export function Faq() {
  const { faq } = webinarContent
  return (
    <section className="py-20 md:py-24">
      <div className="mx-auto max-w-5xl px-4">
        <h2 className="font-display text-3xl font-semibold tracking-tight text-white md:text-4xl">
          Preguntas frecuentes
        </h2>
        <div className="mt-10 space-y-3">
          {faq.map((item) => (
            <details
              key={item.q}
              className="group rounded-xl border border-white/10 bg-white/[0.02] px-5 py-4 open:border-cyan-500/20"
            >
              <summary className="cursor-pointer list-none font-medium text-white [&::-webkit-details-marker]:hidden">
                <span className="flex items-center justify-between gap-4">
                  {item.q}
                  <span className="text-cyan-400 transition group-open:rotate-180">▼</span>
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

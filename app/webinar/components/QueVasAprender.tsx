import { webinarContent } from '@/app/webinar/content'

function CheckIcon() {
  return (
    <svg className="mt-0.5 h-5 w-5 shrink-0 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  )
}

export function QueVasAprender() {
  const { queVasAprender } = webinarContent
  return (
    <section className="border-b border-white/10 py-20 md:py-24">
      <div className="mx-auto max-w-5xl px-4">
        <h2 className="font-display text-3xl font-semibold tracking-tight text-white md:text-4xl">
          {queVasAprender.headline}
        </h2>
        <ul className="mt-10 space-y-4">
          {queVasAprender.bullets.map((item) => (
            <li key={item} className="flex gap-3 rounded-xl border border-white/5 bg-white/[0.02] px-4 py-4 md:px-5">
              <CheckIcon />
              <span className="text-slate-300 leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

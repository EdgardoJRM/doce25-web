import Image from 'next/image'
import { webinarContent } from '@/app/webinar/content'

export function LogosStrip() {
  const { logos } = webinarContent
  return (
    <section className="border-b border-white/10 py-16 md:py-20">
      <div className="mx-auto max-w-5xl px-4">
        <h2 className="text-center font-display text-2xl font-semibold tracking-tight text-white md:text-3xl">
          {logos.headline}
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-slate-500">
          Sustituye los placeholders por logos reales en <code className="text-cyan-400/80">content.ts</code>{' '}
          (rutas en <code className="text-cyan-400/80">/public</code>).
        </p>
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {logos.items.map((item) => (
            <div
              key={item.name}
              className="flex h-24 items-center justify-center rounded-xl border border-white/10 bg-white/[0.02] px-4"
            >
              {item.logoSrc ? (
                <Image
                  src={item.logoSrc}
                  alt={item.name}
                  width={140}
                  height={48}
                  className="max-h-10 w-auto object-contain opacity-90"
                />
              ) : (
                <span className="text-xs font-medium uppercase tracking-wider text-slate-600">
                  {item.name}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

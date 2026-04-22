import Image from 'next/image'
import { webinarContent } from '@/app/webinar/content'

export function Speaker() {
  const { speaker } = webinarContent
  const initials = speaker.name
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <section className="border-b border-white/10 py-20 md:py-24">
      <div className="mx-auto max-w-5xl px-4">
        <h2 className="font-display text-3xl font-semibold tracking-tight text-white md:text-4xl">
          Quién guía la conversación
        </h2>
        <div className="mt-10 flex flex-col gap-8 rounded-2xl border border-white/10 bg-white/[0.03] p-8 md:flex-row md:items-start md:p-10">
          {speaker.photoSrc ? (
            <div className="relative mx-auto h-32 w-32 shrink-0 overflow-hidden rounded-full border border-white/10 md:mx-0">
              <Image src={speaker.photoSrc} alt={speaker.name} fill className="object-cover" />
            </div>
          ) : (
            <div
              className="mx-auto flex h-32 w-32 shrink-0 items-center justify-center rounded-full border border-white/10 bg-slate-800 font-display text-2xl font-semibold text-cyan-400 md:mx-0"
              aria-hidden
            >
              {initials}
            </div>
          )}
          <div>
            <p className="font-display text-xl font-semibold text-white">{speaker.name}</p>
            <p className="mt-1 text-sm font-medium text-cyan-400/90">{speaker.role}</p>
            <p className="mt-4 text-slate-300 leading-relaxed">{speaker.bio}</p>
          </div>
        </div>
      </div>
    </section>
  )
}

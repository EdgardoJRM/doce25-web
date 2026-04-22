import type { Metadata } from 'next'
import Link from 'next/link'
import { webinarContent } from '@/app/webinar/content'
import { getSiteBaseUrl } from '@/lib/webinar-calendar'
import { AddToCalendar } from '@/app/webinar/gracias/AddToCalendar'
import { CopyShareLink } from '@/app/webinar/gracias/CopyShareLink'
import { WebinarConversionPixels } from '@/app/webinar/gracias/WebinarConversionPixels'

const base = getSiteBaseUrl()
const shareUrl = `${base}${webinarContent.meta.canonicalPath}`

export const metadata: Metadata = {
  title: 'Gracias por registrarte',
  description: 'Confirmación de registro al webinar de Doce25.',
  robots: { index: false, follow: false },
}

type Props = {
  searchParams: Record<string, string | string[] | undefined>
}

export default function WebinarThankYouPage({ searchParams }: Props) {
  const nRaw = searchParams.n
  const name = typeof nRaw === 'string' ? decodeURIComponent(nRaw) : 'equipo'
  const registered = searchParams.registered === '1'
  const linkedInShare = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
  const whatsappShare = `https://wa.me/?text=${encodeURIComponent(
    `Te invito a este webinar de Doce25 sobre experiencias ambientales corporativas: ${shareUrl}`
  )}`

  const { thankYou } = webinarContent

  return (
    <>
      <WebinarConversionPixels fire={registered} />
      <div className="mx-auto max-w-2xl px-4 py-16 md:py-24">
        <p className="text-sm font-medium uppercase tracking-widest text-cyan-400">Doce25</p>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-white md:text-4xl">
          {thankYou.headline}, {name}
        </h1>
        <p className="mt-4 text-slate-400">{thankYou.subline}</p>

        <ol className="mt-10 list-decimal space-y-4 pl-5 text-slate-300">
          {thankYou.steps.map((step) => (
            <li key={step} className="leading-relaxed">
              {step}
            </li>
          ))}
        </ol>

        <div className="mt-12">
          <h2 className="font-display text-lg font-semibold text-white">Añadir al calendario</h2>
          <p className="mt-2 text-sm text-slate-500">
            {webinarContent.event.dateDisplay} · {webinarContent.event.duration}
          </p>
          <div className="mt-4">
            <AddToCalendar />
          </div>
        </div>

        <div className="mt-12 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="font-display text-lg font-semibold text-white">Compartir con tu equipo</h2>
          <p className="mt-2 text-sm text-slate-400">
            Si esta conversación aplica a otra persona en cultura, CSR u operación, reenvíale el registro.
          </p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a
              href={whatsappShare}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              Compartir por WhatsApp
            </a>
            <a
              href={linkedInShare}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/[0.06] px-5 py-3 text-sm font-semibold text-white transition hover:border-cyan-500/40"
            >
              Compartir en LinkedIn
            </a>
            <CopyShareLink url={shareUrl} />
          </div>
        </div>

        <div className="mt-12 rounded-2xl border border-dashed border-white/15 bg-slate-900/40 p-6">
          <h2 className="font-display text-lg font-semibold text-white">{thankYou.resourceTitle}</h2>
          <p className="mt-2 text-sm text-slate-400">{thankYou.resourceBody}</p>
          {thankYou.resourceHref ? (
            <a
              href={thankYou.resourceHref}
              className="mt-4 inline-block text-sm font-semibold text-cyan-400 hover:text-cyan-300"
            >
              Descargar recurso →
            </a>
          ) : (
            <p className="mt-3 text-xs text-slate-600">
              {/* TODO: cuando tengas PDF/guía, define thankYou.resourceHref en content.ts */}
              Edita <code className="text-cyan-500/80">thankYou.resourceHref</code> en{' '}
              <code className="text-cyan-500/80">app/webinar/content.ts</code>.
            </p>
          )}
        </div>

        <p className="mt-12 text-center text-sm text-slate-500">
          <Link href="/webinar" className="text-cyan-400 hover:text-cyan-300">
            Volver al webinar
          </Link>
          {' · '}
          <Link href="/" className="text-cyan-400 hover:text-cyan-300">
            Ir al inicio
          </Link>
        </p>
      </div>
    </>
  )
}

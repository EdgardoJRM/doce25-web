import Image from 'next/image'
import Link from 'next/link'
import { WebinarFooter } from '@/app/webinar/components/WebinarFooter'

export default function WebinarLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-slate-950 font-inter text-slate-100 selection:bg-cyan-500/25">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4">
          <Link href="/webinar" className="flex items-center gap-3">
            <Image
              src="/doce25-logo.png"
              alt="Doce25"
              width={120}
              height={40}
              className="h-9 w-auto object-contain opacity-95"
              priority
            />
            <span className="hidden text-xs font-medium uppercase tracking-widest text-slate-500 sm:inline">
              Webinar
            </span>
          </Link>
          <Link
            href="/"
            className="text-sm text-slate-400 transition-colors hover:text-cyan-400"
          >
            Sitio principal
          </Link>
        </div>
      </header>
      {children}
      <WebinarFooter />
    </div>
  )
}

import Link from 'next/link'

export function WebinarFooter() {
  return (
    <footer className="border-t border-white/10 py-10 mt-16">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-4 text-center text-sm text-slate-500 sm:flex-row sm:text-left">
        <p>© {new Date().getFullYear()} Doce25 · Puerto Rico</p>
        <div className="flex flex-wrap justify-center gap-6">
          <Link href="/privacidad" className="hover:text-cyan-400 transition-colors">
            Privacidad
          </Link>
          <Link href="/contacto" className="hover:text-cyan-400 transition-colors">
            Contacto
          </Link>
          <Link href="/" className="hover:text-cyan-400 transition-colors">
            doce25.org
          </Link>
        </div>
      </div>
    </footer>
  )
}

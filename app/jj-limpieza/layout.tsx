import Image from 'next/image'
import Link from 'next/link'

export default function JjLimpiezaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#f4fafb] font-poppins text-slate-900">
      <header className="sticky top-0 z-40 border-b border-cyan-900/10 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4">
          <Link href="/jj-limpieza" className="flex min-w-0 items-center gap-3 sm:gap-4">
            <Image
              src="/doce25-logo.png"
              alt="Doce25"
              width={120}
              height={40}
              className="h-8 w-auto object-contain sm:h-9"
              priority
            />
            <span className="hidden h-6 w-px bg-slate-200 sm:block" aria-hidden />
            <Image
              src="/jj-limpieza/johnson-johnson-logo-red.png"
              alt="Johnson & Johnson"
              width={1006}
              height={100}
              className="h-5 w-auto object-contain sm:h-7"
              priority
            />
          </Link>
          <Link
            href="#registro"
            className="shrink-0 rounded-lg bg-cyan-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-800"
          >
            Registrarme
          </Link>
        </div>
      </header>
      {children}
      <footer className="border-t border-slate-200 bg-white py-10">
        <div className="mx-auto max-w-5xl px-4 text-center text-sm text-slate-500">
          <p>Organizado por Johnson &amp; Johnson Innovative Medicine, en colaboración con Doce25.</p>
          <p className="mt-2">Fundación Tortuga Club PR, Inc. · doce25.org</p>
        </div>
      </footer>
    </div>
  )
}

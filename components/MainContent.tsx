'use client'

import { usePathname } from 'next/navigation'

interface MainContentProps {
  children: React.ReactNode
}

export function MainContent({ children }: MainContentProps) {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith('/admin')
  const isWebinar = pathname.startsWith('/webinar')
  const isJjLimpieza = pathname.startsWith('/jj-limpieza')

  return (
    <main className={`min-h-screen ${isAdmin || isWebinar || isJjLimpieza ? '' : 'pt-16'}`}>
      {children}
    </main>
  )
}

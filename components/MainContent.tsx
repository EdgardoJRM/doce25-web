'use client'

import { usePathname } from 'next/navigation'

interface MainContentProps {
  children: React.ReactNode
}

export function MainContent({ children }: MainContentProps) {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith('/admin')

  return (
    <main className={`min-h-screen ${isAdmin ? '' : 'pt-16'}`}>
      {children}
    </main>
  )
}

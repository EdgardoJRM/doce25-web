import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Proyecto Playas Urbanas | Doce25',
  description: 'Proyecto de limpieza de playas urbanas en Puerto Rico. Enfocado en playas de fácil acceso cerca de áreas pobladas como San Juan, Loíza, y Luquillo. Eventos mensuales abiertos al público.',
  keywords: [
    'playas urbanas puerto rico',
    'limpieza playas san juan',
    'playas loíza',
    'balneario luquillo limpieza',
    'playas accesibles puerto rico',
    'voluntariado playas urbanas',
    'conservación costera urbana',
  ],
  openGraph: {
    title: 'Proyecto Playas Urbanas - Doce25',
    description: 'Limpiezas mensuales en playas urbanas de Puerto Rico. Eventos abiertos al público.',
    url: 'https://doce25.precotracks.org/proyectos/playas-urbanas',
    type: 'website',
  },
  alternates: {
    canonical: 'https://doce25.precotracks.org/proyectos/playas-urbanas',
  },
}

export default function PlayasUrbanasLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}


import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Proyecto Playas Remotas | Doce25',
  description: 'Proyecto de limpieza de playas remotas y de difícil acceso en Puerto Rico. Expediciones especiales a áreas protegidas, reservas naturales y costas vírgenes. Para voluntarios experimentados.',
  keywords: [
    'playas remotas puerto rico',
    'reservas naturales puerto rico',
    'playas vírgenes limpieza',
    'expediciones ambientales',
    'conservación áreas protegidas',
    'voluntariado avanzado',
    'costas inaccesibles puerto rico',
  ],
  openGraph: {
    title: 'Proyecto Playas Remotas - Doce25',
    description: 'Expediciones de limpieza a playas remotas y áreas protegidas de Puerto Rico.',
    url: 'https://doce25.precotracks.org/proyectos/playas-remotas',
    type: 'website',
  },
  alternates: {
    canonical: 'https://doce25.precotracks.org/proyectos/playas-remotas',
  },
}

export default function PlayasRemotasLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}


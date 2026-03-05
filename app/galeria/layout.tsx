import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Galería | Fotos de Limpiezas de Playa - Doce25',
  description: 'Galería de fotos de las limpiezas de playa realizadas por Doce25 en Puerto Rico. Imágenes de voluntarios, playas antes y después, y momentos especiales de nuestros eventos de conservación.',
  keywords: [
    'fotos limpieza playas puerto rico',
    'galería doce25',
    'voluntarios puerto rico fotos',
    'playas puerto rico antes después',
    'eventos ambientales fotos',
    'conservación marina imágenes',
  ],
  openGraph: {
    title: 'Galería de Fotos - Doce25 Puerto Rico',
    description: 'Mira las fotos de nuestras limpiezas de playa y eventos de conservación en Puerto Rico.',
    url: 'https://doce25.precotracks.org/galeria',
    type: 'website',
  },
  alternates: {
    canonical: 'https://doce25.precotracks.org/galeria',
  },
}

export default function GaleriaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}


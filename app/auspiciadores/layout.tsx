import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Auspiciadores y Patrocinadores | Doce25',
  description: 'Conoce a las empresas y organizaciones que apoyan la misión de Doce25. Patrocina nuestras limpiezas de playa y eventos de conservación en Puerto Rico. Beneficios para empresas auspiciadoras.',
  keywords: [
    'patrocinadores doce25',
    'auspiciadores ong puerto rico',
    'responsabilidad social empresarial',
    'patrocinio limpieza playas',
    'empresas ecológicas puerto rico',
    'sponsor conservación marina',
    'RSE puerto rico',
  ],
  openGraph: {
    title: 'Auspiciadores - Empresas que Apoyan a Doce25',
    description: 'Empresas comprometidas con la conservación de las playas de Puerto Rico. Únete como patrocinador.',
    url: 'https://doce25.precotracks.org/auspiciadores',
    type: 'website',
  },
  alternates: {
    canonical: 'https://doce25.precotracks.org/auspiciadores',
  },
}

export default function AuspiciadoresLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}


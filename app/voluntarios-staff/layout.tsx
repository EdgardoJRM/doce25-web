import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Únete al Equipo | Voluntarios y Staff - Doce25',
  description: 'Sé parte del equipo de Doce25. Buscamos voluntarios comprometidos y líderes para nuestras limpiezas de playa en Puerto Rico. Oportunidades de liderazgo, coordinación y educación ambiental.',
  keywords: [
    'voluntariado puerto rico',
    'staff doce25',
    'liderazgo ambiental',
    'coordinador limpieza playas',
    'oportunidades voluntariado',
    'trabajo ong puerto rico',
    'educador ambiental',
    'conservación marina trabajo',
  ],
  openGraph: {
    title: 'Únete al Equipo de Doce25 - Voluntarios y Staff',
    description: 'Buscamos líderes comprometidos con el medio ambiente. Únete como voluntario o staff y lidera el cambio en Puerto Rico.',
    url: 'https://doce25.precotracks.org/voluntarios-staff',
    type: 'website',
  },
  alternates: {
    canonical: 'https://doce25.precotracks.org/voluntarios-staff',
  },
}

export default function VoluntariosStaffLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}


import { EventList } from '@/components/EventList'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Eventos de Limpieza de Playas | Voluntariado en Puerto Rico',
  description: 'Únete a nuestros eventos de limpieza de playas en Puerto Rico. Regístrate como voluntario para limpiezas en Manatí, Loíza, Luquillo y más municipios. Eventos mensuales gratuitos, todos son bienvenidos.',
  keywords: [
    'eventos limpieza playas puerto rico',
    'voluntariado playas',
    'limpieza playas 2026',
    'eventos ambientales puerto rico',
    'voluntario limpieza costera',
    'beach cleanup events',
    'registro voluntarios',
    'eventos doce25',
    'limpiezas comunitarias',
  ],
  openGraph: {
    title: 'Eventos de Limpieza de Playas - Doce25 Puerto Rico',
    description: 'Regístrate para próximas limpiezas de playas. Eventos gratuitos, todos son bienvenidos. Transporte incluido para estudiantes universitarios.',
    type: 'website',
    url: 'https://doce25.precotracks.org/eventos',
  },
  alternates: {
    canonical: 'https://doce25.precotracks.org/eventos',
  },
}

export default function EventosPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-center mb-12 text-gray-900">
        Próximos Eventos
      </h1>
      <EventList />
    </div>
  )
}


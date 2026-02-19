import { EventList } from '@/components/EventList'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Eventos de Limpieza de Playas',
  description: 'Únete a nuestros eventos de limpieza de playas en Puerto Rico. Descubre próximas limpiezas, regístrate como voluntario y ayuda a mantener nuestras costas limpias. ¡Todos son bienvenidos!',
  openGraph: {
    title: 'Eventos de Limpieza de Playas - Doce25',
    description: 'Próximos eventos de voluntariado para limpieza de playas en Puerto Rico. ¡Únete a nuestra comunidad!',
    type: 'website',
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


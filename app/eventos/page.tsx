import { EventList } from '@/components/EventList'

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


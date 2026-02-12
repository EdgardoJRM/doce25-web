'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Event {
  eventId: string
  name: string
  date: string
  location: string
  description: string
  slug: string
  imageUrl?: string
}

export function EventList() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: Fetch events from API
    // Por ahora datos mock
    setTimeout(() => {
      setEvents([
        {
          eventId: '1',
          name: 'Gran Limpieza de Playas 2024',
          date: '2024-12-25',
          location: 'Playa del Carmen, Quintana Roo',
          description: 'Únete a nuestra jornada de limpieza masiva en las playas de Quintana Roo.',
          slug: 'gran-limpieza-playas-2024',
        },
      ])
      setLoading(false)
    }, 500)
  }, [])

  if (loading) {
    return <div className="text-center py-12">Cargando eventos...</div>
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg">No hay eventos próximos en este momento.</p>
        <p className="text-gray-500 mt-2">¡Vuelve pronto para ver nuestros próximos eventos!</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {events.map((event) => (
        <Link
          key={event.eventId}
          href={`/eventos/${event.slug}`}
          className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition"
        >
          <div className="h-48 bg-gradient-to-br from-blue-400 to-ocean-500"></div>
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-2 text-gray-900">{event.name}</h3>
            <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
            <div className="flex items-center text-sm text-gray-500 mb-2">
              <span className="mr-2">📅</span>
              {new Date(event.date).toLocaleDateString('es-MX', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <span className="mr-2">📍</span>
              {event.location}
            </div>
            <div className="mt-4">
              <span className="text-blue-600 font-semibold hover:underline">
                Registrarse →
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}


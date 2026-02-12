'use client'

import { useState, useEffect } from 'react'
import { EventRegistrationForm } from './EventRegistrationForm'

interface Event {
  eventId: string
  name: string
  date: string
  location: string
  description: string
  slug: string
  imageUrl?: string
}

interface EventLandingProps {
  eventSlug: string
}

export function EventLanding({ eventSlug }: EventLandingProps) {
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    // TODO: Fetch event from API by slug
    setTimeout(() => {
      setEvent({
        eventId: '1',
        name: 'Gran Limpieza de Playas 2024',
        date: '2024-12-25',
        location: 'Playa del Carmen, Quintana Roo',
        description:
          'Únete a nuestra jornada de limpieza masiva en las playas de Quintana Roo. Este evento busca reunir a cientos de voluntarios para limpiar nuestras costas y proteger la vida marina.',
        slug: eventSlug,
      })
      setLoading(false)
    }, 500)
  }, [eventSlug])

  if (loading) {
    return <div className="container mx-auto px-4 py-16 text-center">Cargando...</div>
  }

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Evento no encontrado</h1>
        <p className="text-gray-600">El evento que buscas no existe o ha sido eliminado.</p>
      </div>
    )
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-ocean-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{event.name}</h1>
            <div className="flex flex-wrap gap-6 mb-8">
              <div className="flex items-center">
                <span className="mr-2">📅</span>
                <span>
                  {new Date(event.date).toLocaleDateString('es-MX', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
              <div className="flex items-center">
                <span className="mr-2">📍</span>
                <span>{event.location}</span>
              </div>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition"
            >
              Registrarme al Evento
            </button>
          </div>
        </div>
      </section>

      {/* Description Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">Sobre el Evento</h2>
            <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-line">
              {event.description}
            </p>
          </div>
        </div>
      </section>

      {/* Registration Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <EventRegistrationForm eventId={event.eventId} onSuccess={() => setShowForm(false)} />
          </div>
        </div>
      )}
    </div>
  )
}


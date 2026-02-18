'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getEvents } from '@/lib/api'

interface Event {
  eventId: string
  name: string
  date: string
  location: string
  description: string
  slug: string
  imageUrl?: string
  image?: string
}

export function EventList() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getEvents()
        setEvents(data)
      } catch (err: any) {
        console.error('Error fetching events:', err)
        setError(err.message || 'Error al cargar eventos')
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-cyan-500 border-t-transparent"></div>
        <p className="mt-4 text-gray-600">Cargando eventos...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 text-lg">❌ {error}</p>
        <p className="text-gray-500 mt-2">Por favor intenta de nuevo más tarde.</p>
      </div>
    )
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
          {event.image || event.imageUrl ? (
            <img 
              src={event.image || event.imageUrl} 
              alt={event.name}
              className="h-48 w-full object-cover"
            />
          ) : (
            <div className="h-48 bg-gradient-to-br from-cyan-400 to-teal-500 flex items-center justify-center">
              <span className="text-white text-6xl">🌊</span>
            </div>
          )}
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


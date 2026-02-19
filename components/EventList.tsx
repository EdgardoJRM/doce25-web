'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
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
  const [copiedEventId, setCopiedEventId] = useState<string | null>(null)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getEvents()
        setEvents(data.events || [])
      } catch (err: any) {
        console.error('Error fetching events:', err)
        setError(err.message || 'Error al cargar eventos')
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  const copyShortLink = (eventId: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const shortLink = `${window.location.origin}/e/${eventId}`
    navigator.clipboard.writeText(shortLink).then(() => {
      setCopiedEventId(eventId)
      setTimeout(() => setCopiedEventId(null), 2000)
    }).catch(err => {
      console.error('Error copying link:', err)
    })
  }

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
        <div
          key={event.eventId}
          className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition group"
        >
          <Link href={`/eventos/${event.slug}`} className="block">
            <div className="relative h-48 w-full overflow-hidden">
              <Image
                src={event.image || event.imageUrl || '/images/doce25-featured.jpg'}
                alt={event.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            </div>
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
            </div>
          </Link>
          <div className="px-6 pb-6 flex gap-2">
            <Link
              href={`/eventos/${event.slug}`}
              className="flex-1 text-center bg-cyan-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-cyan-700 transition"
            >
              Registrarse
            </Link>
            <button
              onClick={(e) => copyShortLink(event.eventId, e)}
              className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition flex items-center gap-1"
              title="Copiar link para compartir"
            >
              {copiedEventId === event.eventId ? (
                <>
                  <span>✓</span>
                  <span className="text-sm">Copiado</span>
                </>
              ) : (
                <>
                  <span>🔗</span>
                  <span className="text-sm">Compartir</span>
                </>
              )}
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}


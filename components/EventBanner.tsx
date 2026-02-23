'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getEvents } from '@/lib/api'

interface Event {
  eventId: string
  name: string
  date: string
  time: string
  location: string
  slug: string
  status: 'draft' | 'published' | 'cancelled'
}

export function EventBanner() {
  const [event, setEvent] = useState<Event | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isClosing, setIsClosing] = useState(false)

  useEffect(() => {
    loadUpcomingEvent()
  }, [])

  const loadUpcomingEvent = async () => {
    try {
      const data = await getEvents()
      const publishedEvents = data.events.filter((e: Event) => e.status === 'published')
      
      // Filtrar eventos futuros
      const now = new Date()
      const upcomingEvents = publishedEvents.filter((e: Event) => {
        const eventDate = new Date(e.date)
        return eventDate >= now
      })

      // Ordenar por fecha más cercana
      upcomingEvents.sort((a: Event, b: Event) => {
        return new Date(a.date).getTime() - new Date(b.date).getTime()
      })

      if (upcomingEvents.length > 0) {
        const nextEvent = upcomingEvents[0]
        setEvent(nextEvent)
        // Mostrar el banner después de un pequeño delay para animación
        setTimeout(() => setIsVisible(true), 500)
      }
    } catch (error) {
      console.error('Error loading events for banner:', error)
    }
  }

  const handleClose = () => {
    setIsClosing(true)
    
    // Solo ocultar temporalmente en esta sesión
    // El banner volverá a aparecer cuando el usuario recargue la página
    setTimeout(() => {
      setIsVisible(false)
      setIsClosing(false)
    }, 300)
  }

  if (!event || !isVisible) return null

  // Calcular días hasta el evento
  const eventDate = new Date(event.date)
  const today = new Date()
  const daysUntil = Math.ceil((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ${
        isClosing ? 'translate-y-full' : 'translate-y-0'
      }`}
    >
      <div className="bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-600 text-white shadow-2xl">
        <div className="container mx-auto px-4 py-3 md:py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Contenido del Banner */}
            <div className="flex-1 flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
              {/* Badge de "Próximo Evento" */}
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs md:text-sm font-bold animate-pulse">
                  <span className="mr-2">🌊</span>
                  PRÓXIMO EVENTO
                </span>
                {daysUntil <= 7 && (
                  <span className="inline-flex items-center bg-yellow-400 text-gray-900 px-2 py-1 rounded-full text-xs font-bold">
                    {daysUntil === 0 ? '¡HOY!' : daysUntil === 1 ? '¡MAÑANA!' : `EN ${daysUntil} DÍAS`}
                  </span>
                )}
              </div>

              {/* Información del Evento */}
              <div className="flex-1">
                <h3 className="font-bold text-sm md:text-lg line-clamp-1">
                  {event.name}
                </h3>
                <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm text-cyan-50">
                  <span className="flex items-center">
                    <svg className="w-3 h-3 md:w-4 md:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {new Date(event.date).toLocaleDateString('es-PR', { 
                      weekday: 'short', 
                      day: 'numeric', 
                      month: 'short' 
                    })}
                  </span>
                  {event.time && (
                    <span className="flex items-center">
                      <svg className="w-3 h-3 md:w-4 md:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {event.time}
                    </span>
                  )}
                  <span className="flex items-center">
                    <svg className="w-3 h-3 md:w-4 md:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {event.location}
                  </span>
                </div>
              </div>

              {/* Botón de Acción */}
              <Link
                href={`/eventos/${event.slug}`}
                className="inline-flex items-center justify-center bg-white text-cyan-600 px-4 md:px-6 py-2 md:py-3 rounded-lg font-bold text-sm md:text-base hover:bg-cyan-50 transition-all shadow-lg hover:shadow-xl whitespace-nowrap"
              >
                <span className="mr-2">📝</span>
                Registrarme
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Botón de Cerrar */}
            <button
              onClick={handleClose}
              className="flex-shrink-0 text-white hover:text-cyan-100 transition-colors p-1"
              aria-label="Cerrar banner"
            >
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}


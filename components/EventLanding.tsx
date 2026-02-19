'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { EventRegistrationForm } from './EventRegistrationForm'
import { getEventBySlug } from '@/lib/api'

interface Event {
  eventId: string
  name: string
  date: string
  dateTime?: string
  location: string
  description: string
  slug: string
  imageUrl?: string
  image?: string
  capacity?: number
  status?: string
}

interface EventLandingProps {
  eventSlug: string
}

export function EventLanding({ eventSlug }: EventLandingProps) {
  const router = useRouter()
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const data = await getEventBySlug(eventSlug)
        setEvent(data)
      } catch (err: any) {
        console.error('Error fetching event:', err)
        setError(err.message || 'Error al cargar el evento')
      } finally {
        setLoading(false)
      }
    }

    fetchEvent()
  }, [eventSlug])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-cyan-500 border-t-transparent"></div>
        <p className="mt-4 text-gray-600">Cargando evento...</p>
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4 text-gray-900">
          {error ? 'Error' : 'Evento no encontrado'}
        </h1>
        <p className="text-gray-600 mb-8">
          {error || 'El evento que buscas no existe o ha sido eliminado.'}
        </p>
        <a
          href="/eventos"
          className="inline-block bg-cyan-600 text-white px-6 py-3 rounded-lg hover:bg-cyan-700 transition"
        >
          Ver todos los eventos
        </a>
      </div>
    )
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-cyan-600 via-teal-600 to-ocean-600 text-white py-20 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src={event.image || event.imageUrl || '/images/doce25-hero-main.jpg'}
            alt={event.name}
            fill
            className="object-cover opacity-30"
            priority
            sizes="100vw"
          />
        </div>
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/80 via-teal-800/70 to-ocean-900/80"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 drop-shadow-lg">{event.name}</h1>
            <div className="flex flex-wrap gap-6 mb-8">
              <div className="flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                <span className="mr-2">📅</span>
                <span>
                  {new Date(event.dateTime || event.date).toLocaleDateString('es-MX', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
              <div className="flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                <span className="mr-2">📍</span>
                <span>{event.location}</span>
              </div>
              {event.capacity && (
                <div className="flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                  <span className="mr-2">👥</span>
                  <span>Capacidad: {event.capacity} personas</span>
                </div>
              )}
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="bg-white text-cyan-600 px-8 py-4 rounded-lg font-semibold hover:bg-cyan-50 transition shadow-lg hover:shadow-xl"
            >
              🎯 Registrarme al Evento
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

      {/* Featured Image Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/images/doce25-featured.jpg"
                alt="Doce25 - Impacto comunitario en limpiezas de playas"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1280px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end">
                <div className="p-8 text-white">
                  <h3 className="text-2xl md:text-3xl font-bold mb-2">Únete a la Transformación</h3>
                  <p className="text-lg opacity-90">Cada limpieza marca la diferencia en nuestras playas y comunidades</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Registration Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-4xl w-full p-8 relative my-8">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 text-2xl font-bold w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition"
              aria-label="Cerrar"
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-2 text-gray-900 pr-12">
              Registro: {event.name}
            </h2>
            <p className="text-gray-600 mb-6">
              Completa el formulario para confirmar tu asistencia
            </p>
            <EventRegistrationForm 
              eventId={event.eventId} 
              onSuccess={(email) => {
                setShowForm(false)
                // Redirigir a página de confirmación
                router.push(`/registro-exitoso?event=${encodeURIComponent(event.name)}&email=${encodeURIComponent(email)}`)
              }} 
            />
          </div>
        </div>
      )}
    </div>
  )
}


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
  const [linkCopied, setLinkCopied] = useState(false)

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

  const getShareUrl = () => {
    const baseUrl = typeof window !== 'undefined'
      ? window.location.origin
      : 'https://doce25.precotracks.org'
    return `${baseUrl}/eventos/${event?.slug}`
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(getShareUrl())
      setLinkCopied(true)
      setTimeout(() => setLinkCopied(false), 2000)
    } catch (err) {
      console.error('Error copying to clipboard:', err)
    }
  }

  const shareOnWhatsApp = () => {
    const url = getShareUrl()
    const text = `¡Únete a este evento! ${event?.name}`
    window.open(`https://wa.me/?text=${encodeURIComponent(text + ' - ' + url)}`, '_blank')
  }

  const shareOnFacebook = () => {
    const url = getShareUrl()
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank')
  }

  const shareOnTwitter = () => {
    const url = getShareUrl()
    const text = `¡Únete a este evento! ${event?.name}`
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank')
  }

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
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => setShowForm(true)}
                className="bg-white text-cyan-600 px-8 py-4 rounded-lg font-semibold hover:bg-cyan-50 transition shadow-lg hover:shadow-xl"
              >
                🎯 Registrarme al Evento
              </button>
              <button
                onClick={copyToClipboard}
                className="bg-white/10 backdrop-blur-sm border-2 border-white text-white px-6 py-4 rounded-lg font-semibold hover:bg-white/20 transition shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                {linkCopied ? (
                  <>
                    <span>✓</span>
                    <span>¡Link Copiado!</span>
                  </>
                ) : (
                  <>
                    <span>🔗</span>
                    <span>Compartir</span>
                  </>
                )}
              </button>
            </div>
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

            {/* Share Section */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h3 className="text-xl font-bold mb-4 text-gray-900">Comparte este Evento</h3>

              {/* Link Display */}
              <div className="mb-6">
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={getShareUrl()}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 text-sm"
                  />
                  <button
                    onClick={copyToClipboard}
                    className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                      linkCopied
                        ? 'bg-green-500 text-white'
                        : 'bg-cyan-600 text-white hover:bg-cyan-700'
                    }`}
                  >
                    {linkCopied ? '✓ Copiado' : 'Copiar'}
                  </button>
                </div>
              </div>

              {/* Social Share Buttons */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={shareOnWhatsApp}
                  className="flex items-center gap-2 px-5 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  WhatsApp
                </button>
                <button
                  onClick={shareOnFacebook}
                  className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Facebook
                </button>
                <button
                  onClick={shareOnTwitter}
                  className="flex items-center gap-2 px-5 py-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors font-semibold"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                  Twitter
                </button>
              </div>
            </div>
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
                router.push(`/registro-exitoso?event=${encodeURIComponent(event.name)}&email=${encodeURIComponent(email)}`)
              }} 
            />
          </div>
        </div>
      )}
    </div>
  )
}

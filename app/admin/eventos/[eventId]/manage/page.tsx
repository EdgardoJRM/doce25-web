'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { getEvents, getRegistrations } from '@/lib/api'

interface Event {
  eventId: string
  name: string
  date: string
  location?: string
  description?: string
}

interface EventStats {
  totalRegistrations: number
  checkedIn: number
  pending: number
}

export default function EventManagePage() {
  const params = useParams()
  const router = useRouter()
  const eventId = params.eventId as string
  
  const [event, setEvent] = useState<Event | null>(null)
  const [stats, setStats] = useState<EventStats>({ totalRegistrations: 0, checkedIn: 0, pending: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchEventData()
  }, [eventId])

  const fetchEventData = async () => {
    try {
      setLoading(true)
      
      // Obtener evento
      const eventsData = await getEvents()
      const foundEvent = eventsData.events?.find((e: any) => e.eventId === eventId)
      
      if (!foundEvent) {
        setError('Evento no encontrado')
        return
      }
      
      setEvent(foundEvent)
      
      // Obtener estadísticas
      const registrationsData = await getRegistrations(eventId)
      const registrations = registrationsData.registrations || []
      const checkedIn = registrations.filter((r: any) => r.checkedIn).length
      
      setStats({
        totalRegistrations: registrations.length,
        checkedIn,
        pending: registrations.length - checkedIn,
      })
    } catch (err: any) {
      console.error('Error loading event:', err)
      setError(err.message || 'Error al cargar el evento')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando evento...</p>
        </div>
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error || 'Evento no encontrado'}
        </div>
        <button
          onClick={() => router.back()}
          className="mt-4 text-blue-600 hover:text-blue-900"
        >
          ← Volver
        </button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-4 lg:py-8">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver
        </button>
        
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">{event.name}</h1>
        <p className="text-gray-600">
          📅 {new Date(event.date).toLocaleDateString('es-PR')}
          {event.location && ` • 📍 ${event.location}`}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 lg:mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg shadow-lg p-4 lg:p-6">
          <div className="text-xs lg:text-sm font-medium opacity-80 mb-1 lg:mb-2">Total Registros</div>
          <div className="text-3xl lg:text-4xl font-bold">{stats.totalRegistrations}</div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg shadow-lg p-4 lg:p-6">
          <div className="text-xs lg:text-sm font-medium opacity-80 mb-1 lg:mb-2">Check-ins</div>
          <div className="text-3xl lg:text-4xl font-bold">{stats.checkedIn}</div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-lg shadow-lg p-4 lg:p-6">
          <div className="text-xs lg:text-sm font-medium opacity-80 mb-1 lg:mb-2">Pendientes</div>
          <div className="text-3xl lg:text-4xl font-bold">{stats.pending}</div>
        </div>
      </div>

      {/* Management Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
        {/* Asistentes */}
        <Link
          href={`/admin/asistentes/${eventId}`}
          className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all border-l-4 border-blue-500"
        >
          <div className="text-4xl mb-3">👥</div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Asistentes</h3>
          <p className="text-sm text-gray-600 mb-4">
            Gestiona la lista de participantes, busca, registra peso y edita información
          </p>
          <div className="text-blue-600 font-semibold text-sm">
            Ver {stats.totalRegistrations} asistentes →
          </div>
        </Link>

        {/* Scanner QR */}
        <Link
          href="/admin/scanner"
          className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all border-l-4 border-cyan-500"
        >
          <div className="text-4xl mb-3">📱</div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Escáner QR</h3>
          <p className="text-sm text-gray-600 mb-4">
            Escanea códigos QR para hacer check-in de participantes
          </p>
          <div className="text-cyan-600 font-semibold text-sm">
            Abrir escáner →
          </div>
        </Link>

        {/* Datos del Evento */}
        <Link
          href={`/admin/eventos/${eventId}`}
          className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all border-l-4 border-purple-500"
        >
          <div className="text-4xl mb-3">📊</div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Datos del Evento</h3>
          <p className="text-sm text-gray-600 mb-4">
            Visualiza estadísticas, registros de peso y detalles del evento
          </p>
          <div className="text-purple-600 font-semibold text-sm">
            Ver datos →
          </div>
        </Link>

        {/* Editar Evento */}
        <Link
          href={`/admin/eventos/${eventId}/editar`}
          className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all border-l-4 border-green-500"
        >
          <div className="text-4xl mb-3">✏️</div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Editar Evento</h3>
          <p className="text-sm text-gray-600 mb-4">
            Modifica la información, fecha, ubicación y descripción del evento
          </p>
          <div className="text-green-600 font-semibold text-sm">
            Editar →
          </div>
        </Link>
      </div>

      {/* Description */}
      {event.description && (
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-bold text-gray-900 mb-2">Descripción del Evento</h3>
          <p className="text-gray-700">{event.description}</p>
        </div>
      )}
    </div>
  )
}

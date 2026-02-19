'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getEvents } from '@/lib/api'

interface Event {
  eventId: string
  name: string
  date: string
  location: string
  status: 'draft' | 'published'
  slug: string
  description?: string
}

export default function AdminEventosPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchEvents() {
      try {
        setLoading(true)
        const data = await getEvents()
        setEvents(data.events || [])
      } catch (err: any) {
        setError(err.message || 'Error al cargar eventos')
      } finally {
        setLoading(false)
      }
    }
    
    fetchEvents()
  }, [])

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Cargando...</div>
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-4 lg:py-8">
      {/* Header responsive */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 lg:mb-8">
        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Gestión de Eventos</h2>
        <Link
          href="/admin/eventos/nuevo"
          className="w-full sm:w-auto bg-blue-600 text-white px-4 lg:px-6 py-2 lg:py-3 rounded-lg font-semibold hover:bg-blue-700 transition text-center text-sm lg:text-base"
        >
          + Crear Evento
        </Link>
      </div>

      {events.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="text-6xl mb-4">📅</div>
          <p className="text-gray-500 text-lg">No hay eventos creados aún</p>
        </div>
      ) : (
        <>
          {/* Vista móvil - Cards */}
          <div className="lg:hidden space-y-4">
            {events.map((event) => (
              <div key={event.eventId} className="bg-white rounded-lg shadow-md p-4">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-bold text-gray-900 flex-1">{event.name}</h3>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap ml-2 ${
                      event.status === 'published'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {event.status === 'published' ? '✓ Publicado' : 'Borrador'}
                  </span>
                </div>
                
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <p>📅 {new Date(event.date).toLocaleDateString('es-PR')}</p>
                  <p>📍 {event.location}</p>
                </div>

                <div className="flex gap-2">
                  <Link
                    href={`/admin/eventos/${event.eventId}`}
                    className="flex-1 text-center bg-blue-50 text-blue-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-100 transition"
                  >
                    ✏️ Editar
                  </Link>
                  <Link
                    href={`/admin/asistentes/${event.eventId}`}
                    className="flex-1 text-center bg-green-50 text-green-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-100 transition"
                  >
                    👥 Asistentes
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Vista desktop - Tabla */}
          <div className="hidden lg:block bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ubicación
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {events.map((event) => (
                  <tr key={event.eventId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {event.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(event.date).toLocaleDateString('es-MX')}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {event.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          event.status === 'published'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {event.status === 'published' ? 'Publicado' : 'Borrador'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                      <Link
                        href={`/admin/eventos/${event.eventId}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Editar
                      </Link>
                      <Link
                        href={`/admin/asistentes/${event.eventId}`}
                        className="text-green-600 hover:text-green-900"
                      >
                        Ver Asistentes
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}


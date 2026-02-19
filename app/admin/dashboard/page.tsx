'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getEvents, getRegistrations } from '@/lib/api'

interface EventStats {
  eventId: string
  name: string
  date: string
  totalRegistrations: number
  checkedIn: number
  pending: number
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalEvents: 0,
    publishedEvents: 0,
    totalRegistrations: 0,
    totalCheckins: 0,
  })
  const [eventStats, setEventStats] = useState<EventStats[]>([])

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)

      // Obtener todos los eventos
      const eventsData = await getEvents()
      const events = eventsData.events || []

      // Calcular estadísticas globales
      let totalRegistrations = 0
      let totalCheckins = 0
      const eventStatsArray: EventStats[] = []

      // Para cada evento, obtener sus registros
      for (const event of events) {
        try {
          const registrationsData = await getRegistrations(event.eventId)
          const registrations = registrationsData.registrations || []
          const eventCheckins = registrations.filter((r: any) => r.checkedIn).length

          totalRegistrations += registrations.length
          totalCheckins += eventCheckins

          eventStatsArray.push({
            eventId: event.eventId,
            name: event.name,
            date: event.date,
            totalRegistrations: registrations.length,
            checkedIn: eventCheckins,
            pending: registrations.length - eventCheckins,
          })
        } catch (err) {
          console.error(`Error loading registrations for event ${event.eventId}:`, err)
        }
      }

      setStats({
        totalEvents: events.length,
        publishedEvents: events.filter((e: any) => e.status === 'published').length,
        totalRegistrations,
        totalCheckins,
      })

      // Ordenar por fecha más reciente
      eventStatsArray.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      setEventStats(eventStatsArray)
    } catch (err) {
      console.error('Error loading dashboard:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Cargando dashboard...</div>
  }

  return (
    <div className="container mx-auto px-4 py-4 lg:py-8">
      <div className="mb-6 lg:mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-sm lg:text-base text-gray-600">Vista general del sistema</p>
      </div>

      {/* Estadísticas Globales - Responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg shadow-lg p-4 lg:p-6">
          <div className="text-xs lg:text-sm font-medium opacity-80 mb-1 lg:mb-2">Total Eventos</div>
          <div className="text-3xl lg:text-4xl font-bold">{stats.totalEvents}</div>
          <div className="text-xs lg:text-sm opacity-80 mt-1 lg:mt-2">
            {stats.publishedEvents} publicados
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg shadow-lg p-4 lg:p-6">
          <div className="text-xs lg:text-sm font-medium opacity-80 mb-1 lg:mb-2">Total Registros</div>
          <div className="text-3xl lg:text-4xl font-bold">{stats.totalRegistrations}</div>
          <div className="text-xs lg:text-sm opacity-80 mt-1 lg:mt-2">
            En todos los eventos
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg shadow-lg p-4 lg:p-6">
          <div className="text-xs lg:text-sm font-medium opacity-80 mb-1 lg:mb-2">Check-ins</div>
          <div className="text-3xl lg:text-4xl font-bold">{stats.totalCheckins}</div>
          <div className="text-xs lg:text-sm opacity-80 mt-1 lg:mt-2">
            Asistencias confirmadas
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-lg shadow-lg p-4 lg:p-6">
          <div className="text-xs lg:text-sm font-medium opacity-80 mb-1 lg:mb-2">Tasa de Asistencia</div>
          <div className="text-3xl lg:text-4xl font-bold">
            {stats.totalRegistrations > 0 
              ? Math.round((stats.totalCheckins / stats.totalRegistrations) * 100)
              : 0}%
          </div>
          <div className="text-xs lg:text-sm opacity-80 mt-1 lg:mt-2">
            Check-ins vs registros
          </div>
        </div>
      </div>

      {/* Estadísticas por Evento */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="px-4 lg:px-6 py-3 lg:py-4 border-b border-gray-200">
          <h2 className="text-lg lg:text-xl font-bold text-gray-900">Eventos Recientes</h2>
        </div>

        {/* Vista móvil - Cards */}
        <div className="lg:hidden p-4 space-y-3">
          {eventStats.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No hay datos de eventos aún</p>
          ) : (
            eventStats.map((event) => (
              <div key={event.eventId} className="border border-gray-200 rounded-lg p-3">
                <h3 className="font-bold text-gray-900 mb-2">{event.name}</h3>
                <p className="text-xs text-gray-500 mb-3">
                  📅 {new Date(event.date).toLocaleDateString('es-PR')}
                </p>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="text-lg font-bold text-blue-600">{event.totalRegistrations}</div>
                    <div className="text-xs text-gray-500">Registros</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-green-600">{event.checkedIn}</div>
                    <div className="text-xs text-gray-500">Check-ins</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-orange-600">{event.pending}</div>
                    <div className="text-xs text-gray-500">Pendientes</div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Vista desktop - Tabla */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Evento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registros
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Check-ins
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pendientes
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tasa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {eventStats.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    No hay eventos registrados
                  </td>
                </tr>
              ) : (
                eventStats.map((event) => (
                  <tr key={event.eventId}>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {event.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(event.date).toLocaleDateString('es-MX')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                      {event.totalRegistrations}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">
                      {event.checkedIn}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {event.pending}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`font-semibold ${
                        event.totalRegistrations === 0 ? 'text-gray-400' :
                        (event.checkedIn / event.totalRegistrations) >= 0.7 ? 'text-green-600' :
                        (event.checkedIn / event.totalRegistrations) >= 0.4 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {event.totalRegistrations > 0
                          ? `${Math.round((event.checkedIn / event.totalRegistrations) * 100)}%`
                          : 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Link
                        href={`/admin/asistentes/${event.eventId}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Ver Asistentes
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid md:grid-cols-3 gap-6">
        <Link
          href="/admin/eventos/nuevo"
          className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition text-center"
        >
          <div className="text-4xl mb-2">➕</div>
          <h3 className="font-bold text-gray-900">Crear Evento</h3>
          <p className="text-sm text-gray-600 mt-2">Agregar un nuevo evento</p>
        </Link>

        <Link
          href="/admin/scanner"
          className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition text-center"
        >
          <div className="text-4xl mb-2">📱</div>
          <h3 className="font-bold text-gray-900">Escáner QR</h3>
          <p className="text-sm text-gray-600 mt-2">Hacer check-in</p>
        </Link>

        <Link
          href="/admin/eventos"
          className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition text-center"
        >
          <div className="text-4xl mb-2">📅</div>
          <h3 className="font-bold text-gray-900">Ver Eventos</h3>
          <p className="text-sm text-gray-600 mt-2">Gestionar eventos</p>
        </Link>
      </div>
    </div>
  )
}


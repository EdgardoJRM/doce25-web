'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { getRegistrations } from '@/lib/api'

interface Attendee {
  registrationId: string
  name: string
  email: string
  phone?: string
  createdAt: string
  checkedIn: boolean
  checkedInAt?: string
}

interface Stats {
  total: number
  checkedIn: number
  pending: number
}

export default function AdminAsistentesPage() {
  const params = useParams()
  const eventId = params.eventId as string
  const [attendees, setAttendees] = useState<Attendee[]>([])
  const [stats, setStats] = useState<Stats>({ total: 0, checkedIn: 0, pending: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchRegistrations() {
      try {
        setLoading(true)
        const data = await getRegistrations(eventId)
        setAttendees(data.registrations || [])
        setStats(data.stats || { total: 0, checkedIn: 0, pending: 0 })
      } catch (err: any) {
        setError(err.message || 'Error al cargar registros')
      } finally {
        setLoading(false)
      }
    }
    
    fetchRegistrations()
  }, [eventId])

  const exportCSV = () => {
    const csv = [
      ['Nombre', 'Email', 'Fecha Registro', 'Check-in'],
      ...attendees.map((a) => [
        a.name,
        a.email,
        new Date(a.createdAt).toLocaleDateString('es-MX'),
        a.checkedIn ? 'Sí' : 'No',
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `asistentes-${eventId}.csv`
    a.click()
  }

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
      {/* Stats Cards - Responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
        <div className="bg-white rounded-lg shadow p-4 lg:p-6">
          <div className="text-xs lg:text-sm font-medium text-gray-500 uppercase">Total Registros</div>
          <div className="mt-1 lg:mt-2 text-2xl lg:text-3xl font-bold text-gray-900">{stats.total}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 lg:p-6">
          <div className="text-xs lg:text-sm font-medium text-gray-500 uppercase">Check-in Realizados</div>
          <div className="mt-1 lg:mt-2 text-2xl lg:text-3xl font-bold text-green-600">{stats.checkedIn}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 lg:p-6">
          <div className="text-xs lg:text-sm font-medium text-gray-500 uppercase">Pendientes</div>
          <div className="mt-1 lg:mt-2 text-2xl lg:text-3xl font-bold text-gray-600">{stats.pending}</div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 lg:mb-8">
        <h2 className="text-xl lg:text-3xl font-bold text-gray-900">Asistentes del Evento</h2>
        <button
          onClick={exportCSV}
          disabled={attendees.length === 0}
          className="w-full sm:w-auto bg-green-600 text-white px-4 lg:px-6 py-2 lg:py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm lg:text-base"
        >
          📥 Exportar CSV
        </button>
      </div>

      {attendees.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="text-6xl mb-4">👥</div>
          <p className="text-gray-500 text-lg">No hay asistentes registrados aún</p>
        </div>
      ) : (
        <>
          {/* Vista móvil - Cards */}
          <div className="lg:hidden space-y-3">
            {attendees.map((attendee) => (
              <div key={attendee.registrationId} className="bg-white rounded-lg shadow-md p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-gray-900">{attendee.name}</h3>
                    <p className="text-sm text-gray-500">{attendee.email}</p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${
                      attendee.checkedIn
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {attendee.checkedIn ? '✓ Check-in' : 'Pendiente'}
                  </span>
                </div>
                
                <div className="text-xs text-gray-500 mb-3">
                  📅 Registrado: {new Date(attendee.createdAt).toLocaleDateString('es-PR')}
                </div>

                <a
                  href={`/admin/asistentes/${eventId}/editar/${attendee.registrationId}`}
                  className="block w-full text-center bg-blue-50 text-blue-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-100 transition"
                >
                  ✏️ Editar
                </a>
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
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha Registro
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Check-in
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {attendees.map((attendee) => (
              <tr key={attendee.registrationId} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {attendee.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {attendee.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(attendee.createdAt).toLocaleDateString('es-MX')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      attendee.checkedIn
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {attendee.checkedIn ? 'Sí' : 'No'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <a
                    href={`/admin/asistentes/${eventId}/editar/${attendee.registrationId}`}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Editar
                  </a>
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


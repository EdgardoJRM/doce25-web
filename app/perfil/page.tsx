'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { getUserRegistrations } from '@/lib/api'

interface Registration {
  registrationId: string
  eventId: string
  eventName: string
  eventDate: string
  eventLocation: string
  checkedIn: boolean
  registeredAt: string
}

export default function ProfilePage() {
  const router = useRouter()
  const { user, token, loading: authLoading, logout } = useAuth()
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [authLoading, user, router])

  useEffect(() => {
    if (user && token) {
      loadRegistrations()
    }
  }, [user, token])

  const loadRegistrations = async () => {
    if (!user || !token) return

    try {
      const data = await getUserRegistrations(token, user.userId)
      setRegistrations(data.registrations || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                {user.fullName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {user.fullName}
                </h1>
                <p className="text-gray-600">{user.email}</p>
                {user.organization && (
                  <p className="text-sm text-gray-500 mt-1">
                    📍 {user.organization}
                  </p>
                )}
              </div>
            </div>
            <div className="flex gap-3">
              <Link
                href="/perfil/editar"
                className="px-6 py-3 border-2 border-cyan-600 text-cyan-600 rounded-lg font-semibold hover:bg-cyan-50 transition-colors"
              >
                Editar Perfil
              </Link>
              <button
                onClick={logout}
                className="px-6 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-cyan-500">
            <div className="text-4xl font-bold text-cyan-600 mb-2">
              {registrations.length}
            </div>
            <div className="text-gray-600 font-semibold">
              Eventos Registrados
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-teal-500">
            <div className="text-4xl font-bold text-teal-600 mb-2">
              {registrations.filter(r => r.checkedIn).length}
            </div>
            <div className="text-gray-600 font-semibold">
              Eventos Asistidos
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-orange-500">
            <div className="text-4xl font-bold text-orange-600 mb-2">
              {user.status === 'active' ? '✓' : '○'}
            </div>
            <div className="text-gray-600 font-semibold">
              Estado: {user.status === 'active' ? 'Activo' : 'Inactivo'}
            </div>
          </div>
        </div>

        {/* Registrations Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Mis Registros
            </h2>
            <Link
              href="/eventos"
              className="px-6 py-2 bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              Ver Eventos
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando registros...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          ) : registrations.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🏖️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No tienes registros aún
              </h3>
              <p className="text-gray-600 mb-6">
                Únete a un evento de limpieza de playa
              </p>
              <Link
                href="/eventos"
                className="inline-block px-8 py-3 bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-lg font-semibold hover:shadow-xl transition-all"
              >
                Explorar Eventos
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {registrations.map((registration) => (
                <div
                  key={registration.registrationId}
                  className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all"
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">
                          {registration.eventName}
                        </h3>
                        {registration.checkedIn && (
                          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                            ✓ Asistido
                          </span>
                        )}
                      </div>
                      <div className="space-y-1 text-gray-600">
                        <p className="flex items-center gap-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {new Date(registration.eventDate).toLocaleDateString('es-PR', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                        <p className="flex items-center gap-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {registration.eventLocation}
                        </p>
                        <p className="text-sm text-gray-500">
                          Registrado: {new Date(registration.registeredAt).toLocaleDateString('es-PR')}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        href={`/eventos/${registration.eventId}`}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Ver Evento
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


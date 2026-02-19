'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { getAllUsers, getUserRegistrations } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'

interface User {
  userId: string
  email: string
  fullName: string
  phone?: string
  ageRange?: string
  gender?: string
  city?: string
  organization?: string
  createdAt: string
  lastLogin: string
  status: string
}

interface Registration {
  registrationId: string
  eventId: string
  eventName: string
  eventDate: string
  eventLocation: string
  checkedIn: boolean
  registeredAt: string
}

export default function AdminUserDetailPage() {
  const params = useParams()
  const router = useRouter()
  const userId = params.userId as string
  const { token } = useAuth()

  const [user, setUser] = useState<User | null>(null)
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (token) {
      loadUserData()
    }
  }, [userId, token])

  const loadUserData = async () => {
    try {
      // Get all users to find this one
      const usersData = await getAllUsers()
      const foundUser = usersData.users.find((u: User) => u.userId === userId)
      
      if (!foundUser) {
        setError('Usuario no encontrado')
        return
      }

      setUser(foundUser)

      // Get user registrations with admin token
      if (token) {
        try {
          const regsData = await getUserRegistrations(token, userId)
          setRegistrations(regsData.registrations || [])
        } catch (regError) {
          console.error('Error loading registrations:', regError)
          // No mostrar error, solo dejar registrations vacío
        }
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
            {error || 'Usuario no encontrado'}
          </div>
          <Link
            href="/admin/usuarios"
            className="inline-block mt-4 text-cyan-600 hover:text-cyan-700"
          >
            ← Volver a usuarios
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <Link
          href="/admin/usuarios"
          className="inline-flex items-center text-cyan-600 hover:text-cyan-700 mb-6"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver a usuarios
        </Link>

        {/* User Profile Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                {user.fullName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {user.fullName}
                </h1>
                <p className="text-gray-600">{user.email}</p>
                <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${
                  user.status === 'active'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {user.status === 'active' ? 'Activo' : 'Inactivo'}
                </span>
              </div>
            </div>
          </div>

          {/* User Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                Información Personal
              </h3>
              <div className="space-y-3">
                {user.phone && (
                  <div>
                    <div className="text-xs text-gray-500">Teléfono</div>
                    <div className="text-gray-900">{user.phone}</div>
                  </div>
                )}
                {user.ageRange && (
                  <div>
                    <div className="text-xs text-gray-500">Rango de Edad</div>
                    <div className="text-gray-900">{user.ageRange}</div>
                  </div>
                )}
                {user.gender && (
                  <div>
                    <div className="text-xs text-gray-500">Género</div>
                    <div className="text-gray-900">{user.gender}</div>
                  </div>
                )}
                {user.city && (
                  <div>
                    <div className="text-xs text-gray-500">Ciudad</div>
                    <div className="text-gray-900">{user.city}</div>
                  </div>
                )}
                {user.organization && (
                  <div>
                    <div className="text-xs text-gray-500">Organización</div>
                    <div className="text-gray-900">{user.organization}</div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                Información de Cuenta
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="text-xs text-gray-500">ID de Usuario</div>
                  <div className="text-gray-900 font-mono text-sm">{user.userId}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Fecha de Registro</div>
                  <div className="text-gray-900">
                    {new Date(user.createdAt).toLocaleDateString('es-PR', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Último Inicio de Sesión</div>
                  <div className="text-gray-900">
                    {new Date(user.lastLogin).toLocaleDateString('es-PR', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Registrations Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Registros de Eventos
          </h2>
          {registrations.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📋</div>
              <p className="text-gray-600">
                Este usuario no tiene registros de eventos aún
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {registrations.map((registration) => (
                <div
                  key={registration.registrationId}
                  className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all"
                >
                  <div className="flex justify-between items-start">
                    <div>
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
                        <p>📅 {new Date(registration.eventDate).toLocaleDateString('es-PR')}</p>
                        <p>📍 {registration.eventLocation}</p>
                        <p className="text-sm text-gray-500">
                          Registrado: {new Date(registration.registeredAt).toLocaleDateString('es-PR')}
                        </p>
                      </div>
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

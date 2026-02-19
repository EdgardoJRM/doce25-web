'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { getUserRegistrations } from '@/lib/api'
import QRCode from 'qrcode'

interface Registration {
  registrationId: string
  eventId: string
  eventSlug?: string
  eventName: string
  eventDate: string
  eventLocation: string
  checkedIn: boolean
  registeredAt: string
  qrToken?: string
}

export default function ProfilePage() {
  const router = useRouter()
  const { user, token, loading: authLoading, logout } = useAuth()
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedQR, setSelectedQR] = useState<string | null>(null)
  const [qrDataUrl, setQrDataUrl] = useState<string>('')
  const canvasRef = useRef<HTMLCanvasElement>(null)

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

  const showQRCode = async (registration: Registration) => {
    if (!registration.qrToken) {
      alert('QR Code no disponible para este registro')
      return
    }

    try {
      const qrUrl = `${window.location.origin}/checkin/${registration.qrToken}`
      const dataUrl = await QRCode.toDataURL(qrUrl, {
        width: 400,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      })
      setQrDataUrl(dataUrl)
      setSelectedQR(registration.registrationId)
    } catch (err) {
      console.error('Error generating QR code:', err)
      alert('Error al generar el código QR')
    }
  }

  const downloadQRCode = () => {
    if (!qrDataUrl) return
    
    const link = document.createElement('a')
    link.href = qrDataUrl
    link.download = `doce25-pase-entrada-${selectedQR}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const closeQRModal = () => {
    setSelectedQR(null)
    setQrDataUrl('')
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
                    <div className="flex flex-col sm:flex-row gap-2">
                      <button
                        onClick={() => showQRCode(registration)}
                        className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                        </svg>
                        Ver Mi Pase
                      </button>
                      <Link
                        href={`/eventos/${registration.eventSlug || registration.eventId}`}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-center"
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

        {/* QR Code Modal */}
        {selectedQR && (
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeQRModal}
          >
            <div 
              className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeQRModal}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  🎟️ Tu Pase de Entrada
                </h3>
                <p className="text-gray-600 mb-6">
                  Muestra este código QR en el evento para registrar tu asistencia
                </p>

                {/* QR Code */}
                <div className="bg-white p-6 rounded-xl border-4 border-cyan-500 mb-6 inline-block">
                  {qrDataUrl && (
                    <img 
                      src={qrDataUrl} 
                      alt="Código QR de Entrada" 
                      className="w-64 h-64 mx-auto"
                    />
                  )}
                </div>

                {/* Event Info */}
                {registrations.find(r => r.registrationId === selectedQR) && (
                  <div className="bg-gradient-to-r from-cyan-50 to-teal-50 p-4 rounded-lg mb-6 text-left">
                    <h4 className="font-bold text-gray-900 mb-2">
                      {registrations.find(r => r.registrationId === selectedQR)?.eventName}
                    </h4>
                    <p className="text-sm text-gray-600">
                      📅 {new Date(registrations.find(r => r.registrationId === selectedQR)?.eventDate || '').toLocaleDateString('es-PR', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                    <p className="text-sm text-gray-600">
                      📍 {registrations.find(r => r.registrationId === selectedQR)?.eventLocation}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={downloadQRCode}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                  >
                    📥 Descargar Pase
                  </button>
                  <button
                    onClick={closeQRModal}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Cerrar
                  </button>
                </div>

                <p className="text-xs text-gray-500 mt-4">
                  💡 Guarda una captura de pantalla o descarga tu pase para tenerlo disponible sin conexión
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}


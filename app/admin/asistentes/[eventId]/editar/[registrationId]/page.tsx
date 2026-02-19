'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'

interface Registration {
  registrationId: string
  eventId: string
  name: string
  email: string
  phone?: string
  qrToken: string
  checkedIn: boolean
  createdAt: string
}

export default function EditarAsistentePage() {
  const params = useParams()
  const router = useRouter()
  const eventId = params.eventId as string
  const registrationId = params.registrationId as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [registration, setRegistration] = useState<Registration | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  })

  useEffect(() => {
    fetchRegistration()
  }, [registrationId])

  const fetchRegistration = async () => {
    try {
      const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT
      const response = await fetch(`${API_ENDPOINT}/events/${eventId}/registrations`)

      if (!response.ok) {
        throw new Error('Error al cargar asistentes')
      }

      const data = await response.json()
      const reg = data.registrations?.find((r: Registration) => r.registrationId === registrationId)

      if (!reg) {
        throw new Error('Asistente no encontrado')
      }

      setRegistration(reg)
      setFormData({
        name: reg.name,
        email: reg.email,
        phone: reg.phone || '',
      })
    } catch (err: any) {
      setError(err.message || 'Error al cargar asistente')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSaving(true)

    try {
      const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT

      const response = await fetch(`${API_ENDPOINT}/registrations/${registrationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Error al actualizar asistente')
      }

      router.push(`/admin/asistentes/${eventId}`)
    } catch (err: any) {
      setError(err.message || 'Error al actualizar asistente')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('¿Estás seguro de que deseas eliminar este registro? Esta acción no se puede deshacer.')) {
      return
    }

    try {
      const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT

      const response = await fetch(`${API_ENDPOINT}/registrations/${registrationId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Error al eliminar asistente')
      }

      router.push(`/admin/asistentes/${eventId}`)
    } catch (err: any) {
      setError(err.message || 'Error al eliminar asistente')
    }
  }

  const handleResendEmail = async () => {
    if (!confirm('¿Reenviar el email con el código QR a este asistente?')) {
      return
    }

    try {
      const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT

      const response = await fetch(`${API_ENDPOINT}/registrations/${registrationId}/resend-qr`, {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Error al reenviar QR')
      }

      alert('Email reenviado exitosamente')
    } catch (err: any) {
      setError(err.message || 'Error al reenviar email')
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Cargando...</div>
      </div>
    )
  }

  if (error && !registration) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Editar Asistente</h1>
          <p className="text-gray-600">Actualiza la información del asistente</p>
        </div>

        {/* Info del Registro */}
        {registration && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">ID:</span>{' '}
                <span className="font-mono text-gray-900">{registration.registrationId.slice(0, 8)}...</span>
              </div>
              <div>
                <span className="text-gray-600">Registrado:</span>{' '}
                <span className="text-gray-900">{new Date(registration.createdAt).toLocaleString('es-MX')}</span>
              </div>
              <div>
                <span className="text-gray-600">Check-in:</span>{' '}
                <span className={registration.checkedIn ? 'text-green-600 font-semibold' : 'text-gray-500'}>
                  {registration.checkedIn ? 'Sí' : 'No'}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Token QR:</span>{' '}
                <span className="font-mono text-gray-900">{registration.qrToken.slice(0, 8)}...</span>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Nombre Completo *
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Teléfono
              </label>
              <input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => router.push(`/admin/asistentes/${eventId}`)}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {saving ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </form>
        </div>

        {/* Acciones Adicionales */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Acciones Adicionales</h3>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleResendEmail}
              className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              📧 Reenviar QR por Email
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition"
            >
              🗑️ Eliminar Registro
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}



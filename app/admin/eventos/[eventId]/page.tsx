'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getRegistrations, deleteWeight, updateWeight, RegisterWeightData } from '@/lib/api'

type Tab = 'edit' | 'registrations'

interface Registration {
  registrationId: string
  fullName?: string
  name?: string
  email: string
  organization?: string
  checkedIn: boolean
  checkedOut?: boolean
  weightCollected?: number
  trashType?: string
  trashBreakdown?: Record<string, number>
  checkOutTime?: string
  notes?: string
}

export default function EditarEventoPage() {
  const params = useParams()
  const router = useRouter()
  const eventId = params.eventId as string
  
  const [activeTab, setActiveTab] = useState<Tab>('edit')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  
  // Event data
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    date: '',
    time: '',
    location: '',
    capacity: '',
    image: '',
    status: 'draft' as 'draft' | 'published',
  })

  // Registrations data
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [loadingRegistrations, setLoadingRegistrations] = useState(false)
  const [filter, setFilter] = useState<'all' | 'with-weight' | 'without-weight'>('all')
  const [editingWeight, setEditingWeight] = useState<string | null>(null)

  useEffect(() => {
    fetchEvent()
  }, [eventId])

  useEffect(() => {
    if (activeTab === 'registrations') {
      fetchRegistrations()
    }
  }, [activeTab])

  const fetchRegistrations = async () => {
    try {
      setLoadingRegistrations(true)
      const data = await getRegistrations(eventId)
      setRegistrations(data.registrations || [])
    } catch (err: any) {
      setError(err.message || 'Error al cargar registros')
    } finally {
      setLoadingRegistrations(false)
    }
  }

  const handleDeleteWeight = async (registrationId: string) => {
    if (!confirm('¿Estás seguro de eliminar este registro de peso?')) return

    try {
      await deleteWeight(registrationId)
      await fetchRegistrations()
      alert('Peso eliminado correctamente')
    } catch (err: any) {
      alert(err.message || 'Error al eliminar peso')
    }
  }

  const filteredRegistrations = registrations.filter(r => {
    if (filter === 'with-weight') return r.checkedOut && r.weightCollected
    if (filter === 'without-weight') return r.checkedIn && !r.checkedOut
    return true
  })

  const fetchEvent = async () => {
    try {
      const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT
      const response = await fetch(`${API_ENDPOINT}/events/${eventId}`)
      
      if (!response.ok) {
        throw new Error('Evento no encontrado')
      }

      const data = await response.json()
      const event = data.event || data

      // Separar fecha y hora
      const dateTime = new Date(event.date || event.dateTime)
      const date = dateTime.toISOString().split('T')[0]
      const time = dateTime.toTimeString().slice(0, 5)

      setFormData({
        name: event.name || '',
        slug: event.slug || '',
        description: event.description || '',
        date,
        time,
        location: event.location || '',
        capacity: event.capacity?.toString() || '',
        image: event.image || '',
        status: event.status || 'draft',
      })
    } catch (err: any) {
      setError(err.message || 'Error al cargar el evento')
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

      const response = await fetch(`${API_ENDPOINT}/events/${eventId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          capacity: formData.capacity ? parseInt(formData.capacity) : 0,
          dateTime: `${formData.date}T${formData.time}:00`,
        }),
      })

      if (!response.ok) {
        throw new Error('Error al actualizar el evento')
      }

      router.push('/admin/eventos')
    } catch (err: any) {
      setError(err.message || 'Error al actualizar el evento')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Cargando evento...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Editar Evento</h1>
          <p className="text-gray-600">Actualiza la información del evento</p>
        </div>

        {/* Tabs Navigation */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('edit')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm transition ${
                activeTab === 'edit'
                  ? 'border-cyan-600 text-cyan-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Editar Evento
            </button>
            <button
              onClick={() => setActiveTab('registrations')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm transition ${
                activeTab === 'registrations'
                  ? 'border-cyan-600 text-cyan-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Registros de Peso ({registrations.filter(r => r.weightCollected).length})
            </button>
          </nav>
        </div>

        {activeTab === 'edit' ? (
          <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nombre del Evento */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del Evento *
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

            {/* Slug */}
            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
                URL del Evento (Slug) *
              </label>
              <input
                id="slug"
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="mt-1 text-sm text-gray-500">
                URL: https://doce25.precotracks.org/eventos/{formData.slug}
              </p>
            </div>

            {/* Descripción */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Descripción *
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Fecha y Hora */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha *
                </label>
                <input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
                  Hora *
                </label>
                <input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Ubicación */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                Ubicación *
              </label>
              <input
                id="location"
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Capacidad */}
            <div>
              <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-2">
                Capacidad (opcional)
              </label>
              <input
                id="capacity"
                type="number"
                min="0"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Imagen URL */}
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                URL de la Imagen (opcional)
              </label>
              <input
                id="image"
                type="url"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Estado */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Estado *
              </label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'draft' | 'published' })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="published">✅ Publicado (visible para todos)</option>
                <option value="draft">📝 Borrador (solo admin)</option>
              </select>
              <p className="mt-1 text-sm text-gray-500">
                <strong>Publicado:</strong> El evento aparece en la página pública y usuarios pueden registrarse<br />
                <strong>Borrador:</strong> Solo visible en el admin panel
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {/* Botones */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => router.push('/admin/eventos')}
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
      ) : (
        // Registrations Tab
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Registros de Peso
              </h2>

              {/* Filters */}
              <div className="flex gap-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-3 py-1 rounded-lg text-sm font-semibold ${
                    filter === 'all'
                      ? 'bg-cyan-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Todos ({registrations.length})
                </button>
                <button
                  onClick={() => setFilter('with-weight')}
                  className={`px-3 py-1 rounded-lg text-sm font-semibold ${
                    filter === 'with-weight'
                      ? 'bg-cyan-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Con Peso ({registrations.filter(r => r.weightCollected).length})
                </button>
                <button
                  onClick={() => setFilter('without-weight')}
                  className={`px-3 py-1 rounded-lg text-sm font-semibold ${
                    filter === 'without-weight'
                      ? 'bg-cyan-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Sin Peso ({registrations.filter(r => r.checkedIn && !r.checkedOut).length})
                </button>
              </div>
            </div>

            {loadingRegistrations ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto mb-4"></div>
                <p>Cargando registros...</p>
              </div>
            ) : filteredRegistrations.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No hay registros para mostrar
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left p-4 font-semibold text-gray-700">Participante</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Organización</th>
                      <th className="text-center p-4 font-semibold text-gray-700">Check-in</th>
                      <th className="text-center p-4 font-semibold text-gray-700">Peso (kg)</th>
                      <th className="text-center p-4 font-semibold text-gray-700">Tipo</th>
                      <th className="text-center p-4 font-semibold text-gray-700">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRegistrations.map((reg) => (
                      <tr key={reg.registrationId} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="p-4">
                          <div className="font-semibold text-gray-900">
                            {reg.fullName || reg.name}
                          </div>
                          <div className="text-sm text-gray-600">{reg.email}</div>
                        </td>
                        <td className="p-4 text-gray-600">
                          {reg.organization || '-'}
                        </td>
                        <td className="p-4 text-center">
                          {reg.checkedIn ? (
                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                              ✓
                            </span>
                          ) : (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold">
                              -
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-center">
                          {reg.weightCollected ? (
                            <span className="font-bold text-cyan-600">
                              {reg.weightCollected.toFixed(1)} kg
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="p-4 text-center">
                          {reg.trashType ? (
                            <span className="text-sm text-gray-600 capitalize">
                              {reg.trashType === 'plastic' && '🥤'}
                              {reg.trashType === 'metal' && '🔩'}
                              {reg.trashType === 'glass' && '🍾'}
                              {reg.trashType === 'organic' && '🌱'}
                              {reg.trashType === 'mixed' && '♻️'}
                              {reg.trashType === 'other' && '📦'}
                              {' ' + reg.trashType}
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="p-4 text-center">
                          {reg.weightCollected && (
                            <button
                              onClick={() => handleDeleteWeight(reg.registrationId)}
                              className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm font-semibold hover:bg-red-200 transition-colors"
                            >
                              Eliminar
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}


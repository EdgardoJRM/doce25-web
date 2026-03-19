'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getRegistrations, deleteWeight, updateWeight, RegisterWeightData, getWeightHistory, WeightHistory } from '@/lib/api'

type Tab = 'edit' | 'registrations'
type WeightViewMode = 'individual' | 'groups'

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
  participationType?: 'individual' | 'duo' | 'group' | 'organization'
  groupId?: string
  eventOrganization?: string
  groupMembers?: string[]
}

interface WeightRecord {
  weightRecordId: string
  registrationId?: string
  groupId?: string
  eventId: string
  weightCollected: number
  trashType: string
  trashBreakdown?: Record<string, number>
  timestamp: string
  registeredBy?: string
  registeredByName?: string
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
  const [viewMode, setViewMode] = useState<WeightViewMode>('individual')
  const [weightHistories, setWeightHistories] = useState<Record<string, WeightHistory>>({})
  const [expandedHistory, setExpandedHistory] = useState<string | null>(null)

  useEffect(() => {
    fetchEvent()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId])

  useEffect(() => {
    if (activeTab === 'registrations') {
      fetchRegistrations()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab])

  const fetchRegistrations = async () => {
    try {
      setLoadingRegistrations(true)
      const data = await getRegistrations(eventId)
      setRegistrations(data.registrations || [])
      
      for (const reg of data.registrations || []) {
        if (reg.checkedIn) {
          try {
            const historyType = reg.groupId ? 'group' : 'registration'
            const historyId = reg.groupId || reg.registrationId
            const history = await getWeightHistory(historyId, historyType)
            setWeightHistories(prev => ({
              ...prev,
              [reg.registrationId]: history
            }))
          } catch (err) {
            console.error(`Error loading weight history for ${reg.registrationId}:`, err)
          }
        }
      }
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

  const getGroupedData = () => {
    const groups = new Map<string, {
      groupId: string
      participationType: string
      eventOrganization?: string
      members: Registration[]
      history?: WeightHistory
    }>()

    filteredRegistrations.forEach(reg => {
      if (reg.groupId) {
        if (!groups.has(reg.groupId)) {
          groups.set(reg.groupId, {
            groupId: reg.groupId,
            participationType: reg.participationType || 'group',
            eventOrganization: reg.eventOrganization,
            members: [],
            history: weightHistories[reg.registrationId]
          })
        }
        groups.get(reg.groupId)!.members.push(reg)
      }
    })

    return Array.from(groups.values())
  }

  const getIndividualRegistrations = () => {
    return filteredRegistrations.filter(r => !r.groupId || r.participationType === 'individual')
  }

  const toggleHistoryExpanded = (id: string) => {
    setExpandedHistory(expandedHistory === id ? null : id)
  }

  const getTotalStats = () => {
    const totalWeight = Object.values(weightHistories).reduce((sum, h) => sum + (h.totalWeight || 0), 0)
    const totalTrips = Object.values(weightHistories).reduce((sum, h) => sum + (h.tripCount || 0), 0)
    return { totalWeight, totalTrips }
  }

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
            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-lg p-4 border border-cyan-200">
                <div className="text-3xl font-bold text-cyan-600">
                  {getTotalStats().totalTrips}
                </div>
                <div className="text-sm text-gray-600 font-semibold">
                  Total de Viajes
                </div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-lg p-4 border border-green-200">
                <div className="text-3xl font-bold text-green-600">
                  {getTotalStats().totalWeight.toFixed(1)} lb
                </div>
                <div className="text-sm text-gray-600 font-semibold">
                  Peso Total Recolectado
                </div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
                <div className="text-3xl font-bold text-purple-600">
                  {getGroupedData().length}
                </div>
                <div className="text-sm text-gray-600 font-semibold">
                  Grupos/Organizaciones
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Registros de Peso
              </h2>

              <div className="flex flex-wrap gap-2">
                {/* View Mode Toggle */}
                <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                  <button
                    onClick={() => setViewMode('individual')}
                    className={`px-3 py-1 rounded-md text-sm font-semibold transition ${
                      viewMode === 'individual'
                        ? 'bg-white text-cyan-600 shadow'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    👤 Individual
                  </button>
                  <button
                    onClick={() => setViewMode('groups')}
                    className={`px-3 py-1 rounded-md text-sm font-semibold transition ${
                      viewMode === 'groups'
                        ? 'bg-white text-cyan-600 shadow'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    👥 Grupos
                  </button>
                </div>

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
            ) : viewMode === 'groups' ? (
              // Groups View
              <div className="space-y-4">
                {getGroupedData().map((group) => {
                  const isExpanded = expandedHistory === group.groupId
                  const history = group.history

                  return (
                    <div key={group.groupId} className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="bg-gray-50 p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-bold text-gray-900">
                                {group.participationType === 'duo' && '👥 Duo'}
                                {group.participationType === 'group' && '👨‍👩‍👧‍👦 Grupo'}
                                {group.participationType === 'organization' && `🏢 ${group.eventOrganization}`}
                              </h3>
                              <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold">
                                {group.members.length} miembros
                              </span>
                              {history && history.tripCount > 0 && (
                                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                                  {history.tripCount} viajes · {history.totalWeight.toFixed(1)} lb
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-gray-600">
                              <strong>Miembros:</strong> {group.members.map(m => m.fullName || m.name).join(', ')}
                            </div>
                          </div>
                          {history && history.tripCount > 0 && (
                            <button
                              onClick={() => toggleHistoryExpanded(group.groupId)}
                              className="ml-4 px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm font-semibold hover:bg-cyan-700 transition"
                            >
                              {isExpanded ? 'Ocultar Historial' : 'Ver Historial'}
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Group Members Details */}
                      <div className="p-4">
                        <div className="space-y-2">
                          {group.members.map((member) => (
                            <div key={member.registrationId} className="flex items-center justify-between py-2 border-b border-gray-100">
                              <div>
                                <div className="font-semibold text-gray-900">{member.fullName || member.name}</div>
                                <div className="text-sm text-gray-600">{member.email}</div>
                              </div>
                              <div className="flex items-center gap-2">
                                {member.checkedIn && (
                                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                                    ✓ Check-in
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* History Section */}
                      {isExpanded && history && history.records && history.records.length > 0 && (
                        <div className="bg-blue-50 border-t border-gray-200 p-4">
                          <h4 className="font-bold text-gray-900 mb-3">📊 Historial de Recolección</h4>
                          <div className="space-y-3">
                            {history.records.map((record: WeightRecord, index: number) => (
                              <div key={record.weightRecordId} className="bg-white rounded-lg p-4 border border-gray-200">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                      <span className="px-2 py-1 bg-cyan-100 text-cyan-700 rounded-full text-xs font-bold">
                                        Viaje #{history.tripCount - index}
                                      </span>
                                      <span className="text-sm text-gray-600">
                                        {new Date(record.timestamp).toLocaleString('es-PR', {
                                          dateStyle: 'medium',
                                          timeStyle: 'short'
                                        })}
                                      </span>
                                    </div>
                                    
                                    {record.registeredByName && (
                                      <p className="text-sm text-gray-600 mb-2">
                                        👤 Registrado por: <span className="font-semibold">{record.registeredByName}</span>
                                      </p>
                                    )}

                                    <div className="flex items-center gap-4">
                                      <div>
                                        <span className="text-2xl font-bold text-green-600">
                                          {record.weightCollected.toFixed(1)} lb
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <span className="text-sm text-gray-600">
                                          {record.trashType === 'plastic' && '🥤 Plástico'}
                                          {record.trashType === 'metal' && '🔩 Metal'}
                                          {record.trashType === 'glass' && '🍾 Vidrio'}
                                          {record.trashType === 'organic' && '🌱 Orgánico'}
                                          {record.trashType === 'mixed' && '♻️ Mixto'}
                                          {record.trashType === 'other' && '📦 Otro'}
                                        </span>
                                      </div>
                                    </div>

                                    {record.notes && (
                                      <p className="text-sm text-gray-600 mt-2 italic">
                                        💬 {record.notes}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="mt-4 pt-4 border-t border-gray-300">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-gray-900">Total Recolectado:</span>
                              <span className="text-2xl font-bold text-green-600">
                                {history.totalWeight.toFixed(1)} lb
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}

                {getGroupedData().length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    No hay grupos formados en este evento
                  </div>
                )}
              </div>
            ) : (
              // Individual View
              <div className="space-y-4">
                {getIndividualRegistrations().map((reg) => {
                  const history = weightHistories[reg.registrationId]
                  const hasHistory = history && history.records && history.records.length > 0
                  const isExpanded = expandedHistory === reg.registrationId

                  return (
                    <div key={reg.registrationId} className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-bold text-gray-900">
                                {reg.fullName || reg.name}
                              </h3>
                              <div className="flex gap-2 flex-wrap">
                                {reg.checkedIn && (
                                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                                    ✓ Check-in
                                  </span>
                                )}
                                {hasHistory && history.tripCount > 0 && (
                                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                                    ♻️ {history.tripCount} viajes · {history.totalWeight.toFixed(1)} lb
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="text-sm text-gray-600">
                              <div>{reg.email}</div>
                              {reg.organization && <div>🏢 {reg.organization}</div>}
                            </div>
                          </div>
                          {hasHistory && history.tripCount > 0 && (
                            <button
                              onClick={() => toggleHistoryExpanded(reg.registrationId)}
                              className="ml-4 px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm font-semibold hover:bg-cyan-700 transition"
                            >
                              {isExpanded ? 'Ocultar' : 'Ver Historial'}
                            </button>
                          )}
                        </div>
                      </div>

                      {/* History Section */}
                      {isExpanded && hasHistory && (
                        <div className="bg-blue-50 border-t border-gray-200 p-4">
                          <h4 className="font-bold text-gray-900 mb-3">📊 Historial de Recolección</h4>
                          <div className="space-y-3">
                            {history.records.map((record: WeightRecord, index: number) => (
                              <div key={record.weightRecordId} className="bg-white rounded-lg p-4 border border-gray-200">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                      <span className="px-2 py-1 bg-cyan-100 text-cyan-700 rounded-full text-xs font-bold">
                                        Viaje #{history.tripCount - index}
                                      </span>
                                      <span className="text-sm text-gray-600">
                                        {new Date(record.timestamp).toLocaleString('es-PR', {
                                          dateStyle: 'medium',
                                          timeStyle: 'short'
                                        })}
                                      </span>
                                    </div>

                                    <div className="flex items-center gap-4">
                                      <div>
                                        <span className="text-2xl font-bold text-green-600">
                                          {record.weightCollected.toFixed(1)} lb
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <span className="text-sm text-gray-600">
                                          {record.trashType === 'plastic' && '🥤 Plástico'}
                                          {record.trashType === 'metal' && '🔩 Metal'}
                                          {record.trashType === 'glass' && '🍾 Vidrio'}
                                          {record.trashType === 'organic' && '🌱 Orgánico'}
                                          {record.trashType === 'mixed' && '♻️ Mixto'}
                                          {record.trashType === 'other' && '📦 Otro'}
                                        </span>
                                      </div>
                                    </div>

                                    {record.notes && (
                                      <p className="text-sm text-gray-600 mt-2 italic">
                                        💬 {record.notes}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="mt-4 pt-4 border-t border-gray-300">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-gray-900">Total Recolectado:</span>
                              <span className="text-2xl font-bold text-green-600">
                                {history.totalWeight.toFixed(1)} lb
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}

                {getIndividualRegistrations().length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    No hay participantes individuales
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}


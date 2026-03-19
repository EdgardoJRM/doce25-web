'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

interface TrashBreakdown {
  plastic?: number
  metal?: number
  glass?: number
  organic?: number
  other?: number
}

interface TopParticipant {
  rank: number
  name: string
  weight: number
  organization: string
  trashType: string
}

interface EventStats {
  eventId: string
  totalWeight: number
  participantsCount: number
  totalRegistrations: number
  participationRate: number
  breakdown: TrashBreakdown
  topParticipants: TopParticipant[]
  trashTypeCounts: Record<string, number>
  lastUpdated: string
}

const TRASH_TYPES = {
  plastic: { label: '🥤 Plástico', color: 'bg-blue-100 text-blue-700' },
  metal: { label: '🔩 Metal', color: 'bg-gray-100 text-gray-700' },
  glass: { label: '🍾 Vidrio', color: 'bg-amber-100 text-amber-700' },
  organic: { label: '🌱 Orgánico', color: 'bg-green-100 text-green-700' },
  mixed: { label: '♻️ Mixto', color: 'bg-teal-100 text-teal-700' },
  other: { label: '📦 Otro', color: 'bg-purple-100 text-purple-700' },
}

export default function EstadisticasPage() {
  const params = useParams()
  const eventId = params.eventId as string
  const [stats, setStats] = useState<EventStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_ENDPOINT}/events/${eventId}/stats`
        )

        if (!response.ok) {
          throw new Error('Error al obtener estadísticas')
        }

        const data = await response.json()
        setStats(data)
      } catch (err: any) {
        setError(err.message || 'Error al cargar estadísticas')
      } finally {
        setLoading(false)
      }
    }

    if (eventId) {
      fetchStats()
    }
  }, [eventId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
            <p className="mt-4 text-gray-600">Cargando estadísticas...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-700">
            <h2 className="text-xl font-bold mb-2">Error</h2>
            <p>{error || 'No se pudieron cargar las estadísticas'}</p>
          </div>
        </div>
      </div>
    )
  }

  // Obtener top 3 por tipo de basura
  const getTop3ByType = (type: string) => {
    return stats.topParticipants
      .filter((p) => p.trashType === type)
      .slice(0, 3)
  }

  const allTypes = Object.keys(TRASH_TYPES)

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/admin/eventos/${eventId}/manage`}
            className="text-cyan-600 hover:text-cyan-700 font-semibold mb-4 inline-flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver
          </Link>

          <h1 className="text-4xl font-bold text-gray-900 mb-2">📊 Estadísticas de Peso</h1>
          <p className="text-gray-600">
            Análisis detallado de la recolección de basura por categoría
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-gray-600 text-sm font-semibold mb-2">Peso Total</div>
            <div className="text-3xl font-bold text-cyan-600">{stats.totalWeight} kg</div>
            <div className="text-xs text-gray-500 mt-2">
              {stats.participantsCount} participantes
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-gray-600 text-sm font-semibold mb-2">Participación</div>
            <div className="text-3xl font-bold text-green-600">{stats.participationRate}%</div>
            <div className="text-xs text-gray-500 mt-2">
              {stats.participantsCount} de {stats.totalRegistrations}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-gray-600 text-sm font-semibold mb-2">Promedio por Persona</div>
            <div className="text-3xl font-bold text-blue-600">
              {stats.participantsCount > 0 
                ? (stats.totalWeight / stats.participantsCount).toFixed(2)
                : 0
              } kg
            </div>
            <div className="text-xs text-gray-500 mt-2">Por participante</div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-gray-600 text-sm font-semibold mb-2">Actualizado</div>
            <div className="text-sm font-mono text-gray-700">
              {new Date(stats.lastUpdated).toLocaleTimeString('es-ES')}
            </div>
            <div className="text-xs text-gray-500 mt-2">
              {new Date(stats.lastUpdated).toLocaleDateString('es-ES')}
            </div>
          </div>
        </div>

        {/* Top 3 por Categoría */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {allTypes.map((type) => {
            const top3 = getTop3ByType(type)
            const typeInfo = TRASH_TYPES[type as keyof typeof TRASH_TYPES]
            const totalByType = stats.breakdown[type as keyof TrashBreakdown] || 0

            return (
              <div key={type} className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">
                    {typeInfo.label}
                  </h2>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">{totalByType} kg</div>
                    <div className="text-xs text-gray-500">
                      {stats.trashTypeCounts[type] || 0} participantes
                    </div>
                  </div>
                </div>

                {top3.length > 0 ? (
                  <div className="space-y-3">
                    {top3.map((participant, index) => (
                      <div
                        key={`${participant.name}-${index}`}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-white font-bold text-sm">
                            {index + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 truncate">
                              {participant.name}
                            </p>
                            {participant.organization && (
                              <p className="text-xs text-gray-500 truncate">
                                {participant.organization}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="text-right ml-2">
                          <div className="text-lg font-bold text-gray-900">
                            {participant.weight} kg
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    <p>Sin datos en esta categoría</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Desglose Total */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">📈 Desglose Total por Categoría</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allTypes.map((type) => {
              const amount = stats.breakdown[type as keyof TrashBreakdown] || 0
              const percentage = stats.totalWeight > 0 
                ? ((amount / stats.totalWeight) * 100).toFixed(1)
                : 0
              const typeInfo = TRASH_TYPES[type as keyof typeof TRASH_TYPES]

              return (
                <div key={type} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-900">{typeInfo.label}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${typeInfo.color}`}>
                      {percentage}%
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-2">{amount} kg</div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-cyan-500 to-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

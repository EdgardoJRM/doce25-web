'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { getEventStats, getEventBySlug, EventStats } from '@/lib/api'
import Link from 'next/link'

export default function EventStatsPage() {
  const params = useParams()
  const slug = params.slug as string

  const [eventData, setEventData] = useState<any>(null)
  const [stats, setStats] = useState<EventStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const event = await getEventBySlug(slug)
        setEventData(event)
      } catch (err: any) {
        setError('Error al cargar el evento')
      }
    }

    fetchEventData()
  }, [slug])

  useEffect(() => {
    if (!eventData?.eventId) return

    const fetchStats = async () => {
      try {
        setError('')
        const data = await getEventStats(eventData.eventId)
        setStats(data)
        setLastUpdated(new Date())
      } catch (err: any) {
        setError(err.message || 'Error al cargar estadísticas')
      } finally {
        setLoading(false)
      }
    }

    // Cargar inmediatamente
    fetchStats()

    // Actualizar cada 10 segundos
    const interval = setInterval(fetchStats, 10000)

    return () => clearInterval(interval)
  }, [eventData])

  const handleRefresh = async () => {
    if (!eventData?.eventId) return

    setLoading(true)
    try {
      const data = await getEventStats(eventData.eventId)
      setStats(data)
      setLastUpdated(new Date())
      setError('')
    } catch (err: any) {
      setError(err.message || 'Error al actualizar')
    } finally {
      setLoading(false)
    }
  }

  if (!eventData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando evento...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/eventos/${slug}`}
            className="inline-flex items-center gap-2 text-cyan-600 hover:text-cyan-700 mb-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver al evento
          </Link>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              📊 Estadísticas en Vivo
            </h1>
            <p className="text-xl text-gray-600 mb-4">{eventData.name}</p>

            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${loading ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></div>
                Actualización automática cada 10s
              </span>
              <span>
                Última actualización: {lastUpdated.toLocaleTimeString('es-PR')}
              </span>
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="px-3 py-1 bg-cyan-600 text-white rounded-lg text-xs font-semibold hover:bg-cyan-700 disabled:opacity-50"
              >
                ↻ Actualizar
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {loading && !stats ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando estadísticas...</p>
          </div>
        ) : stats ? (
          <>
            {/* Main Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Peso Total */}
              <div className="bg-gradient-to-br from-cyan-500 to-teal-500 text-white rounded-2xl shadow-xl p-8">
                <div className="text-sm font-semibold opacity-90 mb-2">Peso Total Recogido</div>
                <div className="text-5xl font-bold mb-2">
                  {stats.totalWeight.toLocaleString('es-PR', { maximumFractionDigits: 1 })}
                </div>
                <div className="text-xl font-semibold">libras</div>
              </div>

              {/* Participantes */}
              <div className="bg-white rounded-2xl shadow-xl p-8 border-t-4 border-orange-500">
                <div className="text-sm font-semibold text-gray-600 mb-2">Participantes</div>
                <div className="text-5xl font-bold text-orange-600 mb-2">
                  {stats.participantsCount}
                </div>
                <div className="text-sm text-gray-600">
                  de {stats.totalRegistrations} registrados ({stats.participationRate}%)
                </div>
              </div>

              {/* Impacto */}
              <div className="bg-white rounded-2xl shadow-xl p-8 border-t-4 border-green-500">
                <div className="text-sm font-semibold text-gray-600 mb-2">Impacto Ambiental</div>
                <div className="text-3xl font-bold text-green-600 mb-2">
                  🌊 {stats.totalWeight.toFixed(0)} lb
                </div>
                <div className="text-sm text-gray-600">
                  salvados del océano
                </div>
              </div>
            </div>

            {/* Desglose por Tipo */}
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Desglose por Tipo de Basura</h2>

              <div className="space-y-4">
                {[
                  { type: 'plastic', label: '🥤 Plástico', color: 'bg-blue-500' },
                  { type: 'metal', label: '🔩 Metal', color: 'bg-gray-500' },
                  { type: 'glass', label: '🍾 Vidrio', color: 'bg-green-500' },
                  { type: 'organic', label: '🌱 Orgánico', color: 'bg-green-700' },
                  { type: 'other', label: '📦 Otro', color: 'bg-purple-500' },
                ].map(({ type, label, color }) => {
                  const weight = stats.breakdown[type as keyof typeof stats.breakdown] || 0
                  const percentage = stats.totalWeight > 0 ? (weight / stats.totalWeight) * 100 : 0

                  return (
                    <div key={type}>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-semibold text-gray-700">{label}</span>
                        <span className="text-sm font-bold text-gray-900">
                          {weight.toFixed(1)} lb ({percentage.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={`${color} h-3 rounded-full transition-all duration-500`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Top Participantes */}
            {stats.topParticipants.length > 0 && (
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">🏆 Top 10 Participantes</h2>

                <div className="space-y-3">
                  {stats.topParticipants.map((participant, index) => (
                    <div
                      key={participant.rank}
                      className={`flex items-center gap-4 p-4 rounded-lg ${
                        index === 0
                          ? 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-2 border-yellow-400'
                          : index === 1
                          ? 'bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-400'
                          : index === 2
                          ? 'bg-gradient-to-r from-orange-50 to-orange-100 border-2 border-orange-400'
                          : 'bg-gray-50'
                      }`}
                    >
                      {/* Rank */}
                      <div className="flex-shrink-0 w-12 text-center">
                        {index === 0 && <span className="text-3xl">🥇</span>}
                        {index === 1 && <span className="text-3xl">🥈</span>}
                        {index === 2 && <span className="text-3xl">🥉</span>}
                        {index > 2 && (
                          <span className="text-xl font-bold text-gray-600">{participant.rank}</span>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1">
                        <div className="font-bold text-gray-900">{participant.name}</div>
                        {participant.organization && (
                          <div className="text-sm text-gray-600">{participant.organization}</div>
                        )}
                      </div>

                      {/* Weight */}
                      <div className="text-right">
                        <div className="text-2xl font-bold text-cyan-600">
                          {participant.weight.toFixed(1)}
                        </div>
                        <div className="text-xs text-gray-600">lb</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Aún no hay registros de peso
            </h3>
            <p className="text-gray-600">
              Las estadísticas aparecerán cuando los participantes registren su peso
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import {
  getEventStats,
  getEventBySlug,
  EventStats,
  EventStatsTopParticipantRow,
  EventStatsTopOrganizationRow,
} from '@/lib/api'
import Link from 'next/link'
import { getTrashTypeLabel } from '@/lib/trashTypes'

const MEDALS = ['🥇', '🥈', '🥉']

function CategoryTopThree({
  title,
  subtitle,
  rows,
  variant,
}: {
  title: string
  subtitle: string
  rows: EventStatsTopParticipantRow[] | EventStatsTopOrganizationRow[]
  variant: 'person' | 'org'
}) {
  const isOrg = variant === 'org'
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border-t-4 border-cyan-500">
      <h3 className="text-lg font-bold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 mb-4">{subtitle}</p>
      {rows.length === 0 ? (
        <p className="text-gray-500 text-sm py-4 text-center">Sin datos en esta categoría aún</p>
      ) : (
        <div className="space-y-3">
          {rows.map((row, index) => (
            <div
              key={
                isOrg
                  ? `org-${(row as EventStatsTopOrganizationRow).name}-${index}`
                  : `p-${(row as EventStatsTopParticipantRow).name}-${index}`
              }
              className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100"
            >
              <span className="text-2xl w-10 text-center">{MEDALS[index] ?? `${index + 1}`}</span>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-900 truncate">{row.name}</div>
                {!isOrg && (row as EventStatsTopParticipantRow).organization && (
                  <div className="text-xs text-gray-600 truncate">
                    {(row as EventStatsTopParticipantRow).organization}
                  </div>
                )}
                {!isOrg && (row as EventStatsTopParticipantRow).trashType && (
                  <div
                    className="text-xs text-gray-400 truncate mt-0.5"
                    title={getTrashTypeLabel((row as EventStatsTopParticipantRow).trashType)}
                  >
                    {getTrashTypeLabel((row as EventStatsTopParticipantRow).trashType)}
                  </div>
                )}
                {isOrg && (
                  <div className="text-xs text-gray-600">
                    {(row as EventStatsTopOrganizationRow).participantCount} participante
                    {(row as EventStatsTopOrganizationRow).participantCount !== 1 ? 's' : ''}
                  </div>
                )}
              </div>
              <div className="text-right shrink-0">
                <div className="text-lg font-bold text-cyan-600">{row.weight.toFixed(1)}</div>
                <div className="text-xs text-gray-500">lb</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

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
            <p className="text-sm font-semibold uppercase tracking-wide text-cyan-600 mb-2">
              Estadísticas en vivo
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{eventData.name}</h1>
            <p className="text-lg text-gray-600 mb-4">
              Peso recogido, participación y ranking público de este evento.
            </p>

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

            {/* Top 3 por categoría de participación */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">🏆 Top 3 por categoría</h2>
              <p className="text-gray-600 mb-6 text-sm">
                Individual, dúo, grupo (hasta 3 personas) y organizaciones (peso acumulado por org).
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <CategoryTopThree
                  title="Individual"
                  subtitle="Una persona por registro"
                  rows={stats.topParticipantsByType?.individual ?? []}
                  variant="person"
                />
                <CategoryTopThree
                  title="Dúo"
                  subtitle="Tú + 1 integrante"
                  rows={stats.topParticipantsByType?.duo ?? []}
                  variant="person"
                />
                <CategoryTopThree
                  title="Grupo"
                  subtitle="Hasta 3 personas en total"
                  rows={stats.topParticipantsByType?.group ?? []}
                  variant="person"
                />
                <CategoryTopThree
                  title="Organizaciones"
                  subtitle="Peso total por organización"
                  rows={(stats.topOrganizations ?? []).slice(0, 3)}
                  variant="org"
                />
              </div>
            </div>
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

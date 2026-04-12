'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getRegistrations } from '@/lib/api'

type RsvpFilter = 'all' | 'yes' | 'no' | 'pending'

interface RegRow {
  registrationId: string
  fullName?: string
  name?: string
  email: string
  rsvpCleanup20260412?: 'yes' | 'no'
  rsvpCleanup20260412At?: string
}

export default function EventRsvpPage() {
  const params = useParams()
  const router = useRouter()
  const eventId = params.eventId as string

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [rows, setRows] = useState<RegRow[]>([])
  const [filter, setFilter] = useState<RsvpFilter>('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        setLoading(true)
        const data = await getRegistrations(eventId)
        const list = (data.registrations || []) as RegRow[]
        if (!cancelled) setRows(list)
      } catch (e: any) {
        if (!cancelled) setError(e.message || 'Error al cargar')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [eventId])

  const stats = useMemo(() => {
    let yes = 0
    let no = 0
    let pending = 0
    for (const r of rows) {
      const v = r.rsvpCleanup20260412
      if (v === 'yes') yes++
      else if (v === 'no') no++
      else pending++
    }
    return { yes, no, pending, total: rows.length }
  }, [rows])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return rows.filter((r) => {
      const v = r.rsvpCleanup20260412
      if (filter === 'yes' && v !== 'yes') return false
      if (filter === 'no' && v !== 'no') return false
      if (filter === 'pending' && (v === 'yes' || v === 'no')) return false
      if (!q) return true
      const name = (r.fullName || r.name || '').toLowerCase()
      const email = (r.email || '').toLowerCase()
      return name.includes(q) || email.includes(q)
    })
  }, [rows, filter, search])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center text-gray-600">
        Cargando confirmaciones…
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-red-600">{error}</p>
        <button type="button" onClick={() => router.back()} className="mt-4 text-cyan-600">
          ← Volver
        </button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <button
        type="button"
        onClick={() => router.push(`/admin/eventos/${eventId}/manage`)}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Volver a gestión del evento
      </button>

      <h1 className="text-2xl font-bold text-gray-900 mb-2">Confirmaciones — Limpieza 12 de abril</h1>
      <p className="text-gray-600 text-sm mb-6">
        Respuestas al correo RSVP (enlaces Sí / No). Quienes no han hecho clic aparecen como pendientes.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-emerald-500">
          <div className="text-xs text-gray-500 font-medium">Sí</div>
          <div className="text-2xl font-bold text-emerald-700">{stats.yes}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-gray-400">
          <div className="text-xs text-gray-500 font-medium">No</div>
          <div className="text-2xl font-bold text-gray-700">{stats.no}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-amber-500">
          <div className="text-xs text-gray-500 font-medium">Pendiente</div>
          <div className="text-2xl font-bold text-amber-700">{stats.pending}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-cyan-500">
          <div className="text-xs text-gray-500 font-medium">Total registros</div>
          <div className="text-2xl font-bold text-cyan-800">{stats.total}</div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex flex-wrap gap-2">
          {(['all', 'yes', 'no', 'pending'] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                filter === f ? 'bg-cyan-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {f === 'all' ? 'Todos' : f === 'yes' ? 'Sí' : f === 'no' ? 'No' : 'Pendiente'}
            </button>
          ))}
        </div>
        <input
          type="search"
          placeholder="Buscar por nombre o email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[200px] px-3 py-2 border border-gray-300 rounded-lg text-sm"
        />
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Nombre</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Respuesta</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => {
                const v = r.rsvpCleanup20260412
                const label =
                  v === 'yes' ? (
                    <span className="text-emerald-700 font-medium">Sí</span>
                  ) : v === 'no' ? (
                    <span className="text-gray-700 font-medium">No</span>
                  ) : (
                    <span className="text-amber-600">—</span>
                  )
                const at = r.rsvpCleanup20260412At
                  ? new Date(r.rsvpCleanup20260412At).toLocaleString('es-PR')
                  : '—'
                return (
                  <tr key={r.registrationId} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-2.5 px-4">{r.fullName || r.name || '—'}</td>
                    <td className="py-2.5 px-4 text-gray-600">{r.email}</td>
                    <td className="py-2.5 px-4">{label}</td>
                    <td className="py-2.5 px-4 text-gray-500 text-xs">{at}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <p className="text-center text-gray-500 py-8">No hay resultados con este filtro.</p>
        )}
      </div>

      <p className="text-xs text-gray-500 mt-6">
        También puedes usar{' '}
        <code className="bg-gray-100 px-1 rounded">node scripts/rsvp-stats.js {eventId}</code> en consola para
        totales y <code className="bg-gray-100 px-1 rounded">--csv</code>.
      </p>
    </div>
  )
}

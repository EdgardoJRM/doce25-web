import type { EventStats, EventStatsTopOrganizationRow, EventStatsTopParticipantRow } from './api'

/** Normaliza etiquetas de participación (ES/EN, mayúsculas, sin acentos). */
export function normalizeParticipationTypeKey(
  raw: string | null | undefined
): 'individual' | 'duo' | 'group' | 'organization' {
  const s = String(raw ?? 'individual')
    .trim()
    .toLowerCase()
  if (!s) return 'individual'
  const deAcc = s.normalize('NFD').replace(/\p{M}/gu, '')
  if (deAcc === 'organizacion' || s === 'organization' || s === 'organización') return 'organization'
  if (deAcc === 'grupo' || s === 'group') return 'group'
  if (s === 'duo' || deAcc === 'duo') return 'duo'
  if (s === 'individual') return 'individual'
  return 'individual'
}

/**
 * Usa topParticipantsByType del API; si falta (Lambda antigua), reconstruye desde topParticipants
 * (mejor que nada: top 3 por tipo dentro del top global, no el ranking perfecto por categoría).
 */
export function resolveTopParticipantsByType(
  stats: EventStats | null
): {
  individual: EventStatsTopParticipantRow[]
  duo: EventStatsTopParticipantRow[]
  group: EventStatsTopParticipantRow[]
} {
  const empty = {
    individual: [] as EventStatsTopParticipantRow[],
    duo: [] as EventStatsTopParticipantRow[],
    group: [] as EventStatsTopParticipantRow[],
  }
  if (!stats) return empty

  const direct = stats.topParticipantsByType
  if (
    direct &&
    Array.isArray(direct.individual) &&
    Array.isArray(direct.duo) &&
    Array.isArray(direct.group)
  ) {
    return {
      individual: direct.individual,
      duo: direct.duo,
      group: direct.group,
    }
  }

  const buckets = { ...empty }
  for (const p of stats.topParticipants || []) {
    const pt = normalizeParticipationTypeKey(p.participationType)
    if (pt === 'organization') continue
    if (pt !== 'individual' && pt !== 'duo' && pt !== 'group') continue
    buckets[pt].push({
      rank: 0,
      name: p.name,
      weight: p.weight,
      organization: p.organization || '',
      trashType: p.trashType || 'mixed',
      participationType: pt,
    })
  }
  ;(['individual', 'duo', 'group'] as const).forEach((k) => {
    buckets[k] = buckets[k]
      .sort((a, b) => b.weight - a.weight)
      .slice(0, 3)
      .map((r, i) => ({ ...r, rank: i + 1 }))
  })
  return buckets
}

export function resolveTopOrganizations(stats: EventStats | null): EventStatsTopOrganizationRow[] {
  if (!stats) return []
  if (stats.topOrganizations?.length) return stats.topOrganizations
  const rows = (stats.topParticipants || []).filter(
    (p) => normalizeParticipationTypeKey(p.participationType) === 'organization'
  )
  return rows.map((p) => ({
    name: p.name,
    weight: p.weight,
    participantCount: (p as { participantCount?: number }).participantCount ?? 1,
    participationType: 'organization',
  }))
}

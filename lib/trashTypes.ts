/**
 * Catálogo alineado con Precot (RegisterWeight.tsx en DOCE25/Precot).
 * Incluye entradas legacy para registros antiguos (plastic, glass, organic, mixed, other, common).
 */

export const TRASH_TYPE_FORM_OPTIONS = [
  {
    value: 'no-aplica',
    label: 'No Aplica. Bolsa de Basura con "Residuos Comunes". (Color ROJO)',
  },
  { value: 'abanico', label: 'Abanico' },
  { value: 'aires', label: 'Aires Acondicionados' },
  { value: 'aros', label: 'Aros de Neumáticos' },
  { value: 'cajas', label: 'Cajas o Palets de Madera/Plástico' },
  { value: 'contenedores', label: 'Contenedores o Barriles Grandes' },
  { value: 'escombros', label: 'Escombros de Construcción' },
  { value: 'estufa', label: 'Estufa' },
  { value: 'inodoro', label: 'Inodoro' },
  { value: 'lavadora', label: 'Lavadora y/o Secadora' },
  { value: 'llantas-camion', label: 'Llantas de camión' },
  { value: 'muebles', label: 'Muebles' },
  { value: 'neumaticos', label: 'Neumáticos' },
  { value: 'nevera', label: 'Nevera' },
  { value: 'piezas-construccion', label: 'Piezas de Construcción' },
  { value: 'piezas-vehiculo', label: 'Piezas de Vehículo' },
  { value: 'embarcaciones', label: 'Restos de Embarcaciones o Partes de Barcos' },
  { value: 'metal', label: 'Restos de Metal' },
  { value: 'madera', label: 'Restos de Madera' },
  { value: 'redes-pesca', label: 'Redes de Pesca' },
  { value: 'tuberias', label: 'Tuberías Metálicas o de PVC' },
  { value: 'vidrio-roto', label: 'Vidrio Roto en Grandes Fragmentos' },
  // Retrocompatibilidad
  { value: 'mixed', label: 'Mixto (registros anteriores)' },
  { value: 'plastic', label: 'Plástico (registros anteriores)' },
  { value: 'glass', label: 'Vidrio (registros anteriores)' },
  { value: 'organic', label: 'Orgánico (registros anteriores)' },
  { value: 'other', label: 'Otro (registros anteriores)' },
  { value: 'common', label: 'Residuos Comunes (registros anteriores)' },
] as const

export type TrashTypeId = (typeof TRASH_TYPE_FORM_OPTIONS)[number]['value']

export const TRASH_TYPE_ORDER: TrashTypeId[] = TRASH_TYPE_FORM_OPTIONS.map((o) => o.value)

const COLORS = [
  'bg-slate-500',
  'bg-blue-500',
  'bg-indigo-500',
  'bg-violet-500',
  'bg-fuchsia-500',
  'bg-pink-500',
  'bg-rose-500',
  'bg-orange-500',
  'bg-amber-500',
  'bg-yellow-500',
  'bg-lime-500',
  'bg-green-500',
  'bg-emerald-500',
  'bg-teal-500',
  'bg-cyan-500',
  'bg-sky-500',
  'bg-gray-500',
  'bg-stone-500',
  'bg-neutral-600',
  'bg-zinc-500',
  'bg-red-500',
  'bg-purple-500',
] as const

/** Barras de estadísticas (color de barra) — una fila por id de formulario */
export const TRASH_TYPE_STATS_ROWS: ReadonlyArray<{
  type: TrashTypeId
  label: string
  color: string
}> = TRASH_TYPE_FORM_OPTIONS.map((o, i) => ({
  type: o.value,
  label: o.label.length > 48 ? `${o.label.slice(0, 45)}…` : o.label,
  color: COLORS[i % COLORS.length],
}))

const LABEL_MAP: Record<string, string> = Object.fromEntries(
  TRASH_TYPE_FORM_OPTIONS.map((o) => [o.value, o.label])
)

export function getTrashTypeLabel(id: string | undefined | null): string {
  if (!id) return '—'
  return LABEL_MAP[id] ?? id
}

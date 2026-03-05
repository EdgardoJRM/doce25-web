'use client'

interface WeightRecord {
  weightRecordId: string
  weightCollected: number
  trashType: string
  trashBreakdown?: Record<string, number>
  timestamp: string
  registeredBy?: string
  registeredByName?: string
  notes?: string
}

interface WeightHistoryListProps {
  records: WeightRecord[]
  totalWeight: number
  tripCount: number
  isGroupHistory?: boolean
}

const TRASH_TYPE_EMOJI: Record<string, string> = {
  plastic: '🥤',
  metal: '🔩',
  glass: '🍾',
  organic: '🌱',
  mixed: '♻️',
  other: '📦',
}

export default function WeightHistoryList({
  records,
  totalWeight,
  tripCount,
  isGroupHistory = false,
}: WeightHistoryListProps) {
  if (records.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <div className="text-6xl mb-4">📊</div>
        <p className="text-gray-600">Aún no hay registros de peso</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <div className="bg-gradient-to-r from-cyan-600 to-teal-600 rounded-2xl shadow-xl p-6 text-white">
        <h3 className="text-xl font-bold mb-4">Resumen Total</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-3xl font-bold">{totalWeight.toFixed(1)} kg</div>
            <div className="text-cyan-100">Peso Total</div>
          </div>
          <div>
            <div className="text-3xl font-bold">{tripCount}</div>
            <div className="text-cyan-100">
              {tripCount === 1 ? 'Viaje' : 'Viajes'}
            </div>
          </div>
        </div>
      </div>

      {/* Records List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">
            Historial de Registros ({tripCount})
          </h3>
        </div>

        <div className="divide-y divide-gray-100">
          {records.map((record, index) => (
            <div key={record.weightRecordId} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">
                    {TRASH_TYPE_EMOJI[record.trashType] || '♻️'}
                  </div>
                  <div>
                    <div className="font-bold text-xl text-cyan-600">
                      {record.weightCollected.toFixed(1)} kg
                    </div>
                    <div className="text-sm text-gray-600 capitalize">
                      {record.trashType === 'mixed' ? 'Mixto' : record.trashType}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-700">
                    Viaje #{tripCount - index}
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(record.timestamp).toLocaleDateString('es-PR', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              </div>

              {/* Breakdown */}
              {record.trashBreakdown && Object.keys(record.trashBreakdown).length > 0 && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                  <div className="text-xs font-semibold text-gray-700 mb-2">Desglose:</div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {Object.entries(record.trashBreakdown).map(([type, weight]) => {
                      if (weight === 0) return null
                      return (
                        <div key={type} className="flex items-center gap-2 text-sm">
                          <span>{TRASH_TYPE_EMOJI[type] || '📦'}</span>
                          <span className="text-gray-700 capitalize">{type}:</span>
                          <span className="font-semibold text-gray-900">
                            {weight.toFixed(1)} kg
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Registered By (for group records) */}
              {isGroupHistory && record.registeredByName && (
                <div className="mt-2 text-xs text-gray-500">
                  Registrado por: <span className="font-semibold">{record.registeredByName}</span>
                </div>
              )}

              {/* Notes */}
              {record.notes && (
                <div className="mt-3 text-sm text-gray-600 italic">
                  Nota: {record.notes}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

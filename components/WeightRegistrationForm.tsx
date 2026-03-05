'use client'

import { useState } from 'react'
import { registerWeight, RegisterWeightData } from '@/lib/api'

interface WeightRegistrationFormProps {
  registrationId: string
  participantName: string
  onSuccess: () => void
  onCancel: () => void
  isGroupWeight?: boolean
  groupMembers?: Array<{ name: string; registrationId: string }>
  currentMemberName?: string
}

const TRASH_TYPES = [
  { value: 'plastic', label: '🥤 Plástico', emoji: '🥤' },
  { value: 'metal', label: '🔩 Metal', emoji: '🔩' },
  { value: 'glass', label: '🍾 Vidrio', emoji: '🍾' },
  { value: 'organic', label: '🌱 Orgánico', emoji: '🌱' },
  { value: 'mixed', label: '♻️ Mixto', emoji: '♻️' },
  { value: 'other', label: '📦 Otro', emoji: '📦' },
] as const

export default function WeightRegistrationForm({
  registrationId,
  participantName,
  onSuccess,
  onCancel,
  isGroupWeight = false,
  groupMembers = [],
  currentMemberName,
}: WeightRegistrationFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showBreakdown, setShowBreakdown] = useState(false)

  // Form data
  const [weightCollected, setWeightCollected] = useState('')
  const [trashType, setTrashType] = useState<RegisterWeightData['trashType']>('mixed')
  const [notes, setNotes] = useState('')

  // Breakdown
  const [plastic, setPlastic] = useState('')
  const [metal, setMetal] = useState('')
  const [glass, setGlass] = useState('')
  const [organic, setOrganic] = useState('')
  const [other, setOther] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const weight = parseFloat(weightCollected)

    // Validaciones
    if (!weight || weight <= 0) {
      setError('El peso debe ser mayor a 0 kg')
      return
    }

    if (weight > 500) {
      setError('El peso no puede exceder 500 kg')
      return
    }

    // Validar breakdown si está visible
    if (showBreakdown) {
      const breakdownSum =
        (parseFloat(plastic) || 0) +
        (parseFloat(metal) || 0) +
        (parseFloat(glass) || 0) +
        (parseFloat(organic) || 0) +
        (parseFloat(other) || 0)

      const maxAllowed = weight * 1.1 // 10% de margen

      if (breakdownSum > maxAllowed) {
        setError(`La suma del desglose (${breakdownSum.toFixed(2)} kg) no puede exceder el peso total + 10% (${maxAllowed.toFixed(2)} kg)`)
        return
      }
    }

    try {
      setLoading(true)

      const data: RegisterWeightData = {
        weightCollected: weight,
        trashType,
        notes: notes.trim(),
        registeredBy: 'staff', // TODO: Obtener del usuario logueado
      }

      // Agregar breakdown si se especificó
      if (showBreakdown) {
        data.trashBreakdown = {
          plastic: parseFloat(plastic) || 0,
          metal: parseFloat(metal) || 0,
          glass: parseFloat(glass) || 0,
          organic: parseFloat(organic) || 0,
          other: parseFloat(other) || 0,
        }
      }

      await registerWeight(registrationId, data)
      onSuccess()
    } catch (err: any) {
      setError(err.message || 'Error al registrar peso')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {isGroupWeight ? '⚖️ Registro de Peso Grupal' : '⚖️ Registrar Peso de Basura'}
        </h2>
        {isGroupWeight ? (
          <div>
            <p className="text-gray-600 mb-3">
              <strong>{currentMemberName || participantName}</strong> está registrando peso para
              todo el grupo
            </p>
            {groupMembers.length > 0 && (
              <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
                <div className="font-semibold text-cyan-900 mb-2">
                  Integrantes del grupo ({groupMembers.length}):
                </div>
                <div className="text-sm text-cyan-800 space-y-1">
                  {groupMembers.map((member) => (
                    <div key={member.registrationId}>• {member.name}</div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="text-gray-600">
            Participante: <span className="font-semibold text-gray-900">{participantName}</span>
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Peso Total */}
        <div>
          <label htmlFor="weight" className="block text-sm font-semibold text-gray-700 mb-2">
            Peso Total (kg) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="weight"
            step="0.1"
            min="0.1"
            max="500"
            value={weightCollected}
            onChange={(e) => setWeightCollected(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-lg"
            placeholder="Ej: 25.5"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Rango permitido: 0.1 - 500 kg
          </p>
        </div>

        {/* Tipo Principal */}
        <div>
          <label htmlFor="trashType" className="block text-sm font-semibold text-gray-700 mb-2">
            Tipo Principal de Basura <span className="text-red-500">*</span>
          </label>
          <select
            id="trashType"
            value={trashType}
            onChange={(e) => setTrashType(e.target.value as RegisterWeightData['trashType'])}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-lg"
            required
          >
            {TRASH_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Toggle Desglose Detallado */}
        <div>
          <button
            type="button"
            onClick={() => setShowBreakdown(!showBreakdown)}
            className="flex items-center gap-2 text-cyan-600 hover:text-cyan-700 font-semibold"
          >
            <svg
              className={`w-5 h-5 transform transition-transform ${showBreakdown ? 'rotate-90' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            {showBreakdown ? 'Ocultar' : 'Agregar'} desglose detallado (opcional)
          </button>
        </div>

        {/* Desglose Detallado */}
        {showBreakdown && (
          <div className="bg-gray-50 p-4 rounded-lg space-y-4">
            <p className="text-sm text-gray-600 mb-3">
              Especifica el peso por cada tipo de basura (la suma no debe exceder el peso total + 10%)
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  🥤 Plástico (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={plastic}
                  onChange={(e) => setPlastic(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  🔩 Metal (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={metal}
                  onChange={(e) => setMetal(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  🍾 Vidrio (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={glass}
                  onChange={(e) => setGlass(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  🌱 Orgánico (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={organic}
                  onChange={(e) => setOrganic(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                  placeholder="0"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  📦 Otro (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={other}
                  onChange={(e) => setOther(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                  placeholder="0"
                />
              </div>
            </div>

            {/* Suma del desglose */}
            {weightCollected && (
              <div className="bg-white p-3 rounded border border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Suma del desglose:</span>
                  <span className="font-semibold">
                    {(
                      (parseFloat(plastic) || 0) +
                      (parseFloat(metal) || 0) +
                      (parseFloat(glass) || 0) +
                      (parseFloat(organic) || 0) +
                      (parseFloat(other) || 0)
                    ).toFixed(2)} kg
                  </span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-gray-600">Peso total ingresado:</span>
                  <span className="font-semibold">{parseFloat(weightCollected).toFixed(2)} kg</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Notas */}
        <div>
          <label htmlFor="notes" className="block text-sm font-semibold text-gray-700 mb-2">
            Notas (opcional)
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            maxLength={500}
            rows={3}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            placeholder="Observaciones adicionales..."
          />
          <p className="text-xs text-gray-500 mt-1">
            {notes.length}/500 caracteres
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Botones */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-cyan-600 to-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Registrando...
              </span>
            ) : (
              '✓ Registrar Peso'
            )}
          </button>

          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}

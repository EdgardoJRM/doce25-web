'use client'

import { useState, useEffect } from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import { checkIn, updateCheckInGroup } from '@/lib/api'
import GroupFormation from '@/components/GroupFormation'
import WeightRegistrationForm from '@/components/WeightRegistrationForm'

type ViewMode = 'loading' | 'check-in-form' | 'already-checked' | 'success' | 'invalid' | 'weight-form'

export default function CheckInPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = params.token as string
  const fromScanner = searchParams.get('from') === 'scanner'

  const [viewMode, setViewMode] = useState<ViewMode>('loading')
  const [attendeeInfo, setAttendeeInfo] = useState<any>(null)
  const [countdown, setCountdown] = useState<number | null>(null)
  const [error, setError] = useState('')
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    performCheckIn()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  // Auto-redirect from scanner
  useEffect(() => {
    if (fromScanner && countdown === null && (viewMode === 'success' || viewMode === 'already-checked')) {
      setCountdown(3)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromScanner, viewMode])

  useEffect(() => {
    if (countdown !== null && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else if (countdown === 0) {
      router.push('/admin/scanner')
    }
  }, [countdown, router])

  async function performCheckIn() {
    try {
      const response = await checkIn(token)

      if (response.status === 'valid') {
        setAttendeeInfo(response.attendee)
        // New check-in - show form to select participation type
        setViewMode('check-in-form')
      } else if (response.status === 'already-checked') {
        setAttendeeInfo(response.registration)
        setViewMode('already-checked')
      } else {
        setViewMode('invalid')
      }
    } catch (err: any) {
      console.error('Check-in error:', err)
      setViewMode('invalid')
    }
  }

  const handleGroupFormationComplete = async (data: {
    participationType: 'individual' | 'duo' | 'group' | 'organization'
    groupMembers?: string[]
    eventOrganization?: string
  }) => {
    try {
      setProcessing(true)
      setError('')

      await updateCheckInGroup(attendeeInfo.registrationId, data)

      // Refresh attendee info
      const response = await checkIn(token)
      if (response.status === 'already-checked') {
        setAttendeeInfo(response.registration)
      }

      setViewMode('success')
    } catch (err: any) {
      setError(err.message || 'Error al actualizar grupo')
      setProcessing(false)
    }
  }

  const handleWeightSuccess = () => {
    if (fromScanner) {
      router.push('/admin/scanner')
    } else {
      setViewMode('success')
    }
  }

  // Loading state
  if (viewMode === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando código...</p>
        </div>
      </div>
    )
  }

  // Invalid code
  if (viewMode === 'invalid') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 to-blue-50 px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold mb-4 text-red-600">Código Inválido</h1>
          <p className="text-gray-600 mb-6">
            El código QR no es válido o ha expirado. Por favor, contacta con el organizador del
            evento.
          </p>
          {fromScanner && (
            <button
              onClick={() => router.push('/admin/scanner')}
              className="px-6 py-3 bg-cyan-600 text-white rounded-lg font-semibold hover:bg-cyan-700"
            >
              Volver al Scanner
            </button>
          )}
        </div>
      </div>
    )
  }

  // Check-in form (first time)
  if (viewMode === 'check-in-form' && attendeeInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="text-5xl">✅</div>
              <div>
                <h1 className="text-2xl font-bold text-green-600">Check-in Exitoso</h1>
                <p className="text-gray-600">Bienvenido, {attendeeInfo.name}!</p>
              </div>
            </div>

            {attendeeInfo.organization && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-blue-900 text-sm">
                  <strong>Organización en registro:</strong> {attendeeInfo.organization}
                </p>
                <p className="text-blue-700 text-xs mt-1">
                  ¿Vienes con tu organización hoy? Selecciona &quot;Organización&quot; abajo
                </p>
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {processing ? (
            <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Guardando...</p>
            </div>
          ) : (
            <GroupFormation
              currentRegistrationId={attendeeInfo.registrationId}
              currentName={attendeeInfo.name}
              eventId={attendeeInfo.eventId}
              onComplete={handleGroupFormationComplete}
            />
          )}
        </div>
      </div>
    )
  }

  // Already checked in
  if (viewMode === 'already-checked' && attendeeInfo) {
    const hasGroup = attendeeInfo.groupId
    const isIndividual = attendeeInfo.participationType === 'individual' || !attendeeInfo.participationType

    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">⚠️</div>
              <h1 className="text-2xl font-bold mb-2 text-yellow-600">Ya Registrado</h1>
              <p className="text-gray-600">Ya realizaste check-in anteriormente</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h3 className="font-semibold text-gray-900 mb-4">Información del Participante</h3>
              <div className="space-y-2 text-sm">
                <p>
                  <strong>Nombre:</strong> {attendeeInfo.name}
                </p>
                <p>
                  <strong>Email:</strong> {attendeeInfo.email}
                </p>
                {attendeeInfo.checkedInAt && (
                  <p>
                    <strong>Check-in:</strong>{' '}
                    {new Date(attendeeInfo.checkedInAt).toLocaleString('es-MX')}
                  </p>
                )}
                <p>
                  <strong>Tipo:</strong>{' '}
                  <span className="capitalize">
                    {attendeeInfo.participationType || 'Individual'}
                  </span>
                </p>
                {attendeeInfo.eventOrganization && (
                  <p>
                    <strong>Organización:</strong> {attendeeInfo.eventOrganization}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => setViewMode('weight-form')}
                className="px-6 py-4 bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                ⚖️ Registrar Peso
              </button>

              {fromScanner && (
                <button
                  onClick={() => router.push('/admin/scanner')}
                  className="px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50"
                >
                  Volver al Scanner
                </button>
              )}
            </div>

            {fromScanner && countdown !== null && (
              <p className="text-center text-sm text-gray-500 mt-4">
                Regresando al scanner en {countdown} segundo{countdown !== 1 ? 's' : ''}...
              </p>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Weight registration form
  if (viewMode === 'weight-form' && attendeeInfo) {
    const isGroupWeight = !!attendeeInfo.groupId
    const groupMembers = attendeeInfo.groupMembers || []

    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setViewMode('already-checked')}
            className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver
          </button>

          <WeightRegistrationForm
            registrationId={attendeeInfo.registrationId}
            participantName={attendeeInfo.name}
            onSuccess={handleWeightSuccess}
            onCancel={() => setViewMode('already-checked')}
            isGroupWeight={isGroupWeight}
            groupMembers={groupMembers.map((id: string) => ({ registrationId: id, name: 'Miembro' }))}
            currentMemberName={attendeeInfo.name}
          />
        </div>
      </div>
    )
  }

  // Success state
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 to-blue-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
        <div className="text-6xl mb-4">✅</div>
        <h1 className="text-2xl font-bold mb-4 text-green-600">¡Completado!</h1>
        <p className="text-gray-600 mb-6">Check-in registrado correctamente</p>

        {fromScanner ? (
          <div>
            {countdown !== null && (
              <p className="text-sm text-gray-500 mb-3">
                Regresando al scanner en {countdown} segundo{countdown !== 1 ? 's' : ''}...
              </p>
            )}
            <button
              onClick={() => router.push('/admin/scanner')}
              className="px-6 py-3 bg-cyan-600 text-white rounded-lg font-semibold hover:bg-cyan-700"
            >
              Volver al Scanner
            </button>
          </div>
        ) : (
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-cyan-600 text-white rounded-lg font-semibold hover:bg-cyan-700"
          >
            Ir al Inicio
          </button>
        )}
      </div>
    </div>
  )
}

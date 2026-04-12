'use client'

import { useState, useEffect, useMemo } from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import { checkIn, updateCheckInGroup, getGroupInfo } from '@/lib/api'
import GroupFormation from '@/components/GroupFormation'
import WeightRegistrationForm from '@/components/WeightRegistrationForm'

type ViewMode = 'loading' | 'check-in-form' | 'success' | 'invalid' | 'weight-form'

export default function CheckInPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = params.token as string
  const fromScanner = searchParams.get('from') === 'scanner'

  const [viewMode, setViewMode] = useState<ViewMode>('loading')
  const [attendeeInfo, setAttendeeInfo] = useState<any>(null)
  const [groupInfo, setGroupInfo] = useState<any>(null)
  const [countdown, setCountdown] = useState<number | null>(null)
  const [error, setError] = useState('')
  const [processing, setProcessing] = useState(false)
  /** first = primer check-in; edit = cambiar tipo desde formulario de peso */
  const [groupFormationIntent, setGroupFormationIntent] = useState<'first' | 'edit'>('first')

  useEffect(() => {
    performCheckIn()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  // Auto-redirect from scanner (only on success, not when going to weight form)
  useEffect(() => {
    if (fromScanner && countdown === null && viewMode === 'success') {
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
        
        // Si es un participante de grupo, obtener información del grupo
        if (response.registration.groupId) {
          try {
            const group = await getGroupInfo(response.registration.groupId)
            setGroupInfo(group)
          } catch (err) {
            console.error('Error obteniendo info del grupo:', err)
          }
        }
        
        // Go directly to weight form instead of showing options
        setViewMode('weight-form')
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
        if (response.registration.groupId) {
          try {
            const group = await getGroupInfo(response.registration.groupId)
            setGroupInfo(group)
          } catch (err) {
            console.error('Error obteniendo info del grupo:', err)
            setGroupInfo(null)
          }
        } else {
          setGroupInfo(null)
        }
      }

      if (groupFormationIntent === 'edit') {
        setGroupFormationIntent('first')
        setViewMode('weight-form')
      } else {
        setViewMode('success')
      }
    } catch (err: any) {
      setError(err.message || 'Error al actualizar grupo')
    } finally {
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

  const initialGroupMembersForEdit = useMemo(() => {
    if (!attendeeInfo?.groupMembers?.length) return undefined
    const members = groupInfo?.members || []
    const leaderId = attendeeInfo.groupLeaderId || attendeeInfo.registrationId
    return attendeeInfo.groupMembers
      .filter((id: string) => id !== leaderId)
      .map((id: string) => {
        const m = members.find((x: { registrationId: string }) => x.registrationId === id)
        return {
          registrationId: id,
          name: m?.name || 'Integrante',
          email: m?.email || '',
        }
      })
  }, [attendeeInfo, groupInfo])

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

  // Check-in form (first time) o edición de tipo de participación
  if (viewMode === 'check-in-form' && attendeeInfo) {
    const isEditParticipation = groupFormationIntent === 'edit'
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="text-5xl">{isEditParticipation ? '✏️' : '✅'}</div>
              <div>
                <h1 className="text-2xl font-bold text-green-600">
                  {isEditParticipation ? 'Cambiar participación' : 'Check-in Exitoso'}
                </h1>
                <p className="text-gray-600">
                  {isEditParticipation
                    ? `${attendeeInfo.name} — elige el tipo correcto y confirma`
                    : `Bienvenido, ${attendeeInfo.name}!`}
                </p>
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
              currentOrganization={attendeeInfo.organization}
              eventId={attendeeInfo.eventId}
              editMode={isEditParticipation}
              initialParticipationType={
                isEditParticipation
                  ? (attendeeInfo.participationType as
                      | 'individual'
                      | 'duo'
                      | 'group'
                      | 'organization') || 'individual'
                  : undefined
              }
              initialEventOrganization={isEditParticipation ? attendeeInfo.eventOrganization : undefined}
              initialGroupMembers={isEditParticipation ? initialGroupMembersForEdit : undefined}
              onComplete={handleGroupFormationComplete}
              onCancel={
                isEditParticipation
                  ? () => {
                      setGroupFormationIntent('first')
                      setViewMode('weight-form')
                    }
                  : undefined
              }
            />
          )}
        </div>
      </div>
    )
  }

  // Weight registration form
  if (viewMode === 'weight-form' && attendeeInfo) {
    const isGroupWeight =
      !!attendeeInfo.groupId && attendeeInfo.participationType !== 'organization'
    const groupMembers = groupInfo?.members || attendeeInfo.groupMembers || []

    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {fromScanner && (
            <button
              onClick={() => router.push('/admin/scanner')}
              className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Volver al Scanner
            </button>
          )}

          <div className="mb-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => {
                setGroupFormationIntent('edit')
                setViewMode('check-in-form')
              }}
              className="px-4 py-2 border-2 border-amber-500 text-amber-800 rounded-lg font-semibold hover:bg-amber-50 text-sm"
            >
              Cambiar tipo de participación
            </button>
          </div>

          <WeightRegistrationForm
            registrationId={attendeeInfo.registrationId}
            participantName={attendeeInfo.name}
            participationType={attendeeInfo.participationType ?? undefined}
            onSuccess={handleWeightSuccess}
            onCancel={() => fromScanner ? router.push('/admin/scanner') : router.push('/')}
            isGroupWeight={isGroupWeight}
            groupMembers={groupMembers.map((member: any) => ({ 
              registrationId: member.registrationId || member, 
              name: member.name || 'Miembro' 
            }))}
            currentMemberName={attendeeInfo.name}
            eventOrganization={attendeeInfo.eventOrganization}
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

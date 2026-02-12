'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { checkIn } from '@/lib/api'

export default function CheckInPage() {
  const params = useParams()
  const token = params.token as string
  const [status, setStatus] = useState<'loading' | 'valid' | 'invalid' | 'already-checked'>('loading')
  const [attendeeInfo, setAttendeeInfo] = useState<any>(null)

  useEffect(() => {
    async function performCheckIn() {
      try {
        const response = await checkIn(token)
        
        if (response.status === 'valid') {
          setStatus('valid')
          setAttendeeInfo(response.attendee)
        } else if (response.status === 'already-checked') {
          setStatus('already-checked')
          setAttendeeInfo(response.registration)
        } else if (response.status === 'invalid') {
          setStatus('invalid')
        }
      } catch (err: any) {
        console.error('Check-in error:', err)
        setStatus('invalid')
      }
    }
    
    performCheckIn()
  }, [token])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando código...</p>
        </div>
      </div>
    )
  }

  if (status === 'invalid') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold mb-4 text-red-600">Código Inválido</h1>
          <p className="text-gray-600">
            El código QR no es válido o ha expirado. Por favor, contacta con el organizador del evento.
          </p>
        </div>
      </div>
    )
  }

  if (status === 'already-checked') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold mb-4 text-yellow-600">Ya Registrado</h1>
          {attendeeInfo && (
            <div className="text-left bg-gray-50 p-4 rounded-lg mb-4">
              <p className="text-gray-700">
                <strong>Nombre:</strong> {attendeeInfo.name}
              </p>
              {attendeeInfo.checkedInAt && (
                <p className="text-gray-700">
                  <strong>Check-in previo:</strong>{' '}
                  {new Date(attendeeInfo.checkedInAt).toLocaleString('es-MX')}
                </p>
              )}
            </div>
          )}
          <p className="text-gray-600">
            Este código ya fue utilizado para el check-in anteriormente.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
        <div className="text-6xl mb-4">✅</div>
        <h1 className="text-2xl font-bold mb-4 text-green-600">¡Check-in Exitoso!</h1>
        {attendeeInfo && (
          <div className="text-left bg-gray-50 p-4 rounded-lg mb-4">
            <p className="text-gray-700 mb-2">
              <strong>Nombre:</strong> {attendeeInfo.name}
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Email:</strong> {attendeeInfo.email}
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Evento:</strong> {attendeeInfo.eventName}
            </p>
            {attendeeInfo.eventDate && (
              <p className="text-gray-700 mb-2">
                <strong>Fecha:</strong> {new Date(attendeeInfo.eventDate).toLocaleDateString('es-MX')}
              </p>
            )}
            <p className="text-gray-700 text-sm mt-3">
              <strong>Registrado:</strong> {new Date(attendeeInfo.checkedInAt).toLocaleString('es-MX')}
            </p>
          </div>
        )}
        <p className="text-gray-600 text-lg">
          ¡Bienvenido al evento! Disfruta de la experiencia 🎉
        </p>
      </div>
    </div>
  )
}


'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getEventById, getEventByShortId } from '@/lib/api'

export default function EventShortLinkPage() {
  const params = useParams()
  const router = useRouter()
  const eventId = params.eventId as string
  const [error, setError] = useState(false)

  useEffect(() => {
    async function redirectToEvent() {
      try {
        // Intentar obtener el evento por shortId/shortCode primero
        let event
        try {
          event = await getEventByShortId(eventId)
        } catch (shortIdError) {
          // Si falla, intentar por eventId
          try {
            event = await getEventById(eventId)
          } catch (idError) {
            throw new Error('Evento no encontrado')
          }
        }
        
        if (event && event.slug) {
          router.replace(`/eventos/${event.slug}`)
        } else if (event && event.eventId) {
          router.replace(`/eventos/${event.eventId}`)
        } else {
          setError(true)
        }
      } catch (err) {
        console.error('Error fetching event:', err)
        setError(true)
      }
    }

    redirectToEvent()
  }, [eventId, router])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold mb-4 text-red-600">Evento No Encontrado</h1>
          <p className="text-gray-600 mb-6">
            El evento que buscas no existe o ha sido eliminado.
          </p>
          <a
            href="/eventos"
            className="inline-block bg-cyan-600 text-white px-6 py-3 rounded-lg hover:bg-cyan-700 transition"
          >
            Ver Todos los Eventos
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirigiendo al evento...</p>
      </div>
    </div>
  )
}

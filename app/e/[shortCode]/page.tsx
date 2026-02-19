'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

export default function ShortLinkPage() {
  const params = useParams()
  const router = useRouter()
  const shortCode = params.shortCode as string
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://moo5jpvl56.execute-api.us-east-1.amazonaws.com/prod'
        const response = await fetch(`${apiUrl}/events/shortcode/${shortCode}`)
        
        if (!response.ok) {
          if (response.status === 404) {
            setError('Evento no encontrado')
          } else {
            setError('Error al cargar el evento')
          }
          setLoading(false)
          return
        }

        const data = await response.json()
        if (data.event && data.event.slug) {
          // Redirigir al evento usando el slug
          router.replace(`/eventos/${data.event.slug}`)
        } else {
          setError('Evento no encontrado')
          setLoading(false)
        }
      } catch (err: any) {
        console.error('Error fetching event:', err)
        setError('Error al cargar el evento')
        setLoading(false)
      }
    }

    if (shortCode) {
      fetchEvent()
    }
  }, [shortCode, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando evento...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold mb-4 text-red-600">Error</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <a
            href="/eventos"
            className="inline-block bg-cyan-600 text-white px-6 py-3 rounded-lg hover:bg-cyan-700 transition"
          >
            Ver todos los eventos
          </a>
        </div>
      </div>
    )
  }

  return null
}


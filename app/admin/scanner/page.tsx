'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Html5Qrcode } from 'html5-qrcode'
import { searchRegistrations, SearchResult } from '@/lib/api'
import WeightRegistrationForm from '@/components/WeightRegistrationForm'
import { useCameraPermission } from '@/hooks/useCameraPermission'

type Mode = 'scanner' | 'search' | 'weight'

const DEFAULT_EVENT_ID = 'ea44d757-de19-4a13-aa9f-afbf0da433f2'

export default function ScannerPage() {
  const router = useRouter()
  const { permissionStatus, cachePermissionGranted, cachePermissionDenied } = useCameraPermission()
  const [mode, setMode] = useState<Mode>('scanner')
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState('')
  const [lastScan, setLastScan] = useState('')
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const isRunningRef = useRef(false)

  // Search mode states
  const [eventId, setEventId] = useState(DEFAULT_EVENT_ID)
  const [searchQuery, setSearchQuery] = useState('')
  const [searching, setSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [selectedParticipant, setSelectedParticipant] = useState<SearchResult | null>(null)

  useEffect(() => {
    const scanner = new Html5Qrcode('qr-reader')
    scannerRef.current = scanner

    const startScanner = async () => {
      // Evitar iniciar si ya está corriendo
      if (isRunningRef.current) return
      
      // Si el permiso fue denegado previamente, no intentar de nuevo
      if (permissionStatus === 'denied') {
        setError('Permiso de cámara denegado. Por favor, habilita el acceso a la cámara en la configuración del navegador.')
        return
      }
      
      try {
        setIsScanning(true)
        setError('')
        isRunningRef.current = true
        
        await scanner.start(
          { facingMode: 'environment' }, // Cámara trasera
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          async (decodedText) => {
            // Extraer el token del URL escaneado
            try {
              const url = new URL(decodedText)
              const pathParts = url.pathname.split('/')
              const token = pathParts[pathParts.length - 1]
              
              if (token && token !== lastScan && isRunningRef.current) {
                setLastScan(token)
                isRunningRef.current = false
                
                // Detener el escáner antes de navegar
                try {
                  await scanner.stop()
                } catch (stopErr: any) {
                  // Ignorar error si el scanner ya está detenido
                  if (!stopErr.message?.includes('not running')) {
                    console.error('Error stopping scanner:', stopErr)
                  }
                }
                
                router.push(`/checkin/${token}?from=scanner`)
              }
            } catch {
              // Si no es un URL válido, asumir que es el token directamente
              if (decodedText && decodedText !== lastScan && isRunningRef.current) {
                setLastScan(decodedText)
                isRunningRef.current = false
                
                try {
                  await scanner.stop()
                } catch (stopErr: any) {
                  // Ignorar error si el scanner ya está detenido
                  if (!stopErr.message?.includes('not running')) {
                    console.error('Error stopping scanner:', stopErr)
                  }
                }
                
                router.push(`/checkin/${decodedText}?from=scanner`)
              }
            }
          },
          (errorMessage) => {
            // Ignorar errores de escaneo (son normales cuando no hay QR visible)
          }
        )
        
        // Cache successful permission grant
        cachePermissionGranted()
      } catch (err: any) {
        console.error('Scanner error:', err)
        
        // Detect permission denied error
        if (err.name === 'NotAllowedError' || err.message?.includes('Permission denied')) {
          cachePermissionDenied()
          setError('Permiso de cámara denegado. Por favor, habilita el acceso a la cámara en la configuración del navegador.')
        } else if (err.name === 'NotFoundError') {
          setError('No se encontró ningún dispositivo de cámara en este dispositivo.')
        } else if (err.name === 'NotReadableError') {
          setError('La cámara está siendo utilizada por otra aplicación.')
        } else {
          setError('Error al iniciar la cámara. Asegúrate de haber dado permisos.')
        }
        
        setIsScanning(false)
        isRunningRef.current = false
      }
    }

    startScanner()

    return () => {
      if (scannerRef.current && isRunningRef.current) {
        isRunningRef.current = false
        scannerRef.current.stop().catch((err: any) => {
          // Ignorar error si el scanner ya está detenido
          if (!err.message?.includes('not running') && !err.message?.includes('not paused')) {
            console.error('Error stopping scanner on cleanup:', err)
          }
        })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, mode])

  // Detener scanner cuando cambiamos de modo
  useEffect(() => {
    if (mode !== 'scanner' && scannerRef.current && isRunningRef.current) {
      isRunningRef.current = false
      scannerRef.current.stop().catch((err: any) => {
        if (!err.message?.includes('not running') && !err.message?.includes('not paused')) {
          console.error('Error stopping scanner:', err)
        }
      })
    }
  }, [mode])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!eventId.trim()) {
      setError('Por favor ingresa el ID del evento')
      return
    }

    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      setError('Ingresa al menos 2 caracteres para buscar')
      return
    }

    try {
      setSearching(true)
      const data = await searchRegistrations(eventId.trim(), searchQuery.trim())
      setSearchResults(data.results)

      if (data.results.length === 0) {
        setError('No se encontraron participantes con ese criterio')
      }
    } catch (err: any) {
      setError(err.message || 'Error al buscar participantes')
      setSearchResults([])
    } finally {
      setSearching(false)
    }
  }

  const handleSelectParticipant = (participant: SearchResult) => {
    if (!participant.checkedIn) {
      setError('El participante debe hacer check-in primero antes de registrar peso')
      return
    }

    setSelectedParticipant(participant)
    setMode('weight')
  }

  const handleWeightSuccess = () => {
    setMode('search')
    setSelectedParticipant(null)
    setSearchQuery('')
    setSearchResults([])
    setError('')
  }

  const handleWeightCancel = () => {
    setMode('search')
    setSelectedParticipant(null)
  }

  // Weight registration mode
  if (mode === 'weight' && selectedParticipant) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={handleWeightCancel}
            className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver a búsqueda
          </button>

          <WeightRegistrationForm
            registrationId={selectedParticipant.registrationId}
            participantName={selectedParticipant.name}
            onSuccess={handleWeightSuccess}
            onCancel={handleWeightCancel}
          />
        </div>
      </div>
    )
  }

  // Search mode
  if (mode === 'search') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Mode Toggle */}
          <div className="mb-6 flex gap-3">
            <button
              onClick={() => setMode('scanner')}
              className="px-4 py-2 border-2 border-cyan-600 text-cyan-600 rounded-lg font-semibold hover:bg-cyan-50 transition-colors"
            >
              📱 Escanear QR
            </button>
            <button
              onClick={() => router.push(`/admin/asistentes/${DEFAULT_EVENT_ID}`)}
              className="px-4 py-2 bg-cyan-600 text-white rounded-lg font-semibold"
            >
              👥 Ver Participantes
            </button>
          </div>

          {/* Header */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              🔍 Búsqueda Manual - Registro de Peso
            </h1>
            <p className="text-gray-600">
              Busca al participante por nombre, email u organización para registrar su peso
            </p>
          </div>

          {/* Search Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <form onSubmit={handleSearch} className="space-y-4">
              <div>
                <label htmlFor="eventId" className="block text-sm font-semibold text-gray-700 mb-2">
                  ID del Evento <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="eventId"
                  value={eventId}
                  onChange={(e) => setEventId(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  placeholder="Ej: ea44d757-de19-4a13-aa9f-afbf0da433f2"
                  required
                />
              </div>

              <div>
                <label htmlFor="search" className="block text-sm font-semibold text-gray-700 mb-2">
                  Buscar Participante <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  placeholder="Nombre, email u organización..."
                  minLength={2}
                  required
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={searching}
                className="w-full bg-gradient-to-r from-cyan-600 to-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"
              >
                {searching ? 'Buscando...' : '🔍 Buscar Participante'}
              </button>
            </form>
          </div>

          {/* Results */}
          {searchResults.length > 0 && (
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Resultados ({searchResults.length})
              </h2>

              <div className="space-y-3">
                {searchResults.map((participant) => (
                  <div
                    key={participant.registrationId}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {participant.name}
                        </h3>
                        <p className="text-sm text-gray-600">{participant.email}</p>
                        {participant.organization && (
                          <p className="text-sm text-gray-500 mt-1">
                            🏢 {participant.organization}
                          </p>
                        )}

                        <div className="flex gap-2 mt-2">
                          {participant.checkedIn ? (
                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                              ✓ Check-in
                            </span>
                          ) : (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold">
                              ⚠️ Sin check-in
                            </span>
                          )}

                          {participant.checkedOut ? (
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                              ✓ Peso: {participant.weightCollected} kg
                            </span>
                          ) : (
                            <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">
                              Peso pendiente
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => handleSelectParticipant(participant)}
                        disabled={!participant.checkedIn}
                        className="ml-4 px-4 py-2 bg-cyan-600 text-white rounded-lg font-semibold hover:bg-cyan-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {participant.checkedOut ? 'Ver/Editar' : 'Registrar Peso'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Scanner mode (default)
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Mode Toggle */}
        <div className="mb-6 flex gap-3">
          <button
            onClick={() => setMode('scanner')}
            className="px-4 py-2 bg-cyan-600 text-white rounded-lg font-semibold"
          >
            📱 Escanear QR
          </button>
          <button
            onClick={() => router.push(`/admin/asistentes/${DEFAULT_EVENT_ID}`)}
            className="px-4 py-2 border-2 border-cyan-600 text-cyan-600 rounded-lg font-semibold hover:bg-cyan-50 transition-colors"
          >
            👥 Ver Participantes
          </button>
        </div>

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Escáner QR - Check-in</h1>
          <p className="text-gray-600">
            Apunta la cámara al código QR del asistente para realizar el check-in
          </p>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div id="qr-reader" className="w-full aspect-square bg-black"></div>
          
          <div className="p-6">
            <div className="flex items-center justify-center space-x-2">
              {isScanning ? (
                <>
                  <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-600 font-medium">Escaneando...</span>
                </>
              ) : (
                <>
                  <div className="h-3 w-3 bg-gray-300 rounded-full"></div>
                  <span className="text-gray-500">Cámara detenida</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">Instrucciones:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Asegúrate de tener buena iluminación</li>
            <li>• Mantén el código QR dentro del recuadro</li>
            <li>• El check-in se procesará automáticamente al escanear</li>
            <li>• Si ya se hizo check-in, verás una notificación</li>
          </ul>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => router.push('/admin/eventos')}
            className="text-blue-600 hover:underline"
          >
            ← Volver a Eventos
          </button>
        </div>
      </div>
    </div>
  )
}

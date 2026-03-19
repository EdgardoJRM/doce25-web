'use client'

import { useState, useRef, useEffect } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import { useCameraPermission } from '@/hooks/useCameraPermission'

interface GroupFormationProps {
  currentRegistrationId: string
  currentName: string
  eventId: string
  onComplete: (data: {
    participationType: 'individual' | 'duo' | 'group' | 'organization'
    groupMembers?: string[]
    eventOrganization?: string
  }) => void
  onCancel?: () => void
}

interface ScannedMember {
  registrationId: string
  name: string
  email: string
}

export default function GroupFormation({
  currentRegistrationId,
  currentName,
  eventId,
  onComplete,
  onCancel,
}: GroupFormationProps) {
  const { permissionStatus, cachePermissionGranted, cachePermissionDenied } = useCameraPermission()
  const [selectedType, setSelectedType] = useState<
    'individual' | 'duo' | 'group' | 'organization' | null
  >(null)
  const [scannedMembers, setScannedMembers] = useState<ScannedMember[]>([])
  const [isScanning, setIsScanning] = useState(false)
  const [scanError, setScanError] = useState('')
  const [orgName, setOrgName] = useState('')
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const isRunningRef = useRef(false)

  const lastScannedRef = useRef<string>('')
  const scanTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    return () => {
      if (scannerRef.current && isRunningRef.current) {
        isRunningRef.current = false
        scannerRef.current.stop().catch(() => {})
      }
      if (scanTimeoutRef.current) {
        clearTimeout(scanTimeoutRef.current)
      }
    }
  }, [])

  const startScanning = async () => {
    if (isRunningRef.current) return

    // Si el permiso fue denegado previamente, no intentar de nuevo
    if (permissionStatus === 'denied') {
      setScanError('Permiso de cámara denegado. Por favor, habilita el acceso a la cámara en la configuración del navegador.')
      return
    }

    try {
      setIsScanning(true)
      setScanError('')
      isRunningRef.current = true

      // Esperar a que el elemento se renderice en el DOM
      await new Promise(resolve => setTimeout(resolve, 100))

      // Verificar que el elemento existe
      const element = document.getElementById('group-qr-reader')
      if (!element) {
        throw new Error('El elemento del scanner no se encontró en el DOM')
      }

      const scanner = new Html5Qrcode('group-qr-reader')
      scannerRef.current = scanner

      await scanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        async (decodedText) => {
          try {
            const url = new URL(decodedText)
            const pathParts = url.pathname.split('/')
            const token = pathParts[pathParts.length - 1]
            await handleQRScanned(token)
          } catch {
            await handleQRScanned(decodedText)
          }
        },
        () => {}
      )
      
      // Cache successful permission grant
      cachePermissionGranted()
    } catch (err: any) {
      console.error('Scanner error:', err)
      
      // Detect permission denied error
      if (err.name === 'NotAllowedError' || err.message?.includes('Permission denied')) {
        cachePermissionDenied()
        setScanError('Permiso de cámara denegado. Por favor, habilita el acceso a la cámara en la configuración del navegador.')
      } else if (err.name === 'NotFoundError') {
        setScanError('No se encontró ningún dispositivo de cámara en este dispositivo.')
      } else if (err.name === 'NotReadableError') {
        setScanError('La cámara está siendo utilizada por otra aplicación.')
      } else if (err.message?.includes('no se encontró')) {
        setScanError('Error: El elemento del scanner no se pudo inicializar. Intenta de nuevo.')
      } else {
        setScanError(`Error al iniciar cámara: ${err.message || 'Verifica los permisos.'}`)
      }
      
      setIsScanning(false)
      isRunningRef.current = false
    }
  }

  const stopScanning = async () => {
    if (scannerRef.current && isRunningRef.current) {
      isRunningRef.current = false
      try {
        await scannerRef.current.stop()
      } catch (err) {
        console.error('Error stopping scanner:', err)
      }
      setIsScanning(false)
    }
  }

  const handleQRScanned = async (token: string) => {
    // Evitar procesar el mismo QR múltiples veces en corto tiempo
    if (lastScannedRef.current === token) {
      return
    }

    // Validar límite según tipo de participación
    const maxMembers = selectedType === 'duo' ? 1 : selectedType === 'group' ? 2 : 0
    if (selectedType && (selectedType === 'duo' || selectedType === 'group') && scannedMembers.length >= maxMembers) {
      setScanError(
        selectedType === 'duo'
          ? 'Ya has agregado 1 persona. Un duo solo puede tener 2 personas (tú + 1)'
          : 'Ya has agregado 2 personas. Un grupo puede tener máximo 3 personas (tú + 2)'
      )
      return
    }

    lastScannedRef.current = token

    // Limpiar el timeout anterior si existe
    if (scanTimeoutRef.current) {
      clearTimeout(scanTimeoutRef.current)
    }

    // Resetear el último escaneo después de 1 segundo para permitir escanear el mismo QR de nuevo
    scanTimeoutRef.current = setTimeout(() => {
      lastScannedRef.current = ''
    }, 1000)

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/checkin/${token}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        }
      )

      const data = await response.json()

      if (data.status === 'valid' || data.status === 'already-checked') {
        const attendee = data.attendee || data.registration
        const regId = attendee.registrationId

        if (regId === currentRegistrationId) {
          setScanError('No puedes escanearte a ti mismo')
          return
        }

        if (scannedMembers.some((m) => m.registrationId === regId)) {
          setScanError('Este participante ya fue agregado')
          return
        }

        setScannedMembers((prev) => [
          ...prev,
          {
            registrationId: regId,
            name: attendee.name,
            email: attendee.email,
          },
        ])
        setScanError('')
      } else {
        setScanError('QR inválido o participante sin check-in')
      }
    } catch (err: any) {
      setScanError('Error al verificar QR: ' + err.message)
    }
  }

  const removeMember = (registrationId: string) => {
    setScannedMembers((prev) => prev.filter((m) => m.registrationId !== registrationId))
  }

  const handleComplete = () => {
    if (!selectedType) return

    if (selectedType === 'individual') {
      onComplete({ participationType: 'individual' })
      return
    }

    if (selectedType === 'organization') {
      if (!orgName.trim()) {
        setScanError('Ingresa el nombre de la organización')
        return
      }
      onComplete({
        participationType: 'organization',
        eventOrganization: orgName.trim(),
      })
      return
    }

    if (selectedType === 'duo' || selectedType === 'group') {
      if (scannedMembers.length === 0) {
        setScanError('Escanea al menos un integrante')
        return
      }

      if (selectedType === 'duo' && scannedMembers.length > 1) {
        setScanError('Un duo solo puede tener 2 personas (tú + 1)')
        return
      }

      onComplete({
        participationType: selectedType,
        groupMembers: scannedMembers.map((m) => m.registrationId),
      })
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Tipo de Participación</h2>

      {!selectedType ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => setSelectedType('individual')}
            className="p-6 border-2 border-gray-300 rounded-xl hover:border-cyan-600 hover:bg-cyan-50 transition-all text-left"
          >
            <div className="text-3xl mb-2">👤</div>
            <div className="font-bold text-lg text-gray-900">Individual</div>
            <div className="text-sm text-gray-600">Participo solo</div>
          </button>

          <button
            onClick={() => {
              setSelectedType('duo')
              setTimeout(() => startScanning(), 100)
            }}
            className="p-6 border-2 border-gray-300 rounded-xl hover:border-cyan-600 hover:bg-cyan-50 transition-all text-left"
          >
            <div className="text-3xl mb-2">👥</div>
            <div className="font-bold text-lg text-gray-900">Duo</div>
            <div className="text-sm text-gray-600">Vengo con 1 persona</div>
          </button>

          <button
            onClick={() => {
              setSelectedType('group')
              setTimeout(() => startScanning(), 100)
            }}
            className="p-6 border-2 border-gray-300 rounded-xl hover:border-cyan-600 hover:bg-cyan-50 transition-all text-left"
          >
            <div className="text-3xl mb-2">👨‍👩‍👧</div>
            <div className="font-bold text-lg text-gray-900">Grupo (3+)</div>
            <div className="text-sm text-gray-600">Vengo con 2+ personas</div>
          </button>

          <button
            onClick={() => setSelectedType('organization')}
            className="p-6 border-2 border-gray-300 rounded-xl hover:border-cyan-600 hover:bg-cyan-50 transition-all text-left"
          >
            <div className="text-3xl mb-2">🏢</div>
            <div className="font-bold text-lg text-gray-900">Organización</div>
            <div className="text-sm text-gray-600">Vengo con mi org</div>
          </button>
        </div>
      ) : selectedType === 'individual' ? (
        <div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-blue-900">
              Has seleccionado participación <strong>Individual</strong>
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setSelectedType(null)}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50"
            >
              Cambiar
            </button>
            <button
              onClick={handleComplete}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-lg font-semibold hover:shadow-lg"
            >
              Confirmar
            </button>
          </div>
        </div>
      ) : selectedType === 'organization' ? (
        <div>
          <div className="mb-6">
            <label htmlFor="orgName" className="block text-sm font-semibold text-gray-700 mb-2">
              Nombre de la Organización
            </label>
            <input
              type="text"
              id="orgName"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              placeholder="Ej: Banco Popular, Scouts PR, etc."
            />
          </div>

          {scanError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {scanError}
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => {
                setSelectedType(null)
                setOrgName('')
              }}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50"
            >
              Cambiar
            </button>
            <button
              onClick={handleComplete}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-lg font-semibold hover:shadow-lg"
            >
              Confirmar
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-blue-900 mb-2">
              <strong>{selectedType === 'duo' ? 'Duo' : 'Grupo'}</strong> - Escanea los QR codes de los
              integrantes
            </p>
            <p className="text-sm text-blue-700">
              Miembro principal: <strong>{currentName}</strong>
            </p>
          </div>

          {isScanning ? (
            <div className="mb-6">
              <div id="group-qr-reader" className="w-full aspect-square rounded-lg overflow-hidden mb-4 bg-black"></div>
              <button
                onClick={stopScanning}
                className="w-full px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700"
              >
                Detener Scanner
              </button>
            </div>
          ) : (
            <button
              onClick={startScanning}
              className="w-full px-4 py-3 bg-cyan-600 text-white rounded-lg font-semibold hover:bg-cyan-700 mb-6"
            >
              📱 Iniciar Scanner QR
            </button>
          )}

          {scanError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {scanError}
            </div>
          )}

          {scannedMembers.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">
                Integrantes ({scannedMembers.length + 1})
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between bg-cyan-50 border border-cyan-200 rounded-lg p-3">
                  <div>
                    <div className="font-semibold text-gray-900">{currentName} (Tú)</div>
                    <div className="text-sm text-gray-600">Organizador</div>
                  </div>
                </div>

                {scannedMembers.map((member) => (
                  <div
                    key={member.registrationId}
                    className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-3"
                  >
                    <div>
                      <div className="font-semibold text-gray-900">{member.name}</div>
                      <div className="text-sm text-gray-600">{member.email}</div>
                    </div>
                    <button
                      onClick={() => removeMember(member.registrationId)}
                      className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm font-semibold hover:bg-red-200"
                    >
                      Remover
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => {
                stopScanning()
                setSelectedType(null)
                setScannedMembers([])
              }}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50"
            >
              Cambiar Tipo
            </button>
            <button
              onClick={handleComplete}
              disabled={scannedMembers.length === 0}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-lg font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Finalizar Grupo
            </button>
          </div>
        </div>
      )}

      {onCancel && (
        <button
          onClick={onCancel}
          className="mt-4 w-full px-4 py-2 text-gray-600 hover:text-gray-900 text-sm"
        >
          Cancelar
        </button>
      )}
    </div>
  )
}

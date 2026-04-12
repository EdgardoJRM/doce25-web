'use client'

import { useState, useRef, useEffect } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import { useCameraPermission } from '@/hooks/useCameraPermission'
import { PREDEFINED_ORGANIZATIONS } from '@/lib/organizations'

interface ScannedMember {
  registrationId: string
  name: string
  email: string
}

interface GroupFormationProps {
  currentRegistrationId: string
  currentName: string
  currentOrganization?: string
  eventId: string
  /** Pre-fill when user edits participation after check-in */
  initialParticipationType?: 'individual' | 'duo' | 'group' | 'organization' | null
  initialEventOrganization?: string
  initialGroupMembers?: ScannedMember[]
  editMode?: boolean
  onComplete: (data: {
    participationType: 'individual' | 'duo' | 'group' | 'organization'
    groupMembers?: string[]
    eventOrganization?: string
  }) => void
  onCancel?: () => void
}

export default function GroupFormation({
  currentRegistrationId,
  currentName,
  currentOrganization,
  eventId,
  initialParticipationType,
  initialEventOrganization,
  initialGroupMembers,
  editMode = false,
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
  const [orgName, setOrgName] = useState(currentOrganization || '')
  const [organizations, setOrganizations] = useState<string[]>([])
  const [filteredOrganizations, setFilteredOrganizations] = useState<string[]>([])
  const [showOrgDropdown, setShowOrgDropdown] = useState(false)
  const [orgSearchQuery, setOrgSearchQuery] = useState('')
  const [loadingOrgs, setLoadingOrgs] = useState(false)
  const [creatingOrg, setCreatingOrg] = useState(false)
  const [showCreateButton, setShowCreateButton] = useState(false)
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const isRunningRef = useRef(false)

  const lastScannedRef = useRef<string>('')
  const scanTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const editPrefillAppliedRef = useRef(false)

  // Pre-fill tipo de participación al editar después del check-in (una sola vez por montaje)
  useEffect(() => {
    if (!initialParticipationType || editPrefillAppliedRef.current) return
    editPrefillAppliedRef.current = true
    setSelectedType(initialParticipationType)
    if (initialParticipationType === 'organization') {
      const org = initialEventOrganization?.trim() || currentOrganization?.trim() || ''
      if (org) {
        setOrgName(org)
        setOrgSearchQuery(org)
      }
    }
    if (
      (initialParticipationType === 'duo' || initialParticipationType === 'group') &&
      initialGroupMembers?.length
    ) {
      setScannedMembers(initialGroupMembers)
    }
  }, [initialParticipationType, initialEventOrganization, currentOrganization, initialGroupMembers])

  // Cargar organizaciones cuando se selecciona "organization"
  useEffect(() => {
    if (selectedType === 'organization' && organizations.length === 0) {
      fetchOrganizations()
    }
  }, [selectedType])

  // Filtrar organizaciones según búsqueda
  useEffect(() => {
    if (orgSearchQuery.trim()) {
      const filtered = organizations.filter((org) =>
        org.toLowerCase().includes(orgSearchQuery.toLowerCase())
      )
      setFilteredOrganizations(filtered)
      
      // Mostrar botón "Crear nueva" si el texto no coincide con ninguna organización existente
      const exactMatch = organizations.some(
        (org) => org.toLowerCase() === orgSearchQuery.toLowerCase()
      )
      setShowCreateButton(!exactMatch && orgSearchQuery.trim().length > 0)
    } else {
      setFilteredOrganizations(organizations)
      setShowCreateButton(false)
    }
  }, [orgSearchQuery, organizations])

  const fetchOrganizations = async () => {
    try {
      setLoadingOrgs(true)
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/events/${eventId}/organizations`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      )

      if (response.ok) {
        const data = await response.json()
        const fetchedOrgs = data.organizations || []
        
        // Combinar organizaciones predefinidas con las obtenidas del servidor
        const allOrgs = Array.from(
          new Set([...PREDEFINED_ORGANIZATIONS, ...fetchedOrgs])
        ).sort()
        
        setOrganizations(allOrgs)
        setFilteredOrganizations(allOrgs)
      } else {
        // Si hay error, al menos mostrar las predefinidas
        setOrganizations(PREDEFINED_ORGANIZATIONS)
        setFilteredOrganizations(PREDEFINED_ORGANIZATIONS)
      }
    } catch (err) {
      console.error('Error fetching organizations:', err)
      // Si hay error, al menos mostrar las predefinidas
      setOrganizations(PREDEFINED_ORGANIZATIONS)
      setFilteredOrganizations(PREDEFINED_ORGANIZATIONS)
    } finally {
      setLoadingOrgs(false)
    }
  }

  const selectOrganization = (org: string) => {
    setOrgName(org)
    setOrgSearchQuery(org)
    setShowOrgDropdown(false)
  }

  const createNewOrganization = async () => {
    if (!orgSearchQuery.trim()) return

    try {
      setCreatingOrg(true)
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/events/${eventId}/organizations`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            organizationName: orgSearchQuery.trim(),
          }),
        }
      )

      if (response.ok) {
        const data = await response.json()
        const newOrgName = data.organizationName

        // Agregar la nueva organización a la lista
        setOrganizations((prev) => {
          const updated = [...prev, newOrgName].sort()
          return updated
        })

        // Seleccionar la nueva organización
        setOrgName(newOrgName)
        setOrgSearchQuery(newOrgName)
        setShowOrgDropdown(false)
        setShowCreateButton(false)
      } else {
        setScanError('Error al crear la organización')
      }
    } catch (err) {
      console.error('Error creating organization:', err)
      setScanError('Error al crear la organización')
    } finally {
      setCreatingOrg(false)
    }
  }

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
      const orgChosen = orgSearchQuery.trim()
      if (!orgChosen) {
        setScanError('Ingresa el nombre de la organización')
        return
      }
      onComplete({
        participationType: 'organization',
        eventOrganization: orgChosen,
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

  const hasRegistrationOrganization = !!(
    currentOrganization && String(currentOrganization).trim()
  )

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {editMode ? 'Cambiar tipo de participación' : 'Tipo de Participación'}
      </h2>
      {editMode && (
        <p className="text-sm text-gray-600 mb-4">
          Puedes corregir tu elección (por ejemplo, si elegiste organización y no viniste con la org).
          Confirma abajo para guardar.
        </p>
      )}

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
            <div className="font-bold text-lg text-gray-900">Grupo</div>
            <div className="text-sm text-gray-600">Hasta 3 personas en total (tú + hasta 2 más)</div>
          </button>

          <button
            onClick={() => {
              const seed = (currentOrganization || orgName || '').trim()
              setSelectedType('organization')
              setOrgSearchQuery(seed)
              setOrgName(seed)
            }}
            className={`p-6 border-2 rounded-xl transition-all text-left ${
              hasRegistrationOrganization
                ? 'border-cyan-600 bg-cyan-50 ring-2 ring-cyan-200 hover:bg-cyan-100'
                : 'border-gray-300 hover:border-cyan-600 hover:bg-cyan-50'
            }`}
          >
            <div className="text-3xl mb-2">🏢</div>
            <div className="font-bold text-lg text-gray-900">Organización</div>
            {hasRegistrationOrganization ? (
              <div className="text-sm font-semibold text-cyan-800 mt-1">
                Tu org: {currentOrganization}
              </div>
            ) : null}
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
              Nombre de la Organización <span className="text-red-500">*</span>
            </label>
            
            <div className="relative">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    id="orgName"
                    value={orgSearchQuery}
                    onChange={(e) => {
                      setOrgSearchQuery(e.target.value)
                      setShowOrgDropdown(true)
                    }}
                    onFocus={() => setShowOrgDropdown(true)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="Busca o selecciona una organización..."
                  />
                  
                  {/* Dropdown */}
                  {showOrgDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-gray-300 rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto">
                      {loadingOrgs ? (
                        <div className="p-4 text-center text-gray-500">
                          Cargando organizaciones...
                        </div>
                      ) : (
                        <div>
                          {/* Botón para crear nueva organización */}
                          {showCreateButton && (
                            <button
                              type="button"
                              onClick={createNewOrganization}
                              disabled={creatingOrg}
                              className="w-full text-left px-4 py-3 bg-cyan-50 hover:bg-cyan-100 border-b-2 border-cyan-300 font-semibold text-cyan-700 flex items-center gap-2"
                            >
                              {creatingOrg ? (
                                <>
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-cyan-600"></div>
                                  Creando...
                                </>
                              ) : (
                                <>
                                  <span>➕</span>
                                  Crear: &quot;{orgSearchQuery}&quot;
                                </>
                              )}
                            </button>
                          )}

                          {/* Lista de organizaciones existentes */}
                          {filteredOrganizations.length > 0 ? (
                            <div>
                              {filteredOrganizations.map((org) => (
                                <button
                                  key={org}
                                  type="button"
                                  onClick={() => selectOrganization(org)}
                                  className={`w-full text-left px-4 py-3 hover:bg-cyan-50 border-b border-gray-100 last:border-b-0 ${
                                    orgSearchQuery.trim() === org ? 'bg-cyan-100 font-semibold' : ''
                                  }`}
                                >
                                  {org}
                                  {currentOrganization === org && (
                                    <span className="ml-2 text-cyan-600 font-semibold">(Tu org)</span>
                                  )}
                                </button>
                              ))}
                            </div>
                          ) : !showCreateButton ? (
                            <div className="p-4 text-center text-gray-500">
                              No se encontraron organizaciones
                            </div>
                          ) : null}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {currentOrganization && !orgSearchQuery.trim() && (
              <p className="text-xs text-cyan-600 mt-2">
                💡 Tu organización es: <strong>{currentOrganization}</strong>
              </p>
            )}
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
                setOrgSearchQuery('')
                setShowOrgDropdown(false)
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

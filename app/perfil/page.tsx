'use client'

import { useCallback, useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/contexts/AuthContext'
import { getUserRegistrations, getWeightHistory, WeightHistory } from '@/lib/api'
import QRCode from 'qrcode'
import { formatCertificateName } from '@/lib/formatCertificateName'
import { CERT_PDF_PATH } from '@/lib/certificatePdfLayout'
import { buildCertificatePdfFromBase } from '@/lib/buildCertificatePdf'
import CertificateSignaturePad, {
  type CertificateSignaturePadHandle,
} from '@/components/CertificateSignaturePad'

interface Registration {
  registrationId: string
  eventId: string
  eventSlug?: string
  eventName: string
  eventDate: string
  eventLocation: string
  checkedIn: boolean
  registeredAt: string
  qrToken?: string
  fullName?: string
  weightCollected?: number
  trashType?: string
  trashBreakdown?: {
    plastic?: number
    metal?: number
    glass?: number
    organic?: number
    other?: number
  }
  checkedOut?: boolean
  checkOutTime?: string
  participationType?: 'individual' | 'duo' | 'group' | 'organization'
  groupId?: string
  eventOrganization?: string
  groupMembers?: string[]
}

interface WeightRecord {
  weightRecordId: string
  registrationId?: string
  groupId?: string
  eventId: string
  weightCollected: number
  trashType: string
  trashBreakdown?: Record<string, number>
  timestamp: string
  registeredBy?: string
  registeredByName?: string
  notes?: string
}

export default function ProfilePage() {
  const router = useRouter()
  const { user, token, loading: authLoading, logout } = useAuth()
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedQR, setSelectedQR] = useState<string | null>(null)
  const [qrDataUrl, setQrDataUrl] = useState<string>('')
  const [weightHistories, setWeightHistories] = useState<Record<string, WeightHistory>>({})
  const [expandedRegistration, setExpandedRegistration] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const certificateSigRef = useRef<CertificateSignaturePadHandle>(null)
  const [certificateSignatureReady, setCertificateSignatureReady] = useState(false)
  const onCertificateSignatureChange = useCallback((ok: boolean) => {
    setCertificateSignatureReady(ok)
  }, [])

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [authLoading, user, router])

  useEffect(() => {
    if (user && token) {
      loadRegistrations()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, token])

  const loadRegistrations = async () => {
    if (!user || !token) return

    try {
      const data = await getUserRegistrations(token, user.userId)
      setRegistrations(data.registrations || [])
      
      for (const reg of data.registrations || []) {
        if (reg.checkedIn) {
          try {
            const historyType = reg.groupId ? 'group' : 'registration'
            const historyId = reg.groupId || reg.registrationId
            const history = await getWeightHistory(historyId, historyType)
            setWeightHistories(prev => ({
              ...prev,
              [reg.registrationId]: history
            }))
          } catch (err) {
            console.error(`Error loading weight history for ${reg.registrationId}:`, err)
          }
        }
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const showQRCode = async (registration: Registration) => {
    if (!registration.qrToken) {
      alert('QR Code no disponible para este registro')
      return
    }

    try {
      const qrUrl = `${window.location.origin}/checkin/${registration.qrToken}`
      const dataUrl = await QRCode.toDataURL(qrUrl, {
        width: 400,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      })
      setQrDataUrl(dataUrl)
      setSelectedQR(registration.registrationId)
    } catch (err) {
      console.error('Error generating QR code:', err)
      alert('Error al generar el código QR')
    }
  }

  const downloadQRCode = () => {
    if (!qrDataUrl) return
    
    const link = document.createElement('a')
    link.href = qrDataUrl
    link.download = `doce25-pase-entrada-${selectedQR}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const closeQRModal = () => {
    setSelectedQR(null)
    setQrDataUrl('')
  }

  const hasCertificate = (reg: Registration) =>
    !!reg.checkedIn &&
    ((reg.weightCollected ?? 0) >= 0.01 ||
      !!(reg.participationType && reg.participationType !== 'individual'))

  const downloadCertificate = async (reg: Registration) => {
    if (certificateSigRef.current?.isEmpty() || !certificateSignatureReady) {
      alert(
        'La descarga del certificado requiere tu firma. Ve al recuadro «Tu firma en el certificado» (arriba), dibuja con dedo o mouse y vuelve a intentar.'
      )
      return
    }
    const rawName = (reg.fullName || user?.fullName || '').trim() || 'Participante'
    const displayName = formatCertificateName(rawName)
    let signaturePng: Uint8Array | null = null
    try {
      signaturePng = (await certificateSigRef.current?.getPngBytes()) ?? null
    } catch {
      signaturePng = null
    }
    if (!signaturePng || signaturePng.byteLength === 0) {
      alert('No se pudo leer la firma. Dibuja de nuevo e intenta otra vez.')
      return
    }
    try {
      const res = await fetch(CERT_PDF_PATH)
      if (!res.ok) throw new Error('No se pudo cargar el certificado base')
      const bytes = await res.arrayBuffer()
      const out = await buildCertificatePdfFromBase(bytes, {
        displayName,
        signaturePng,
      })
      const blob = new Blob([new Uint8Array(out)], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `Certificado-Labor-Comunitaria-${displayName.replace(/\s+/g, '-')}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error(err)
      alert('No se pudo generar el certificado. Intenta de nuevo.')
    }
  }

  const getTotalWeight = () => {
    return Object.values(weightHistories).reduce((sum, history) => sum + (history.totalWeight || 0), 0)
  }

  const getTotalTrips = () => {
    return Object.values(weightHistories).reduce((sum, history) => sum + (history.tripCount || 0), 0)
  }

  const toggleExpanded = (registrationId: string) => {
    setExpandedRegistration(expandedRegistration === registrationId ? null : registrationId)
  }

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 py-6 sm:py-10 md:py-12 px-3 sm:px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
      <div className="max-w-6xl w-full mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 mb-6 sm:mb-8">
          <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
            <div className="flex items-start gap-3 sm:gap-4 min-w-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-full flex items-center justify-center text-white text-2xl sm:text-3xl font-bold">
                {user.fullName.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 break-words">
                  {user.fullName}
                </h1>
                <p className="text-gray-600 text-sm sm:text-base break-all">{user.email}</p>
                {user.organization && (
                  <p className="text-sm text-gray-500 mt-1 break-words">
                    📍 {user.organization}
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto sm:shrink-0">
              <Link
                href="/perfil/editar"
                className="inline-flex justify-center items-center px-4 sm:px-6 py-3 min-h-[44px] border-2 border-cyan-600 text-cyan-600 rounded-lg font-semibold hover:bg-cyan-50 transition-colors text-center"
              >
                Editar Perfil
              </Link>
              <button
                type="button"
                onClick={logout}
                className="inline-flex justify-center items-center px-4 sm:px-6 py-3 min-h-[44px] bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border-t-4 border-cyan-500">
            <div className="text-2xl sm:text-4xl font-bold text-cyan-600 mb-1 sm:mb-2 tabular-nums">
              {registrations.length}
            </div>
            <div className="text-gray-600 font-semibold text-xs sm:text-base leading-snug">
              Eventos Registrados
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border-t-4 border-teal-500">
            <div className="text-2xl sm:text-4xl font-bold text-teal-600 mb-1 sm:mb-2 tabular-nums">
              {registrations.filter(r => r.checkedIn).length}
            </div>
            <div className="text-gray-600 font-semibold text-xs sm:text-base leading-snug">
              Eventos Asistidos
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border-t-4 border-green-500">
            <div className="text-2xl sm:text-4xl font-bold text-green-600 mb-1 sm:mb-2 tabular-nums">
              {getTotalTrips()}
            </div>
            <div className="text-gray-600 font-semibold text-xs sm:text-base leading-snug">
              Viajes de Recolección
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border-t-4 border-orange-500">
            <div className="text-2xl sm:text-4xl font-bold text-orange-600 mb-1 sm:mb-2 tabular-nums">
              {getTotalWeight().toFixed(1)}
            </div>
            <div className="text-gray-600 font-semibold text-xs sm:text-base leading-snug">
              lb Total Recogidos
            </div>
          </div>
        </div>

        {!loading && registrations.some((r) => hasCertificate(r)) && (
          <div className="bg-amber-50/80 rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 mb-6 sm:mb-8 border-2 border-amber-200/90">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">Tu firma en el certificado</h2>
            <p className="text-sm font-medium text-amber-900/90 mb-1">
              Obligatoria para descargar el PDF.
            </p>
            <p className="text-sm text-gray-700 mb-4 max-w-2xl leading-relaxed">
              Sin firma no se puede generar el certificado. Dibuja en el recuadro; se guarda en este dispositivo hasta que la borres. Puedes firmar de nuevo cuando quieras.
            </p>
            <CertificateSignaturePad
              ref={certificateSigRef}
              storageKey={`doce25_cert_sig_${user.userId}`}
              className="w-full max-w-full sm:max-w-lg"
              onSignatureChange={onCertificateSignatureChange}
            />
          </div>
        )}

        {/* Impacto Ambiental Card */}
        {getTotalWeight() > 0 && (
          <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 mb-6 sm:mb-8 border-2 border-green-200">
            <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
              <div className="text-4xl sm:text-6xl shrink-0" aria-hidden>🌊</div>
              <div className="flex-1 min-w-0">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                  ¡Tu Impacto Ambiental!
                </h2>
                <p className="text-base sm:text-lg text-gray-700 mb-4 leading-relaxed">
                  Has salvado <span className="font-bold text-green-600 text-xl sm:text-2xl whitespace-nowrap">
                    {getTotalWeight().toFixed(1)} lb
                  </span> de basura del océano en <span className="font-bold text-blue-600">{getTotalTrips()} viajes</span>
                </p>

                {/* Desglose si hay datos */}
                {Object.values(weightHistories).some(h => h.summary?.byType) && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3 mt-4">
                    {[
                      { key: 'plastic', label: '🥤 Plástico', color: 'text-blue-600' },
                      { key: 'metal', label: '🔩 Metal', color: 'text-gray-600' },
                      { key: 'glass', label: '🍾 Vidrio', color: 'text-green-600' },
                      { key: 'organic', label: '🌱 Orgánico', color: 'text-green-700' },
                      { key: 'other', label: '📦 Otro', color: 'text-purple-600' },
                    ].map(({ key, label, color }) => {
                      const total = Object.values(weightHistories).reduce((sum, history) => {
                        return sum + (history.summary?.byType?.[key] || 0)
                      }, 0)

                      if (total === 0) return null

                      return (
                        <div key={key} className="bg-white rounded-lg p-2 sm:p-3 text-center min-w-0">
                          <div className={`text-base sm:text-xl font-bold tabular-nums ${color}`}>
                            {total.toFixed(1)} lb
                          </div>
                          <div className="text-[10px] sm:text-xs text-gray-600 leading-tight">
                            {label}
                          </div>
                        </div>
                      )
                    }).filter(Boolean)}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Registrations Section */}
        <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 md:p-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Mis Registros
            </h2>
            <Link
              href="/eventos"
              className="inline-flex justify-center items-center px-5 py-2.5 min-h-[44px] sm:min-h-0 bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all text-center shrink-0"
            >
              Ver Eventos
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando registros...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          ) : registrations.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🏖️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No tienes registros aún
              </h3>
              <p className="text-gray-600 mb-6">
                Únete a un evento de limpieza de playa
              </p>
              <Link
                href="/eventos"
                className="inline-flex justify-center items-center w-full sm:w-auto px-8 py-3 min-h-[48px] bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-lg font-semibold hover:shadow-xl transition-all"
              >
                Explorar Eventos
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {registrations.map((registration) => {
                const history = weightHistories[registration.registrationId]
                const hasHistory = history && history.records && history.records.length > 0
                const isExpanded = expandedRegistration === registration.registrationId

                return (
                  <div
                    key={registration.registrationId}
                    className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all"
                  >
                    <div className="p-4 sm:p-6">
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-stretch lg:justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center mb-2">
                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 break-words">
                              {registration.eventName}
                            </h3>
                            <div className="flex gap-2 flex-wrap">
                              {registration.checkedIn && (
                                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                                  ✓ Asistido
                                </span>
                              )}
                              {registration.participationType && registration.participationType !== 'individual' && (
                                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold capitalize">
                                  {registration.participationType === 'duo' && '👥 Duo'}
                                  {registration.participationType === 'group' && '👨‍👩‍👧‍👦 Grupo'}
                                  {registration.participationType === 'organization' && `🏢 ${registration.eventOrganization}`}
                                </span>
                              )}
                              {hasHistory && (
                                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                                  ♻️ {history.tripCount} {history.tripCount === 1 ? 'viaje' : 'viajes'} · {history.totalWeight.toFixed(1)} lb
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="space-y-1 text-gray-600 text-sm sm:text-base">
                            <p className="flex items-start gap-2">
                              <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <span className="min-w-0 break-words">
                                {new Date(registration.eventDate).toLocaleDateString('es-PR', {
                                  weekday: 'long',
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </span>
                            </p>
                            <p className="flex items-start gap-2">
                              <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              <span className="min-w-0 break-words">{registration.eventLocation}</span>
                            </p>
                            <p className="text-sm text-gray-500">
                              Registrado: {new Date(registration.registeredAt).toLocaleDateString('es-PR')}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 w-full lg:w-auto lg:max-w-[20rem] xl:max-w-none lg:shrink-0">
                          <button
                            type="button"
                            onClick={() => showQRCode(registration)}
                            className="w-full px-4 py-2.5 min-h-[44px] bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                            </svg>
                            Ver Mi Pase
                          </button>
                          {hasCertificate(registration) && (
                            <div className="flex flex-col gap-1 items-stretch">
                              <button
                                type="button"
                                disabled={!certificateSignatureReady}
                                title={
                                  certificateSignatureReady
                                    ? 'Descargar certificado con tu nombre y firma'
                                    : 'Primero firma en el recuadro «Tu firma en el certificado» (arriba en esta página)'
                                }
                                onClick={() => downloadCertificate(registration)}
                                className="w-full px-4 py-2.5 min-h-[44px] rounded-lg font-semibold flex items-center justify-center gap-2 bg-green-600 text-white hover:bg-green-700 disabled:bg-slate-400 disabled:hover:bg-slate-400 disabled:cursor-not-allowed disabled:opacity-80 transition-colors"
                              >
                                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Descargar Certificado
                              </button>
                              {!certificateSignatureReady && (
                                <span className="text-xs text-amber-800 leading-snug">
                                  Firma obligatoria: completa el recuadro de arriba antes de descargar.
                                </span>
                              )}
                            </div>
                          )}
                          <Link
                            href={`/eventos/${registration.eventSlug || registration.eventId}`}
                            className="inline-flex justify-center items-center px-4 py-2.5 min-h-[44px] border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-center"
                          >
                            Ver Evento
                          </Link>
                        </div>
                      </div>

                      {/* Historial de Peso Toggle */}
                      {hasHistory && (
                        <div className="mt-4">
                          <button
                            type="button"
                            onClick={() => toggleExpanded(registration.registrationId)}
                            className="w-full flex items-center justify-between gap-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left min-h-[44px]"
                          >
                            <span className="font-semibold text-gray-700 text-sm sm:text-base leading-snug">
                              📊 Ver Historial de Recolección ({history.tripCount} {history.tripCount === 1 ? 'viaje' : 'viajes'})
                            </span>
                            <svg
                              className={`w-5 h-5 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Historial Expandido */}
                    {hasHistory && isExpanded && (
                      <div className="bg-gray-50 border-t border-gray-200 p-4 sm:p-6">
                        <h4 className="font-bold text-gray-900 mb-4 text-base sm:text-lg">Historial de Recolección</h4>
                        <div className="space-y-3">
                          {history.records.map((record: WeightRecord, index: number) => (
                            <div
                              key={record.weightRecordId}
                              className="bg-white rounded-lg p-3 sm:p-4 border border-gray-200"
                            >
                              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                <div className="flex-1 min-w-0">
                                  <div className="flex flex-wrap items-center gap-2 mb-2">
                                    <span className="px-2 py-1 bg-cyan-100 text-cyan-700 rounded-full text-xs font-bold">
                                      Viaje #{history.tripCount - index}
                                    </span>
                                    <span className="text-sm text-gray-600">
                                      {new Date(record.timestamp).toLocaleString('es-PR', {
                                        dateStyle: 'medium',
                                        timeStyle: 'short'
                                      })}
                                    </span>
                                  </div>
                                  
                                  {record.registeredByName && registration.groupId && (
                                    <p className="text-sm text-gray-600 mb-2">
                                      👤 Registrado por: <span className="font-semibold">{record.registeredByName}</span>
                                    </p>
                                  )}

                                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                                    <div>
                                      <span className="text-xl sm:text-2xl font-bold text-green-600 tabular-nums">
                                        {record.weightCollected.toFixed(1)} lb
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2 min-w-0">
                                      <span className="text-sm text-gray-600">
                                        {record.trashType === 'plastic' && '🥤 Plástico'}
                                        {record.trashType === 'metal' && '🔩 Metal'}
                                        {record.trashType === 'glass' && '🍾 Vidrio'}
                                        {record.trashType === 'organic' && '🌱 Orgánico'}
                                        {record.trashType === 'mixed' && '♻️ Mixto'}
                                        {record.trashType === 'other' && '📦 Otro'}
                                      </span>
                                    </div>
                                  </div>

                                  {record.notes && (
                                    <p className="text-sm text-gray-600 mt-2 italic">
                                      💬 {record.notes}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Resumen Total */}
                        <div className="mt-4 pt-4 border-t border-gray-300">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-gray-900">Total Recolectado:</span>
                            <span className="text-2xl font-bold text-green-600">
                              {history.totalWeight.toFixed(1)} lb
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* QR Code Modal */}
        {selectedQR && (
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))]"
            onClick={closeQRModal}
          >
            <div 
              className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[min(90dvh,100%)] overflow-y-auto p-4 sm:p-8 relative my-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={closeQRModal}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 text-gray-400 hover:text-gray-600 transition p-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Cerrar"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="text-center pt-2">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 px-2">
                  🎟️ Tu Pase de Entrada
                </h3>
                <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base px-1">
                  Muestra este código QR en el evento para registrar tu asistencia
                </p>

                {/* QR Code */}
                <div className="bg-white p-3 sm:p-6 rounded-xl border-4 border-cyan-500 mb-4 sm:mb-6 inline-block max-w-full">
                  {qrDataUrl && (
                    <Image 
                      src={qrDataUrl} 
                      alt="Código QR de Entrada" 
                      width={256}
                      height={256}
                      className="w-[min(16rem,72vw)] h-auto max-w-full mx-auto aspect-square"
                    />
                  )}
                </div>

                {/* Event Info */}
                {registrations.find(r => r.registrationId === selectedQR) && (
                  <div className="bg-gradient-to-r from-cyan-50 to-teal-50 p-4 rounded-lg mb-6 text-left">
                    <h4 className="font-bold text-gray-900 mb-2">
                      {registrations.find(r => r.registrationId === selectedQR)?.eventName}
                    </h4>
                    <p className="text-sm text-gray-600">
                      📅 {new Date(registrations.find(r => r.registrationId === selectedQR)?.eventDate || '').toLocaleDateString('es-PR', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                    <p className="text-sm text-gray-600">
                      📍 {registrations.find(r => r.registrationId === selectedQR)?.eventLocation}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3">
                  <button
                    type="button"
                    onClick={downloadQRCode}
                    className="flex-1 px-4 sm:px-6 py-3 min-h-[48px] bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                  >
                    📥 Descargar Pase
                  </button>
                  <button
                    type="button"
                    onClick={closeQRModal}
                    className="flex-1 px-4 sm:px-6 py-3 min-h-[48px] border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Cerrar
                  </button>
                </div>

                <p className="text-xs text-gray-500 mt-4">
                  💡 Guarda una captura de pantalla o descarga tu pase para tenerlo disponible sin conexión
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

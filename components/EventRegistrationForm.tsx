'use client'

import { useState, useEffect } from 'react'
import { registerForEvent } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'

interface EventRegistrationFormProps {
  eventId: string
  onSuccess: () => void
}

const MUNICIPIOS_PR = [
  'Adjuntas', 'Aguada', 'Aguadilla', 'Aguas Buenas', 'Aibonito', 'Anasco', 'Arecibo', 'Arroyo',
  'Barceloneta', 'Barranquitas', 'Bayamon', 'Cabo Rojo', 'Caguas', 'Camuy', 'Canovanas', 'Carolina',
  'Catano', 'Cayey', 'Ceiba', 'Ciales', 'Cidra', 'Coamo', 'Comerio', 'Corozal', 'Culebra', 'Dorado',
  'Fajardo', 'Florida', 'Guanica', 'Guayama', 'Guayanilla', 'Guaynabo', 'Gurabo', 'Hatillo',
  'Hormigueros', 'Humacao', 'Isabela', 'Jayuya', 'Juana Diaz', 'Juncos', 'Lajas', 'Lares',
  'Las Marias', 'Las Piedras', 'Loiza', 'Luquillo', 'Manati', 'Maricao', 'Maunabo', 'Mayaguez',
  'Moca', 'Morovis', 'Naguabo', 'Naranjito', 'Orocovis', 'Patillas', 'Penuelas', 'Ponce',
  'Quebradillas', 'Rincon', 'Rio Grande', 'Sabana Grande', 'Salinas', 'San German', 'San Juan',
  'San Lorenzo', 'San Sebastian', 'Santa Isabel', 'Toa Alta', 'Toa Baja', 'Trujillo Alto', 'Utuado',
  'Vega Alta', 'Vega Baja', 'Vieques', 'Villalba', 'Yabucoa', 'Yauco'
]

const ORGANIZACIONES = [
  'Doce25',
  'N/A, vengo con mi compañía',
  'AEC UPR - Río Piedras', 'AEC UPR - Humacao', 'AEC UPR - Cayey',
  'AEPREH UPR - Río Piedras', 'AMA Universidad Sagrado Corazón', 'AMIE UPR - Río Piedras',
  'AMSA PUPR - San Juan', 'AMSA UPR - Bayamón', 'AMSA UPR - Cayey', 'AMSA UPR - Río Piedras',
  'AMWA UPR - Río Piedras', 'ASHIEV UPR - Bayamón', 'Asociación de Microbiología Inter - Metro',
  'AUETS UPR - Humacao', 'Chemistry Student Association UIPR - Metro', 'Círculo de Pre-Médica PUCPR - Ponce',
  'Círculo de Química UPR - Cayey', 'CUDAS UPR - Cayey', 'FPA UPR - Bayamón', 'FPA UPR - Cayey',
  'FPA UPR - Humacao', 'Future ONCOS UPR - Río Piedras', 'IQ Dermos UPR - Río Piedras',
  'Medlife PUCPR - Ponce', 'Medlife UAGM - Cupey', 'Medlife UAGM - Gurabo', 'Medlife UPR - Cayey',
  'Neuroboricuas UPR - Arecibo', 'Neuroboricuas UPR - Bayamón', 'Neuroboricuas UPR - Cayey',
  'NSCS UPR - Río Piedras', 'NSLS UPR - Humacao', 'ONCOSS UPR - Río Piedras',
  'Phi Lambda Upsilon UPR - Mayagüez', 'PPAW UPR - Bayamón', 'Pre-Law UPR - Cayey',
  'PRPDA UPR - Cayey', 'PRPDA UPR - Humacao', 'PRPDA UPR - Río Piedras', 'PSYCHI UPR - Cayey',
  'Rotaract UPR - Río Piedras', 'SACNAS UPR - Río Piedras', 'Salut Vito UPR - Río Piedras',
  'Taínos Dance Team UAGM - Gurabo', 'TMED UPR - Cayey', 'Tribeta UPR - Cayey', 'WINS UPR - Río Piedras',
  'Otra'
]

export function EventRegistrationForm({ eventId, onSuccess }: EventRegistrationFormProps) {
  const { user } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    ageRange: '',
    gender: '',
    city: '',
    organization: '',
    otherOrganization: '',
    // Aceptaciones del relevo
    activityDescription: false,
    conditionsAndPrecautions: false,
    equipmentAndSupplies: false,
    participantCommitments: false,
    healthStatus: false,
    rightsReserve: false,
    waiverAndRelease: false,
    mediaAuthorization: false,
    conductCommitment: false,
    alcoholUse: false,
    declarationsAndStatements: false,
    // Firma
    signature: '',
    signatureDate: new Date().toISOString().split('T')[0],
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  // Auto-completar con datos del usuario si está logueado
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        email: user.email || prev.email,
        fullName: user.fullName || prev.fullName,
        ageRange: user.ageRange || prev.ageRange,
        gender: user.gender || prev.gender,
        city: user.city || prev.city,
        organization: user.organization || prev.organization,
      }))
    }
  }, [user])

  const validateStep1 = () => {
    if (!formData.email || !formData.fullName || !formData.ageRange || 
        !formData.gender || !formData.city || !formData.organization) {
      setError('Por favor completa todos los campos requeridos')
      return false
    }
    if (formData.organization === 'Otra' && !formData.otherOrganization) {
      setError('Por favor especifica tu organización')
      return false
    }
    setError('')
    return true
  }

  const validateStep2 = () => {
    const allAcceptancesChecked = [
      formData.activityDescription,
      formData.conditionsAndPrecautions,
      formData.equipmentAndSupplies,
      formData.participantCommitments,
      formData.healthStatus,
      formData.rightsReserve,
      formData.waiverAndRelease,
      formData.mediaAuthorization,
      formData.conductCommitment,
      formData.alcoholUse,
      formData.declarationsAndStatements,
    ].every(Boolean)

    if (!allAcceptancesChecked) {
      setError('Debes aceptar todos los términos del Relevo de Responsabilidad')
      return false
    }
    setError('')
    return true
  }

  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleBack = () => {
    setCurrentStep(currentStep - 1)
    setError('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!formData.signature.trim()) {
      setError('Debes firmar el documento')
      return
    }

    setLoading(true)

    try {
      await registerForEvent(eventId, {
        email: formData.email,
        name: formData.fullName,
        phone: '',
        fullName: formData.fullName,
        ageRange: formData.ageRange,
        gender: formData.gender,
        city: formData.city,
        organization: formData.organization,
        otherOrganization: formData.otherOrganization,
        termsAccepted: true,
        signature: formData.signature,
        signatureDate: formData.signatureDate,
      })
      setSuccess(true)
      setTimeout(() => {
        onSuccess()
      }, 3000)
    } catch (err: any) {
      setError(err.message || 'Error al registrarse. Por favor intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="text-center py-12 px-4 animate-fade-in">
        <div className="mb-6">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center animate-bounce-slow">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        <h3 className="text-3xl font-bold mb-3 text-gray-900 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
          ¡Registro Exitoso!
        </h3>
        <p className="text-lg text-gray-600 mb-2">
          Te hemos enviado un email con tu código QR.
        </p>
        <p className="text-sm text-gray-500 mb-6">
          Revisa tu bandeja de entrada para confirmar tu asistencia.
        </p>
        <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4 mb-4">
          <p className="text-sm text-cyan-800">
            💌 <strong>Revisa tu email:</strong> {formData.email}
          </p>
        </div>
        <p className="text-xs text-gray-400">
          ¿Preguntas? Escríbenos a <a href="mailto:info@dosce25.org" className="text-cyan-600 hover:underline">info@dosce25.org</a>
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-full">
      {/* Modern Progress Bar */}
      <div className="mb-8 lg:mb-10">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm lg:text-base font-semibold text-gray-700">
            Paso {currentStep} de 3
          </span>
          <span className="text-xs lg:text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {Math.round((currentStep / 3) * 100)}%
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="relative w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
          <div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 rounded-full transition-all duration-700 ease-out shadow-lg"
            style={{ width: `${(currentStep / 3) * 100}%` }}
          >
            <div className="absolute inset-0 bg-white/20 animate-shimmer"></div>
          </div>
        </div>
        
        {/* Step Labels */}
        <div className="flex justify-between mt-3 px-1">
          {['Información', 'Relevo', 'Firma'].map((label, idx) => (
            <div key={label} className="flex flex-col items-center flex-1">
              <div 
                className={`
                  w-7 h-7 lg:w-8 lg:h-8 rounded-full flex items-center justify-center text-xs lg:text-sm font-bold
                  transition-all duration-300 mb-1
                  ${currentStep > idx + 1 ? 'bg-gradient-to-br from-green-400 to-emerald-500 text-white scale-105' : 
                    currentStep === idx + 1 ? 'bg-gradient-to-br from-cyan-500 to-teal-500 text-white scale-110 shadow-lg' : 
                    'bg-gray-300 text-gray-500'}
                `}
              >
                {currentStep > idx + 1 ? '✓' : idx + 1}
              </div>
              <span className={`text-xs lg:text-sm font-medium ${currentStep >= idx + 1 ? 'text-cyan-700' : 'text-gray-400'}`}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Step Title with Icon */}
      <div className="mb-6 lg:mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
            {currentStep === 1 && <span className="text-2xl">📝</span>}
            {currentStep === 2 && <span className="text-2xl">⚖️</span>}
            {currentStep === 3 && <span className="text-2xl">✍️</span>}
          </div>
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
            {currentStep === 1 && 'Información del Participante'}
            {currentStep === 2 && 'Relevo de Responsabilidad'}
            {currentStep === 3 && 'Firma Electrónica'}
          </h2>
        </div>
        <p className="text-sm lg:text-base text-gray-600 ml-13 lg:ml-15">
          {currentStep === 1 && 'Completa tu información personal para continuar'}
          {currentStep === 2 && 'Lee y acepta cada uno de los términos del relevo'}
          {currentStep === 3 && 'Firma el documento para completar tu registro'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 lg:space-y-6">
        {/* PASO 1: Información */}
        {currentStep === 1 && (
          <div className="space-y-4 lg:space-y-5 animate-slide-in">
            {/* Email */}
            <div className="group">
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <span className="text-lg">📧</span> Email *
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full px-4 py-3 lg:py-3.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200 group-hover:border-gray-400"
                placeholder="tu@email.com"
              />
            </div>

            {/* Nombre Completo */}
            <div className="group">
              <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <span className="text-lg">👤</span> Dos Apellidos y Nombre *
              </label>
              <input
                id="fullName"
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
                placeholder="Pérez Cintrón, Juan"
                className="w-full px-4 py-3 lg:py-3.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200 group-hover:border-gray-400"
              />
              <p className="mt-1.5 text-xs text-gray-500">Formato: Apellidos, Nombre</p>
            </div>

            {/* Grid para Edad y Género */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5">
              {/* Edad */}
              <div className="group">
                <label htmlFor="ageRange" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <span className="text-lg">🎂</span> Rango de Edad *
                </label>
                <select
                  id="ageRange"
                  value={formData.ageRange}
                  onChange={(e) => setFormData({ ...formData, ageRange: e.target.value })}
                  required
                  className="w-full px-4 py-3 lg:py-3.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200 group-hover:border-gray-400 bg-white"
                >
                  <option value="">Selecciona...</option>
                  <option value="Menor de 17 años">Menor de 17 años</option>
                  <option value="18-24 años">18-24 años</option>
                  <option value="25-34 años">25-34 años</option>
                  <option value="35-44 años">35-44 años</option>
                  <option value="45-54 años">45-54 años</option>
                  <option value="55-64 años">55-64 años</option>
                  <option value="65 años en adelante">65+ años</option>
                </select>
              </div>

              {/* Género */}
              <div className="group">
                <label htmlFor="gender" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <span className="text-lg">⚧️</span> Género *
                </label>
                <select
                  id="gender"
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  required
                  className="w-full px-4 py-3 lg:py-3.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200 group-hover:border-gray-400 bg-white"
                >
                  <option value="">Selecciona...</option>
                  <option value="Femenino">Femenino</option>
                  <option value="Masculino">Masculino</option>
                  <option value="No-Binario">No-Binario</option>
                  <option value="Prefiero No Decirlo">Prefiero No Decirlo</option>
                </select>
              </div>
            </div>

            {/* Ciudad */}
            <div className="group">
              <label htmlFor="city" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <span className="text-lg">🏙️</span> Ciudad/Pueblo de Origen *
              </label>
              <select
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                required
                className="w-full px-4 py-3 lg:py-3.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200 group-hover:border-gray-400 bg-white"
              >
                <option value="">Selecciona...</option>
                {MUNICIPIOS_PR.map((municipio) => (
                  <option key={municipio} value={municipio}>{municipio}</option>
                ))}
              </select>
            </div>

            {/* Organización */}
            <div className="group">
              <label htmlFor="organization" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <span className="text-lg">🏢</span> Organización *
              </label>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-2">
                <p className="text-xs text-blue-800">
                  💡 <strong>Si vienes por tu cuenta:</strong> marca &quot;Doce25&quot;<br />
                  💼 <strong>Si vienes con tu empresa:</strong> escoge &quot;N/A, vengo con mi compañía&quot;
                </p>
              </div>
              <select
                id="organization"
                value={formData.organization}
                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                required
                className="w-full px-4 py-3 lg:py-3.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200 group-hover:border-gray-400 bg-white"
              >
                <option value="">Selecciona...</option>
                {ORGANIZACIONES.map((org) => (
                  <option key={org} value={org}>{org}</option>
                ))}
              </select>
            </div>

            {/* Otra Organización (condicional) */}
            {formData.organization === 'Otra' && (
              <div className="group animate-slide-in">
                <label htmlFor="otherOrganization" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <span className="text-lg">✏️</span> ¿Cuál organización? *
                </label>
                <input
                  id="otherOrganization"
                  type="text"
                  value={formData.otherOrganization}
                  onChange={(e) => setFormData({ ...formData, otherOrganization: e.target.value })}
                  required
                  className="w-full px-4 py-3 lg:py-3.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200 group-hover:border-gray-400"
                  placeholder="Nombre de tu organización"
                />
              </div>
            )}
          </div>
        )}

        {/* PASO 2: Relevo de Responsabilidad */}
        {currentStep === 2 && (
          <div className="space-y-3 lg:space-y-4 animate-slide-in">
            <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border-l-4 border-yellow-500 p-4 rounded-r-lg mb-4 lg:mb-6 shadow-sm">
              <div className="flex items-start gap-3">
                <span className="text-2xl">⚠️</span>
                <div>
                  <p className="text-sm font-semibold text-gray-800 mb-1">Importante</p>
                  <p className="text-xs lg:text-sm text-gray-700">
                    Lee cuidadosamente cada sección y marca que aceptas cada una de ellas para continuar.
                  </p>
                </div>
              </div>
            </div>

            {[
              { id: 'activityDescription', icon: '📋', title: 'Descripción de la Actividad', desc: 'Consiento participar como voluntario(a) en el Beach Cleanup Event. Las actividades incluirán recoger y transportar escombros y clasificar artículos para su eliminación.' },
              { id: 'conditionsAndPrecautions', icon: '🌤️', title: 'Condiciones y Precauciones', desc: 'Actividades al aire libre, terreno irregular. No nadar. No recoger desechos peligrosos.' },
              { id: 'equipmentAndSupplies', icon: '🧤', title: 'Equipo y Suministros', desc: 'Doce25 proporcionará equipo de protección. Se recomienda zapatos cerrados.' },
              { id: 'participantCommitments', icon: '🤝', title: 'Compromisos del Participante', desc: 'Seguiré instrucciones del personal. Actividad física extenuante.' },
              { id: 'healthStatus', icon: '💪', title: 'Estado de Salud', desc: 'Gozo de buena salud. Sin limitaciones físicas.' },
              { id: 'rightsReserve', icon: '🚪', title: 'Reserva de Derechos', desc: 'Doce25 se reserva el Derecho de Admisión.' },
              { id: 'waiverAndRelease', icon: '⚖️', title: 'Renuncia y Liberación de Responsabilidad', desc: 'Relevo a Doce25 de toda responsabilidad por cualquier daño.', highlight: true },
              { id: 'mediaAuthorization', icon: '📸', title: 'Autorización de Medios', desc: 'Permito uso de fotografías y videos para fines de Doce25.' },
              { id: 'conductCommitment', icon: '✅', title: 'Compromiso de Conducta', desc: 'Cumpliré medidas de seguridad y normas de conducta.' },
              { id: 'alcoholUse', icon: '🍺', title: 'Uso de Bebidas Alcohólicas', desc: 'Confirmo mayoría de edad (18+) o me abstendré de consumir alcohol.' },
              { id: 'declarationsAndStatements', icon: '📜', title: 'Declaraciones y Afirmaciones', desc: 'He leído y comprendido completamente este formulario.' },
            ].map((item) => (
              <div 
                key={item.id}
                className={`
                  group border-2 rounded-xl p-4 lg:p-5 transition-all duration-200 cursor-pointer
                  ${formData[item.id as keyof typeof formData] 
                    ? 'border-green-400 bg-green-50 shadow-sm' 
                    : item.highlight 
                      ? 'border-red-300 bg-red-50 hover:border-red-400' 
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                  }
                `}
                onClick={() => setFormData({ ...formData, [item.id]: !formData[item.id as keyof typeof formData] })}
              >
                <div className="flex items-start gap-3">
                  <input
                    id={item.id}
                    type="checkbox"
                    checked={formData[item.id as keyof typeof formData] as boolean}
                    onChange={(e) => setFormData({ ...formData, [item.id]: e.target.checked })}
                    className="mt-1 h-5 w-5 text-cyan-600 border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 cursor-pointer"
                  />
                  <label htmlFor={item.id} className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">{item.icon}</span>
                      <strong className={`text-sm lg:text-base ${item.highlight ? 'text-red-700' : 'text-gray-800'}`}>
                        {item.title}
                      </strong>
                    </div>
                    <p className="text-xs lg:text-sm text-gray-600 leading-relaxed">
                      {item.desc}
                    </p>
                  </label>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* PASO 3: Firma */}
        {currentStep === 3 && (
          <div className="space-y-5 lg:space-y-6 animate-slide-in">
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-l-4 border-blue-500 p-4 lg:p-5 rounded-r-xl shadow-sm">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🎉</span>
                <div>
                  <p className="text-sm lg:text-base font-semibold text-gray-800 mb-1">¡Último paso!</p>
                  <p className="text-xs lg:text-sm text-gray-700">
                    Firma electrónicamente para completar tu registro y recibir tu código QR.
                  </p>
                </div>
              </div>
            </div>

            {/* Firma */}
            <div className="group">
              <label htmlFor="signature" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <span className="text-lg">✍️</span> Firma del Participante *
              </label>
              <div className="relative">
                <input
                  id="signature"
                  type="text"
                  value={formData.signature}
                  onChange={(e) => setFormData({ ...formData, signature: e.target.value })}
                  required
                  placeholder="Escriba su nombre completo como firma"
                  className="w-full px-4 py-4 lg:py-5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200 group-hover:border-gray-400 font-serif text-xl lg:text-2xl text-center bg-gradient-to-r from-gray-50 to-blue-50"
                />
              </div>
              <p className="mt-2 text-xs lg:text-sm text-gray-500 text-center">
                Su nombre completo actúa como su firma electrónica
              </p>
            </div>

            {/* Fecha */}
            <div className="group">
              <label htmlFor="signatureDate" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <span className="text-lg">📅</span> Fecha de Firma *
              </label>
              <input
                id="signatureDate"
                type="date"
                value={formData.signatureDate}
                onChange={(e) => setFormData({ ...formData, signatureDate: e.target.value })}
                required
                className="w-full px-4 py-3 lg:py-3.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200 group-hover:border-gray-400 bg-white"
              />
            </div>

            {/* Información de Contacto */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 lg:p-5">
              <h3 className="font-semibold text-sm lg:text-base text-gray-800 mb-2 flex items-center gap-2">
                <span className="text-lg">📞</span> Información de Contacto
              </h3>
              <p className="text-xs lg:text-sm text-gray-600">
                En caso de preguntas:{' '}
                <a href="mailto:info@dosce25.org" className="text-cyan-600 hover:underline font-medium">
                  info@dosce25.org
                </a>
              </p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 lg:py-4 rounded-xl animate-shake flex items-start gap-3 shadow-sm">
            <span className="text-xl">⚠️</span>
            <div className="flex-1">
              <p className="font-semibold text-sm mb-1">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 pt-4 lg:pt-6">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={handleBack}
              className="sm:flex-1 px-6 py-3 lg:py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow"
            >
              <span>←</span> Anterior
            </button>
          )}
          
          {currentStep < 3 ? (
            <button
              type="button"
              onClick={handleNext}
              className="sm:flex-1 bg-gradient-to-r from-cyan-500 to-teal-500 text-white py-3 lg:py-4 rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2 shadow-md"
            >
              Siguiente <span>→</span>
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className="sm:flex-1 bg-gradient-to-r from-emerald-500 to-green-500 text-white py-3 lg:py-4 rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-200 flex items-center justify-center gap-2 shadow-md"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Enviando...
                </>
              ) : (
                <>
                  <span>✓</span> Completar Registro
                </>
              )}
            </button>
          )}
        </div>

        {currentStep === 3 && (
          <p className="text-xs text-center text-gray-500 pt-2">
            Al enviar, confirmas que has leído y aceptado todos los términos.
          </p>
        )}
      </form>
    </div>
  )
}

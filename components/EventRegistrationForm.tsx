'use client'

import { useState } from 'react'
import { registerForEvent } from '@/lib/api'

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
      <div className="text-center py-8">
        <div className="text-6xl mb-4">✅</div>
        <h3 className="text-2xl font-bold mb-2 text-green-600">¡Registro exitoso!</h3>
        <p className="text-gray-600 mb-4">
          Te hemos enviado un email con tu código QR. Revísalo para confirmar tu asistencia.
        </p>
        <p className="text-sm text-gray-500">
          En caso de preguntas o más detalles, contáctanos a info@dosce25.org
        </p>
      </div>
    )
  }

  return (
    <div>
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Paso {currentStep} de 3</span>
          <span className="text-sm text-gray-500">{Math.round((currentStep / 3) * 100)}% completado</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-cyan-500 to-teal-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${(currentStep / 3) * 100}%` }}
          />
        </div>
        <div className="flex justify-between mt-2">
          <span className={`text-xs ${currentStep >= 1 ? 'text-cyan-600 font-semibold' : 'text-gray-400'}`}>
            Información
          </span>
          <span className={`text-xs ${currentStep >= 2 ? 'text-cyan-600 font-semibold' : 'text-gray-400'}`}>
            Relevo
          </span>
          <span className={`text-xs ${currentStep >= 3 ? 'text-cyan-600 font-semibold' : 'text-gray-400'}`}>
            Firma
          </span>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-2 text-gray-900">
        {currentStep === 1 && 'Información del Participante'}
        {currentStep === 2 && 'Relevo de Responsabilidad'}
        {currentStep === 3 && 'Firma Electrónica'}
      </h2>
      <p className="text-sm text-gray-600 mb-6">
        {currentStep === 1 && 'Completa tu información personal para continuar'}
        {currentStep === 2 && 'Lee y acepta cada uno de los términos del relevo'}
        {currentStep === 3 && 'Firma el documento para completar tu registro'}
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* PASO 1: Información */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                Dos Apellidos y Nombre (Ejemplo: Pérez Cintrón, Juan) *
              </label>
              <input
                id="fullName"
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
                placeholder="Apellidos, Nombre"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="ageRange" className="block text-sm font-medium text-gray-700 mb-2">
                Rango de Edad *
              </label>
              <select
                id="ageRange"
                value={formData.ageRange}
                onChange={(e) => setFormData({ ...formData, ageRange: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              >
                <option value="">Selecciona...</option>
                <option value="Menor de 17 años">Menor de 17 años</option>
                <option value="18-24 años">18-24 años</option>
                <option value="25-34 años">25-34 años</option>
                <option value="35-44 años">35-44 años</option>
                <option value="45-54 años">45-54 años</option>
                <option value="55-64 años">55-64 años</option>
                <option value="65 años en adelante">65 años en adelante</option>
              </select>
            </div>

            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                Género *
              </label>
              <select
                id="gender"
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              >
                <option value="">Selecciona...</option>
                <option value="Femenino">Femenino</option>
                <option value="Masculino">Masculino</option>
                <option value="No-Binario">No-Binario</option>
                <option value="Prefiero No Decirlo">Prefiero No Decirlo</option>
              </select>
            </div>

            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                Ciudad/Pueblo de Origen *
              </label>
              <select
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              >
                <option value="">Selecciona...</option>
                {MUNICIPIOS_PR.map((municipio) => (
                  <option key={municipio} value={municipio}>{municipio}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="organization" className="block text-sm font-medium text-gray-700 mb-2">
                Organización a la que Perteneces *
              </label>
              <p className="text-xs text-gray-600 mb-2">
                - Si vienes por tu cuenta, marca &quot;Doce25&quot;<br />
                - Si vienes con tu empresa, escoge &quot;N/A, vengo con mi compañía&quot;
              </p>
              <select
                id="organization"
                value={formData.organization}
                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              >
                <option value="">Selecciona...</option>
                {ORGANIZACIONES.map((org) => (
                  <option key={org} value={org}>{org}</option>
                ))}
              </select>
            </div>

            {formData.organization === 'Otra' && (
              <div>
                <label htmlFor="otherOrganization" className="block text-sm font-medium text-gray-700 mb-2">
                  Si marcaste &quot;Otra&quot;, ¿Cuál? *
                </label>
                <input
                  id="otherOrganization"
                  type="text"
                  value={formData.otherOrganization}
                  onChange={(e) => setFormData({ ...formData, otherOrganization: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>
            )}
          </div>
        )}

        {/* PASO 2: Relevo de Responsabilidad */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-4">
              <p className="text-sm text-gray-700">
                <strong>Importante:</strong> Lee cuidadosamente cada sección y marca que aceptas cada una de ellas.
              </p>
            </div>

            {/* Checkbox 1 */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start">
                <input
                  id="activityDescription"
                  type="checkbox"
                  checked={formData.activityDescription}
                  onChange={(e) => setFormData({ ...formData, activityDescription: e.target.checked })}
                  className="mt-1 h-4 w-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
                />
                <label htmlFor="activityDescription" className="ml-3 text-sm text-gray-700">
                  <strong>Descripción de la Actividad:</strong><br />
                  Consiento participar como voluntario(a) en el Beach Cleanup Event. Las actividades incluirán recoger y transportar escombros y clasificar artículos para su eliminación. *
                </label>
              </div>
            </div>

            {/* Checkbox 2 */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start">
                <input
                  id="conditionsAndPrecautions"
                  type="checkbox"
                  checked={formData.conditionsAndPrecautions}
                  onChange={(e) => setFormData({ ...formData, conditionsAndPrecautions: e.target.checked })}
                  className="mt-1 h-4 w-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
                />
                <label htmlFor="conditionsAndPrecautions" className="ml-3 text-sm text-gray-700">
                  <strong>Condiciones y Precauciones:</strong><br />
                  Actividades al aire libre, terreno irregular. No nadar. No recoger desechos peligrosos. *
                </label>
              </div>
            </div>

            {/* Checkbox 3 */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start">
                <input
                  id="equipmentAndSupplies"
                  type="checkbox"
                  checked={formData.equipmentAndSupplies}
                  onChange={(e) => setFormData({ ...formData, equipmentAndSupplies: e.target.checked })}
                  className="mt-1 h-4 w-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
                />
                <label htmlFor="equipmentAndSupplies" className="ml-3 text-sm text-gray-700">
                  <strong>Equipo y Suministros:</strong><br />
                  Doce25 proporcionará equipo de protección. Se recomienda zapatos cerrados. *
                </label>
              </div>
            </div>

            {/* Checkbox 4 */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start">
                <input
                  id="participantCommitments"
                  type="checkbox"
                  checked={formData.participantCommitments}
                  onChange={(e) => setFormData({ ...formData, participantCommitments: e.target.checked })}
                  className="mt-1 h-4 w-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
                />
                <label htmlFor="participantCommitments" className="ml-3 text-sm text-gray-700">
                  <strong>Compromisos del Participante:</strong><br />
                  Seguiré instrucciones del personal. Actividad física extenuante. *
                </label>
              </div>
            </div>

            {/* Checkbox 5 */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start">
                <input
                  id="healthStatus"
                  type="checkbox"
                  checked={formData.healthStatus}
                  onChange={(e) => setFormData({ ...formData, healthStatus: e.target.checked })}
                  className="mt-1 h-4 w-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
                />
                <label htmlFor="healthStatus" className="ml-3 text-sm text-gray-700">
                  <strong>Estado de Salud:</strong><br />
                  Gozo de buena salud. Sin limitaciones físicas. *
                </label>
              </div>
            </div>

            {/* Checkbox 6 */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start">
                <input
                  id="rightsReserve"
                  type="checkbox"
                  checked={formData.rightsReserve}
                  onChange={(e) => setFormData({ ...formData, rightsReserve: e.target.checked })}
                  className="mt-1 h-4 w-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
                />
                <label htmlFor="rightsReserve" className="ml-3 text-sm text-gray-700">
                  <strong>Reserva de Derechos:</strong><br />
                  Doce25 se reserva el Derecho de Admisión. *
                </label>
              </div>
            </div>

            {/* Checkbox 7 - MÁS IMPORTANTE */}
            <div className="border-2 border-red-300 rounded-lg p-4 bg-red-50">
              <div className="flex items-start">
                <input
                  id="waiverAndRelease"
                  type="checkbox"
                  checked={formData.waiverAndRelease}
                  onChange={(e) => setFormData({ ...formData, waiverAndRelease: e.target.checked })}
                  className="mt-1 h-4 w-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
                />
                <label htmlFor="waiverAndRelease" className="ml-3 text-sm text-gray-700">
                  <strong className="text-red-700">Renuncia y Liberación de Responsabilidad:</strong><br />
                  Relevo a Doce25 de toda responsabilidad por cualquier daño. *
                </label>
              </div>
            </div>

            {/* Checkbox 8 */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start">
                <input
                  id="mediaAuthorization"
                  type="checkbox"
                  checked={formData.mediaAuthorization}
                  onChange={(e) => setFormData({ ...formData, mediaAuthorization: e.target.checked })}
                  className="mt-1 h-4 w-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
                />
                <label htmlFor="mediaAuthorization" className="ml-3 text-sm text-gray-700">
                  <strong>Autorización de Medios:</strong><br />
                  Permito uso de fotografías y videos para fines de Doce25. *
                </label>
              </div>
            </div>

            {/* Checkbox 9 */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start">
                <input
                  id="conductCommitment"
                  type="checkbox"
                  checked={formData.conductCommitment}
                  onChange={(e) => setFormData({ ...formData, conductCommitment: e.target.checked })}
                  className="mt-1 h-4 w-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
                />
                <label htmlFor="conductCommitment" className="ml-3 text-sm text-gray-700">
                  <strong>Compromiso de Conducta:</strong><br />
                  Cumpliré medidas de seguridad y normas de conducta. *
                </label>
              </div>
            </div>

            {/* Checkbox 10 */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start">
                <input
                  id="alcoholUse"
                  type="checkbox"
                  checked={formData.alcoholUse}
                  onChange={(e) => setFormData({ ...formData, alcoholUse: e.target.checked })}
                  className="mt-1 h-4 w-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
                />
                <label htmlFor="alcoholUse" className="ml-3 text-sm text-gray-700">
                  <strong>Uso de Bebidas Alcohólicas:</strong><br />
                  Confirmo mayoría de edad (18+) o me abstendré de consumir alcohol. *
                </label>
              </div>
            </div>

            {/* Checkbox 11 */}
            <div className="border border-gray-200 rounded-lg p-4 bg-yellow-50">
              <div className="flex items-start">
                <input
                  id="declarationsAndStatements"
                  type="checkbox"
                  checked={formData.declarationsAndStatements}
                  onChange={(e) => setFormData({ ...formData, declarationsAndStatements: e.target.checked })}
                  className="mt-1 h-4 w-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
                />
                <label htmlFor="declarationsAndStatements" className="ml-3 text-sm text-gray-700">
                  <strong>Declaraciones y Afirmaciones:</strong><br />
                  He leído y comprendido completamente este formulario. *
                </label>
              </div>
            </div>
          </div>
        )}

        {/* PASO 3: Firma */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
              <p className="text-sm text-gray-700">
                <strong>Último paso:</strong> Firma electrónicamente para completar tu registro.
              </p>
            </div>

            <div>
              <label htmlFor="signature" className="block text-sm font-medium text-gray-700 mb-2">
                Firma del Participante (Ejemplo: Juan Pérez Cintrón) *
              </label>
              <input
                id="signature"
                type="text"
                value={formData.signature}
                onChange={(e) => setFormData({ ...formData, signature: e.target.value })}
                required
                placeholder="Escriba su nombre completo como firma"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent font-serif text-xl"
              />
              <p className="text-xs text-gray-600 mt-1">
                Su nombre completo actúa como su firma electrónica
              </p>
            </div>

            <div>
              <label htmlFor="signatureDate" className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de Firma *
              </label>
              <input
                id="signatureDate"
                type="date"
                value={formData.signatureDate}
                onChange={(e) => setFormData({ ...formData, signatureDate: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-sm mb-2">Información de Contacto:</h3>
              <p className="text-xs text-gray-600">
                En caso de preguntas: <a href="mailto:info@dosce25.org" className="text-cyan-600 hover:underline">info@dosce25.org</a>
              </p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-4 pt-4">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={handleBack}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
            >
              ← Anterior
            </button>
          )}
          
          {currentStep < 3 ? (
            <button
              type="button"
              onClick={handleNext}
              className="flex-1 bg-gradient-to-r from-cyan-500 to-teal-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition"
            >
              Siguiente →
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-cyan-500 to-teal-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? 'Enviando...' : '✓ Completar Registro'}
            </button>
          )}
        </div>

        {currentStep === 3 && (
          <p className="text-xs text-center text-gray-500">
            Al enviar, confirmas que has leído y aceptado todos los términos.
          </p>
        )}
      </form>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { registerForEvent, RegisterEventData } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'

interface EventRegistrationFormProps {
  eventId: string
  onSuccess?: (email: string) => void
}

export function EventRegistrationForm({ eventId, onSuccess }: EventRegistrationFormProps) {
  const { user, token } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    email: user?.email || '',
    fullName: user?.fullName || '',
    ageRange: user?.ageRange || '',
    gender: user?.gender || '',
    city: user?.city || '',
    organization: user?.organization || '',
    otherOrganization: '',
    signature: '',
    signatureDate: new Date().toISOString().split('T')[0],
    allTermsAccepted: false,
  })

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        email: user.email || '',
        fullName: user.fullName || '',
        ageRange: user.ageRange || '',
        gender: user.gender || '',
        city: user.city || '',
        organization: user.organization || '',
      }))
    }
  }, [user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const validateStep = (step: number): boolean => {
    if (step === 1) {
      if (!formData.email || !formData.fullName || !formData.ageRange || !formData.gender || !formData.city) {
        setError('Por favor completa todos los campos obligatorios')
        return false
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        setError('Por favor ingresa un email válido')
        return false
      }
    }

    if (step === 2) {
      if (!formData.organization) {
        setError('Por favor selecciona una organización')
        return false
      }
      if (formData.organization === 'Otra' && !formData.otherOrganization) {
        setError('Por favor especifica tu organización')
        return false
      }
    }

    if (step === 3) {
      if (!formData.allTermsAccepted) {
        setError('Debes leer y aceptar todos los términos y condiciones para continuar')
        return false
      }

      if (!formData.signature) {
        setError('Por favor ingresa tu firma completa')
        return false
      }
    }

    setError('')
    return true
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3))
    }
  }

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateStep(3)) return

    setLoading(true)
    setError('')

    try {
      const data: RegisterEventData = {
        name: formData.fullName,
        email: formData.email,
        phone: '',
        termsAccepted: true,
        fullName: formData.fullName,
        ageRange: formData.ageRange,
        gender: formData.gender,
        city: formData.city,
        organization: formData.organization === 'Otra' ? formData.otherOrganization : formData.organization,
        otherOrganization: formData.otherOrganization,
        signature: formData.signature,
        signatureDate: formData.signatureDate,
      }

      // Enviar token si el usuario está logueado
      await registerForEvent(eventId, data, token || undefined)
      
      if (onSuccess) {
        onSuccess(formData.email)
      }
    } catch (err: any) {
      setError(err.message || 'Error al registrarse. Por favor intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                currentStep >= step 
                  ? 'bg-cyan-600 text-white' 
                  : 'bg-gray-200 text-gray-500'
              }`}>
                {step}
              </div>
              {step < 3 && (
                <div className={`flex-1 h-1 mx-2 transition-all ${
                  currentStep > step ? 'bg-cyan-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-gray-600 px-1">
          <span>Información Personal</span>
          <span>Organización</span>
          <span>Términos Legales</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Step 1: Personal Information */}
        {currentStep === 1 && (
          <div className="space-y-4 animate-slide-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                  placeholder="tu@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre Completo <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                  placeholder="Nombre Completo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rango de Edad <span className="text-red-500">*</span>
                </label>
                <select
                  name="ageRange"
                  value={formData.ageRange}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                >
                  <option value="">Seleccionar</option>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Género <span className="text-red-500">*</span>
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                >
                  <option value="">Seleccionar</option>
                  <option value="Femenino">Femenino</option>
                  <option value="Masculino">Masculino</option>
                  <option value="No-Binario">No-Binario</option>
                  <option value="Prefiero No Decirlo">Prefiero No Decirlo</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ciudad/Pueblo de Origen <span className="text-red-500">*</span>
                </label>
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                >
                  <option value="">Seleccionar</option>
                  {['Adjuntas', 'Aguada', 'Aguadilla', 'Aguas Buenas', 'Aibonito', 'Anasco', 'Arecibo', 'Arroyo', 'Barceloneta', 'Barranquitas', 'Bayamon', 'Cabo Rojo', 'Caguas', 'Camuy', 'Canovanas', 'Carolina', 'Catano', 'Cayey', 'Ceiba', 'Ciales', 'Cidra', 'Coamo', 'Comerio', 'Corozal', 'Culebra', 'Dorado', 'Fajardo', 'Florida', 'Guanica', 'Guayama', 'Guayanilla', 'Guaynabo', 'Gurabo', 'Hatillo', 'Hormigueros', 'Humacao', 'Isabela', 'Jayuya', 'Juana Diaz', 'Juncos', 'Lajas', 'Lares', 'Las Marias', 'Las Piedras', 'Loiza', 'Luquillo', 'Manati', 'Maricao', 'Maunabo', 'Mayaguez', 'Moca', 'Morovis', 'Naguabo', 'Naranjito', 'Orocovis', 'Patillas', 'Penuelas', 'Ponce', 'Quebradillas', 'Rincon', 'Rio Grande', 'Sabana Grande', 'Salinas', 'San German', 'San Juan', 'San Lorenzo', 'San Sebastian', 'Santa Isabel', 'Toa Alta', 'Toa Baja', 'Trujillo Alto', 'Utuado', 'Vega Alta', 'Vega Baja', 'Vieques', 'Villalba', 'Yabucoa', 'Yauco'].map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Organization */}
        {currentStep === 2 && (
          <div className="space-y-4 animate-slide-in">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Organización a la que Perteneces <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-600 mb-3">
                Si vienes por tu cuenta, marca &quot;Doce25&quot;. Si vienes con tu empresa, escoge &quot;N/A, vengo con mi compañía&quot;.
              </p>
              <select
                name="organization"
                value={formData.organization}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
              >
                <option value="">Seleccionar</option>
                {['Doce25', 'N/A, vengo con mi compañía', 'AEC UPR - Río Piedras', 'AEC UPR - Humacao', 'AEC UPR - Cayey', 'AEPREH UPR - Río Piedras', 'AMA Universidad Sagrado Corazón', 'AMIE UPR - Río Piedras', 'AMSA PUPR - San Juan', 'AMSA UPR - Bayamón', 'AMSA UPR - Cayey', 'AMSA UPR - Río Piedras', 'AMWA UPR - Río Piedras', 'ASHIEV UPR - Bayamón', 'Asociación de Microbiología Inter - Metro', 'AUETS UPR - Humacao', 'Chemistry Student Association UIPR - Metro', 'Círculo de Pre-Médica PUCPR - Ponce', 'Círculo de Química UPR - Cayey', 'CUDAS UPR - Cayey', 'FPA UPR - Bayamón', 'FPA UPR - Cayey', 'FPA UPR - Humacao', 'Future ONCOS UPR - Río Piedras', 'IQ Dermos UPR - Río Piedras', 'Medlife PUCPR - Ponce', 'Medlife UAGM - Cupey', 'Medlife UAGM - Gurabo', 'Medlife UPR - Cayey', 'Neuroboricuas UPR - Arecibo', 'Neuroboricuas UPR - Bayamón', 'Neuroboricuas UPR - Cayey', 'NSCS UPR - Río Piedras', 'NSLS UPR - Humacao', 'ONCOSS UPR - Río Piedras', 'Phi Lambda Upsilon UPR - Mayagüez', 'PPAW UPR - Bayamón', 'Pre-Law UPR - Cayey', 'PRPDA UPR - Cayey', 'PRPDA UPR - Humacao', 'PRPDA UPR - Río Piedras', 'PSYCHI UPR - Cayey', 'Rotaract UPR - Río Piedras', 'SACNAS UPR - Río Piedras', 'Salut Vito UPR - Río Piedras', 'Taínos Dance Team UAGM - Gurabo', 'TMED UPR - Cayey', 'Tribeta UPR - Cayey', 'WINS UPR - Río Piedras', 'Otra'].map(org => (
                  <option key={org} value={org}>{org}</option>
                ))}
              </select>
            </div>

            {formData.organization === 'Otra' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Especifica tu Organización <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="otherOrganization"
                  value={formData.otherOrganization}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                  placeholder="Nombre de tu organización"
                />
              </div>
            )}
          </div>
        )}

        {/* Step 3: Legal Terms */}
        {currentStep === 3 && (
          <div className="space-y-4 animate-slide-in">
            <h3 className="text-base font-semibold text-gray-900">Relevo de Responsabilidad</h3>

            {/* Scrollable terms document */}
            <div className="h-64 overflow-y-auto border border-gray-200 rounded-lg bg-gray-50 p-4 space-y-3 text-xs text-gray-700 leading-relaxed">
              <div>
                <p className="font-semibold text-gray-900 mb-1">1. Descripción de la Actividad</p>
                <p>Consiento participar como voluntario(a) en el Beach Cleanup Event, incluyendo recoger y transportar escombros y clasificar artículos para su eliminación adecuada.</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-1">2. Condiciones y Precauciones</p>
                <p>Las actividades se llevarán a cabo al aire libre. Pueden estar presentes insectos o animales. No está permitido nadar durante el evento.</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-1">3. Equipo y Suministros</p>
                <p>Doce25 proporcionará equipo de protección personal y suministros adecuados. Se recomienda el uso de zapatos cerrados.</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-1">4. Compromisos del Participante</p>
                <p>Me comprometo a seguir las instrucciones del personal de Doce25 en todo momento y entiendo el funcionamiento correcto del equipo proporcionado.</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-1">5. Estado de Salud</p>
                <p>Declaro gozar de buena salud y no tener conocimiento de ningún problema físico que limite mi participación en las actividades del evento.</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-1">6. Reserva de Derechos</p>
                <p>Tortuga Club PR, Inc. dba Doce25 se reserva el Derecho de Admisión.</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-1">7. Renuncia y Liberación de Responsabilidad</p>
                <p>Renuncio y relevo a Doce25 y sus oficiales, directores, empleados y voluntarios de toda responsabilidad por cualquier reclamación, lesión, pérdida o daño que resulte de mi participación en el evento.</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-1">8. Autorización de Medios</p>
                <p>Otorgo permiso a Doce25 para tomar fotografías y grabaciones de video de mi persona durante el evento y utilizarlas con fines promocionales, educativos o informativos de la organización.</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-1">9. Compromiso de Conducta</p>
                <p>Me comprometo a cumplir con todas las medidas de seguridad y normas de conducta informadas por el equipo organizador.</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-1">10. Uso de Bebidas Alcohólicas</p>
                <p>Confirmo que tengo la mayoría de edad para consumir bebidas alcohólicas según las leyes de Puerto Rico (18 años o más).</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-1">11. Declaraciones y Afirmaciones</p>
                <p>Declaro que he leído y comprendido completamente este formulario antes de proporcionar mi consentimiento y firma electrónica, y que toda la información que he proporcionado es verídica y correcta.</p>
              </div>
            </div>

            {/* Single acceptance checkbox */}
            <label className="flex items-start gap-3 p-3 border border-cyan-200 rounded-lg bg-cyan-50 cursor-pointer hover:bg-cyan-100 transition-colors">
              <input
                type="checkbox"
                name="allTermsAccepted"
                checked={formData.allTermsAccepted}
                onChange={handleChange}
                className="mt-0.5 h-5 w-5 text-cyan-600 rounded border-gray-300 focus:ring-cyan-500 flex-shrink-0"
              />
              <span className="text-sm text-gray-800">
                He leído, entendido y acepto en su totalidad todos los términos, condiciones y el relevo de responsabilidad establecidos anteriormente. Entiendo que mi participación en el evento es voluntaria y que estoy sujeto(a) a las normas descritas.
              </span>
            </label>

            {/* Signature fields */}
            <div className="pt-2 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Firma del Participante <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="signature"
                    value={formData.signature}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                    placeholder="Nombre Completo"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="signatureDate"
                    value={formData.signatureDate}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={prevStep}
              className="px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Anterior
            </button>
          ) : (
            <div></div>
          )}

          {currentStep < 3 ? (
            <button
              type="button"
              onClick={nextStep}
              className="px-5 py-2 text-sm font-medium text-white bg-cyan-600 rounded-lg hover:bg-cyan-700 transition-colors"
            >
              Siguiente
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-sm font-medium text-white bg-gradient-to-r from-cyan-600 to-teal-600 rounded-lg hover:from-cyan-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? 'Registrando...' : 'Completar Registro'}
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

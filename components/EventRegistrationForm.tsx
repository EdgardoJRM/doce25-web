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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validar que todos los checkboxes estén marcados
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
      return
    }

    if (!formData.signature.trim()) {
      setError('Debes firmar el documento')
      return
    }

    setLoading(true)

    try {
      await registerForEvent(eventId, {
        email: formData.email,
        name: formData.fullName,
        phone: '', // Opcional, no está en el formulario de Google
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
      <h2 className="text-2xl font-bold mb-2 text-gray-900">Consentimiento Participantes | Limpieza de Playa</h2>
      <p className="text-sm text-gray-600 mb-6">
        Al enviar este formulario, aceptas participar en el evento y cumplir con todas las condiciones establecidas.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información del Participante */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
          <h3 className="font-bold text-lg mb-2">Información del Participante</h3>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            1. Email *
          </label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
            2. Dos Apellidos y Nombre (Ejemplo: Pérez Cintrón, Juan) *
          </label>
          <input
            id="fullName"
            type="text"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            required
            placeholder="Apellidos, Nombre"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="ageRange" className="block text-sm font-medium text-gray-700 mb-2">
            3. Rango de Edad *
          </label>
          <select
            id="ageRange"
            value={formData.ageRange}
            onChange={(e) => setFormData({ ...formData, ageRange: e.target.value })}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            4. Género *
          </label>
          <select
            id="gender"
            value={formData.gender}
            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            5. Ciudad/Pueblo de Origen *
          </label>
          <select
            id="city"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Selecciona...</option>
            {MUNICIPIOS_PR.map((municipio) => (
              <option key={municipio} value={municipio}>{municipio}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="organization" className="block text-sm font-medium text-gray-700 mb-2">
            6. Organización a la que Perteneces *
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              7. Si marcaste &quot;Otra&quot;, ¿Cuál? *
            </label>
            <input
              id="otherOrganization"
              type="text"
              value={formData.otherOrganization}
              onChange={(e) => setFormData({ ...formData, otherOrganization: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        )}

        {/* Relevo de Responsabilidad */}
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 my-6">
          <h3 className="font-bold text-lg mb-2">Relevo de Responsabilidad</h3>
          <p className="text-sm text-gray-700">
            Lee cuidadosamente cada sección y marca que aceptas cada una de ellas.
          </p>
        </div>

        {/* Checkbox 8 */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-start">
            <input
              id="activityDescription"
              type="checkbox"
              checked={formData.activityDescription}
              onChange={(e) => setFormData({ ...formData, activityDescription: e.target.checked })}
              required
              className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="activityDescription" className="ml-3 text-sm text-gray-700">
              <strong>8. Descripción de la Actividad:</strong><br />
              Yo, por voluntad propia y debidamente informado(a), consiento participar como voluntario(a) en el Beach Cleanup Event. Las actividades incluirán recoger y transportar escombros dejados en la costa y clasificar los artículos para su eliminación adecuada. *
            </label>
          </div>
        </div>

        {/* Checkbox 9 */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-start">
            <input
              id="conditionsAndPrecautions"
              type="checkbox"
              checked={formData.conditionsAndPrecautions}
              onChange={(e) => setFormData({ ...formData, conditionsAndPrecautions: e.target.checked })}
              required
              className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="conditionsAndPrecautions" className="ml-3 text-sm text-gray-700">
              <strong>9. Condiciones y Precauciones:</strong><br />
              Las actividades se llevarán a cabo al aire libre en condiciones cálidas y soleadas e implicarán caminar sobre terreno irregular. No se permite nadar, pero los participantes pueden meterse en el agua bajo su propio riesgo. Los voluntarios no deben recoger ningún desecho que pueda causarles daño. *
            </label>
          </div>
        </div>

        {/* Checkbox 10 */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-start">
            <input
              id="equipmentAndSupplies"
              type="checkbox"
              checked={formData.equipmentAndSupplies}
              onChange={(e) => setFormData({ ...formData, equipmentAndSupplies: e.target.checked })}
              required
              className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="equipmentAndSupplies" className="ml-3 text-sm text-gray-700">
              <strong>10. Equipo y Suministros:</strong><br />
              Doce25 proporcionará todo el equipo de protección personal y los suministros adecuados. El Organizador recomienda el uso de zapatos cerrados en todo momento. *
            </label>
          </div>
        </div>

        {/* Checkbox 11 */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-start">
            <input
              id="participantCommitments"
              type="checkbox"
              checked={formData.participantCommitments}
              onChange={(e) => setFormData({ ...formData, participantCommitments: e.target.checked })}
              required
              className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="participantCommitments" className="ml-3 text-sm text-gray-700">
              <strong>11. Compromisos del Participante:</strong><br />
              Acepto seguir las instrucciones del personal de Doce25 en todo momento. Me aseguraré de que cualquier menor a mi cargo también siga las instrucciones. Comprendo que mi participación puede implicar actividad física extenuante. *
            </label>
          </div>
        </div>

        {/* Checkbox 12 */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-start">
            <input
              id="healthStatus"
              type="checkbox"
              checked={formData.healthStatus}
              onChange={(e) => setFormData({ ...formData, healthStatus: e.target.checked })}
              required
              className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="healthStatus" className="ml-3 text-sm text-gray-700">
              <strong>12. Estado de Salud:</strong><br />
              Declaro gozar de buena salud y no tener conocimiento de ningún problema o condición física que limite mi participación. Comprendo que la atención médica puede no estar fácilmente disponible. *
            </label>
          </div>
        </div>

        {/* Checkbox 13 */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-start">
            <input
              id="rightsReserve"
              type="checkbox"
              checked={formData.rightsReserve}
              onChange={(e) => setFormData({ ...formData, rightsReserve: e.target.checked })}
              required
              className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="rightsReserve" className="ml-3 text-sm text-gray-700">
              <strong>13. Reserva de Derechos:</strong><br />
              Los organizadores, Tortuga Club PR, Inc. dba Doce25, se reservan el Derecho de Admisión. *
            </label>
          </div>
        </div>

        {/* Checkbox 14 */}
        <div className="border border-gray-200 rounded-lg p-4 bg-red-50">
          <div className="flex items-start">
            <input
              id="waiverAndRelease"
              type="checkbox"
              checked={formData.waiverAndRelease}
              onChange={(e) => setFormData({ ...formData, waiverAndRelease: e.target.checked })}
              required
              className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="waiverAndRelease" className="ml-3 text-sm text-gray-700">
              <strong>14. Renuncia y Liberación de Responsabilidad:</strong><br />
              Renuncio y relevo a la organización Doce25, legalmente conocida como Tortuga Club PR, Inc., sus oficiales y voluntarios de toda responsabilidad por cualquier reclamación o daño que resulte de mi participación. *
            </label>
          </div>
        </div>

        {/* Checkbox 15 */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-start">
            <input
              id="mediaAuthorization"
              type="checkbox"
              checked={formData.mediaAuthorization}
              onChange={(e) => setFormData({ ...formData, mediaAuthorization: e.target.checked })}
              required
              className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="mediaAuthorization" className="ml-3 text-sm text-gray-700">
              <strong>15. Autorización de Medios:</strong><br />
              Otorgo permiso a Doce25 para tomar fotografías y grabaciones de video de mi persona y para exhibir, publicar o utilizar cualquier fotografía o grabación para los fines de Doce25. *
            </label>
          </div>
        </div>

        {/* Checkbox 16 */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-start">
            <input
              id="conductCommitment"
              type="checkbox"
              checked={formData.conductCommitment}
              onChange={(e) => setFormData({ ...formData, conductCommitment: e.target.checked })}
              required
              className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="conductCommitment" className="ml-3 text-sm text-gray-700">
              <strong>16. Compromiso de Conducta:</strong><br />
              Me comprometo a cumplir con las medidas de seguridad y las normas de conducta. Respetaré las instrucciones del personal en todo momento. *
            </label>
          </div>
        </div>

        {/* Checkbox 17 */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-start">
            <input
              id="alcoholUse"
              type="checkbox"
              checked={formData.alcoholUse}
              onChange={(e) => setFormData({ ...formData, alcoholUse: e.target.checked })}
              required
              className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="alcoholUse" className="ml-3 text-sm text-gray-700">
              <strong>17. Uso de Bebidas Alcohólicas:</strong><br />
              Confirmo que tengo la mayoría de edad para consumir bebidas alcohólicas según las leyes de Puerto Rico (18 años o más). De no contar con la mayoría de edad, no podré ingerir ni hacer uso de las mismas. *
            </label>
          </div>
        </div>

        {/* Checkbox 18 */}
        <div className="border border-gray-200 rounded-lg p-4 bg-yellow-50">
          <div className="flex items-start">
            <input
              id="declarationsAndStatements"
              type="checkbox"
              checked={formData.declarationsAndStatements}
              onChange={(e) => setFormData({ ...formData, declarationsAndStatements: e.target.checked })}
              required
              className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="declarationsAndStatements" className="ml-3 text-sm text-gray-700">
              <strong>18. Declaraciones y Afirmaciones:</strong><br />
              Declaro que he leído y comprendido completamente el siguiente formulario antes de proporcionar mi consentimiento y firma electrónica. *
            </label>
          </div>
        </div>

        {/* Firma */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-6">
          <h3 className="font-bold text-lg mb-2">Firma Electrónica</h3>
        </div>

        <div>
          <label htmlFor="signature" className="block text-sm font-medium text-gray-700 mb-2">
            19. Firma del Participante (Ejemplo: Juan Pérez Cintrón) *
          </label>
          <input
            id="signature"
            type="text"
            value={formData.signature}
            onChange={(e) => setFormData({ ...formData, signature: e.target.value })}
            required
            placeholder="Escriba su nombre completo como firma"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-serif text-lg"
          />
          <p className="text-xs text-gray-600 mt-1">
            Su nombre completo actúa como su firma electrónica
          </p>
        </div>

        <div>
          <label htmlFor="signatureDate" className="block text-sm font-medium text-gray-700 mb-2">
            20. Día que FIRMÓ Documento *
          </label>
          <input
            id="signatureDate"
            type="date"
            value={formData.signatureDate}
            onChange={(e) => setFormData({ ...formData, signatureDate: e.target.value })}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Información de Contacto */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 my-6">
          <h3 className="font-semibold text-sm mb-2">Información de Contacto de la Organización:</h3>
          <p className="text-xs text-gray-600">
            En caso de preguntas o para obtener más detalles, puedes contactarnos a{' '}
            <a href="mailto:info@dosce25.org" className="text-blue-600 hover:underline">info@dosce25.org</a>
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg hover:shadow-xl"
        >
          {loading ? 'Enviando Registro...' : 'Enviar Formulario de Registro'}
        </button>

        <p className="text-xs text-center text-gray-500 mt-4">
          Al enviar este formulario, confirmas que has leído, comprendido y aceptado todos los términos y condiciones.
        </p>
      </form>
    </div>
  )
}

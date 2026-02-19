'use client'

import { useState } from 'react'
import Link from 'next/link'
import { sendStaffForm } from '@/lib/api'

export default function VoluntariosStaffPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    experience: '',
    availability: '',
    message: '',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await sendStaffForm(formData)
      setSuccess(true)
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        experience: '',
        availability: '',
        message: '',
      })
    } catch (err: any) {
      setError(err.message || 'Error al enviar. Por favor intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-6xl mb-4">👥</div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Únete como Voluntario Staff
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              ¿Quieres ser parte del equipo que lidera las limpiezas? Como staff voluntario coordinarás actividades, apoyarás a los participantes y amplificarás nuestro impacto.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            {success ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">✅</div>
                <h2 className="text-2xl font-bold text-green-600 mb-2">
                  ¡Solicitud Enviada!
                </h2>
                <p className="text-gray-600 mb-6">
                  Gracias por tu interés en ser parte del staff. Nos pondremos en contacto contigo pronto.
                </p>
                <Link
                  href="/"
                  className="text-cyan-600 hover:text-cyan-700 font-semibold"
                >
                  ← Volver al inicio
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre completo *
                    </label>
                    <input
                      id="fullName"
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      placeholder="Tu nombre"
                    />
                  </div>
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      placeholder="tu@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono (opcional)
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="+1 787 000 0000"
                  />
                </div>

                <div>
                  <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-2">
                    Experiencia / Habilidades (opcional)
                  </label>
                  <textarea
                    id="experience"
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="Cuéntanos sobre tu experiencia en voluntariado, liderazgo, organización de eventos..."
                  />
                </div>

                <div>
                  <label htmlFor="availability" className="block text-sm font-medium text-gray-700 mb-2">
                    Disponibilidad (opcional)
                  </label>
                  <select
                    id="availability"
                    value={formData.availability}
                    onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  >
                    <option value="">Selecciona una opción</option>
                    <option value="fines-semana">Fines de semana</option>
                    <option value="entre-semana">Entre semana</option>
                    <option value="flexible">Flexible</option>
                    <option value="eventos">Solo en eventos específicos</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Mensaje adicional (opcional)
                  </label>
                  <textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="¿Por qué quieres ser parte del staff?"
                  />
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white py-4 rounded-full font-semibold text-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  {loading ? 'Enviando...' : 'Enviar solicitud'}
                </button>
              </form>
            )}
          </div>

          <div className="mt-8 text-center">
            <Link href="/" className="text-gray-600 hover:text-cyan-600">
              ← Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}


'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { updateUserProfile } from '@/lib/api'

export default function EditProfilePage() {
  const router = useRouter()
  const { user, token, loading: authLoading, updateUser } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    ageRange: '',
    gender: '',
    city: '',
    organization: '',
  })

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    } else if (user) {
      setFormData({
        fullName: user.fullName || '',
        phone: user.phone || '',
        ageRange: user.ageRange || '',
        gender: user.gender || '',
        city: user.city || '',
        organization: user.organization || '',
      })
    }
  }, [authLoading, user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    if (!token) {
      setError('No estás autenticado')
      return
    }

    setLoading(true)

    try {
      const data = await updateUserProfile(token, {
        fullName: formData.fullName,
        phone: formData.phone || undefined,
        ageRange: formData.ageRange || undefined,
        gender: formData.gender || undefined,
        city: formData.city || undefined,
        organization: formData.organization || undefined,
      })

      updateUser(data.user)
      setSuccess(true)
      setTimeout(() => {
        router.push('/perfil')
      }, 2000)
    } catch (err: any) {
      setError(err.message || 'Error al actualizar perfil')
    } finally {
      setLoading(false)
    }
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
      <div className="max-w-2xl w-full mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Link
            href="/perfil"
            className="inline-flex items-center text-cyan-600 hover:text-cyan-700 mb-4 text-sm sm:text-base min-h-[44px] sm:min-h-0"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver al perfil
          </Link>
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-2">
            Editar Perfil
          </h1>
          <p className="text-base sm:text-lg text-gray-600">
            Actualiza tu información personal
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 md:p-8">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              ¡Perfil actualizado exitosamente! Redirigiendo...
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email (Read-only) */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">
                El email no se puede cambiar
              </p>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nombre Completo <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                placeholder="Dos Apellidos y Nombre"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Teléfono
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                placeholder="(787) 123-4567"
              />
            </div>

            {/* Age Range */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Rango de Edad
              </label>
              <select
                value={formData.ageRange}
                onChange={(e) => setFormData({ ...formData, ageRange: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
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

            {/* Gender */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Género
              </label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
              >
                <option value="">Selecciona...</option>
                <option value="Femenino">Femenino</option>
                <option value="Masculino">Masculino</option>
                <option value="No-Binario">No-Binario</option>
                <option value="Prefiero No Decirlo">Prefiero No Decirlo</option>
              </select>
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Ciudad/Pueblo
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                placeholder="San Juan"
              />
            </div>

            {/* Organization */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Organización
              </label>
              <input
                type="text"
                value={formData.organization}
                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                placeholder="Doce25, UPR, etc."
              />
            </div>

            {/* Buttons */}
            <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:flex-1 bg-gradient-to-r from-cyan-600 to-teal-600 text-white py-4 min-h-[48px] rounded-lg font-semibold text-base sm:text-lg hover:shadow-xl sm:hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {loading ? 'Guardando...' : 'Guardar Cambios'}
              </button>
              <Link
                href="/perfil"
                className="inline-flex justify-center items-center w-full sm:w-auto px-8 py-4 min-h-[48px] border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors shrink-0"
              >
                Cancelar
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}



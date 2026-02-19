'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getAllUsers } from '@/lib/api'

interface User {
  userId: string
  email: string
  fullName: string
  phone?: string
  ageRange?: string
  gender?: string
  city?: string
  organization?: string
  createdAt: string
  lastLogin: string
  status: string
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      const data = await getAllUsers()
      setUsers(data.users || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter(user =>
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.organization && user.organization.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <div className="min-h-screen bg-gray-50 py-4 lg:py-8">
      <div className="container mx-auto px-4">
        {/* Header - Responsive */}
        <div className="mb-6 lg:mb-8">
          <h1 className="text-2xl lg:text-4xl font-bold text-gray-900 mb-2">
            Usuarios Registrados
          </h1>
          <p className="text-sm lg:text-base text-gray-600">
            Gestiona los usuarios de la plataforma
          </p>
        </div>

        {/* Stats Cards - Responsive */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-6 lg:mb-8">
          <div className="bg-white rounded-lg lg:rounded-xl shadow-lg p-3 lg:p-6 border-t-4 border-cyan-500">
            <div className="text-2xl lg:text-3xl font-bold text-cyan-600 mb-1 lg:mb-2">
              {users.length}
            </div>
            <div className="text-xs lg:text-base text-gray-600 font-semibold">
              Total Usuarios
            </div>
          </div>
          <div className="bg-white rounded-lg lg:rounded-xl shadow-lg p-3 lg:p-6 border-t-4 border-green-500">
            <div className="text-2xl lg:text-3xl font-bold text-green-600 mb-1 lg:mb-2">
              {users.filter(u => u.status === 'active').length}
            </div>
            <div className="text-xs lg:text-base text-gray-600 font-semibold">
              Activos
            </div>
          </div>
          <div className="bg-white rounded-lg lg:rounded-xl shadow-lg p-3 lg:p-6 border-t-4 border-orange-500">
            <div className="text-2xl lg:text-3xl font-bold text-orange-600 mb-1 lg:mb-2">
              {users.filter(u => {
                const lastLogin = new Date(u.lastLogin)
                const daysSince = (Date.now() - lastLogin.getTime()) / (1000 * 60 * 60 * 24)
                return daysSince <= 7
              }).length}
            </div>
            <div className="text-xs lg:text-base text-gray-600 font-semibold">
              Activos (7d)
            </div>
          </div>
          <div className="bg-white rounded-lg lg:rounded-xl shadow-lg p-3 lg:p-6 border-t-4 border-teal-500">
            <div className="text-2xl lg:text-3xl font-bold text-teal-600 mb-1 lg:mb-2">
              {users.filter(u => {
                const created = new Date(u.createdAt)
                const daysSince = (Date.now() - created.getTime()) / (1000 * 60 * 60 * 24)
                return daysSince <= 30
              }).length}
            </div>
            <div className="text-xs lg:text-base text-gray-600 font-semibold">
              Nuevos (30d)
            </div>
          </div>
        </div>

        {/* Search Bar - Responsive */}
        <div className="bg-white rounded-lg lg:rounded-xl shadow-lg p-4 lg:p-6 mb-4 lg:mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-4 h-4 lg:w-5 lg:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Buscar por nombre, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 lg:py-3 text-sm lg:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Users - Responsive */}
        <div className="bg-white rounded-lg lg:rounded-xl shadow-lg overflow-hidden">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando usuarios...</p>
            </div>
          ) : error ? (
            <div className="p-6 bg-red-50 border border-red-200 text-red-700">
              {error}
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No se encontraron usuarios</p>
            </div>
          ) : (
            <>
              {/* Vista móvil - Cards */}
              <div className="lg:hidden p-4 space-y-4">
                {filteredUsers.map((user) => (
                  <div key={user.userId} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-3 flex-shrink-0">
                        {user.fullName.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 truncate">{user.fullName}</h3>
                        <p className="text-sm text-gray-500 truncate">{user.email}</p>
                        <span className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-semibold ${
                          user.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {user.status === 'active' ? '✓ Activo' : 'Inactivo'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-1 text-sm text-gray-600 mb-3">
                      {user.phone && <p>📞 {user.phone}</p>}
                      {user.city && <p>📍 {user.city}</p>}
                      {user.organization && <p>🏢 {user.organization}</p>}
                      <p className="text-xs">📅 Registrado: {new Date(user.createdAt).toLocaleDateString('es-PR')}</p>
                    </div>

                    <Link
                      href={`/admin/usuarios/${user.userId}`}
                      className="block w-full text-center bg-cyan-50 text-cyan-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-cyan-100 transition"
                    >
                      Ver Detalles →
                    </Link>
                  </div>
                ))}
              </div>

              {/* Vista desktop - Tabla */}
              <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Usuario
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Contacto
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Organización
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Registrado
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.userId} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                            {user.fullName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">
                              {user.fullName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          {user.phone && (
                            <div className="text-gray-900">{user.phone}</div>
                          )}
                          {user.city && (
                            <div className="text-gray-500">{user.city}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {user.organization || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {new Date(user.createdAt).toLocaleDateString('es-PR')}
                        </div>
                        <div className="text-xs text-gray-500">
                          Último login: {new Date(user.lastLogin).toLocaleDateString('es-PR')}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          user.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {user.status === 'active' ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          href={`/admin/usuarios/${user.userId}`}
                          className="text-cyan-600 hover:text-cyan-700 font-semibold"
                        >
                          Ver Detalles →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}


'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'

function LogoutButton() {
  const { signOut } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    await signOut()
    router.push('/admin/login')
  }

  return (
    <button
      onClick={handleLogout}
      className="text-red-600 hover:underline"
    >
      Salir
    </button>
  )
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user && !window.location.pathname.includes('/login')) {
      router.push('/admin/login')
    }
  }, [user, loading, router])

  // Permitir que login se muestre sin autenticación
  if (typeof window !== 'undefined' && window.location.pathname.includes('/login')) {
    return <>{children}</>
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Cargando...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header responsive */}
      <div className="bg-white shadow-md sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3">
            <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Panel de Administración</h1>
            
            {/* Navigation - responsive */}
            <nav className="flex flex-wrap gap-2 lg:gap-4 text-sm lg:text-base">
              <a href="/admin/dashboard" className="text-blue-600 hover:underline whitespace-nowrap">
                📊 Dashboard
              </a>
              <a href="/admin/eventos" className="text-blue-600 hover:underline whitespace-nowrap">
                📅 Eventos
              </a>
              <a href="/admin/usuarios" className="text-blue-600 hover:underline whitespace-nowrap">
                👥 Usuarios
              </a>
              <a href="/admin/scanner" className="text-blue-600 hover:underline whitespace-nowrap">
                📱 Escáner
              </a>
              <LogoutButton />
            </nav>
          </div>
        </div>
      </div>
      <div className="pb-4">
      {children}
      </div>
    </div>
  )
}


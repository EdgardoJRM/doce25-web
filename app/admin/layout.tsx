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
    if (!loading && !user) {
      router.push('/admin/login')
    }
  }, [user, loading, router])

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
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Panel de Administración</h1>
            <nav className="space-x-4">
              <a href="/admin/dashboard" className="text-blue-600 hover:underline">
                Dashboard
              </a>
              <a href="/admin/eventos" className="text-blue-600 hover:underline">
                Eventos
              </a>
              <a href="/admin/scanner" className="text-blue-600 hover:underline">
                📱 Escáner QR
              </a>
              <LogoutButton />
            </nav>
          </div>
        </div>
      </div>
      {children}
    </div>
  )
}


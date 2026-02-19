'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/contexts/AuthContext'

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const { user, logout } = useAuth()
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleMouseEnter = (dropdown: string) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }
    setActiveDropdown(dropdown)
  }

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null)
    }, 150) // 150ms delay antes de cerrar
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 bg-white transition-all duration-300 ${
      isScrolled ? 'shadow-lg' : 'shadow-md'
    }`}>
      <div className="container mx-auto px-4">
        {/* Main Navigation */}
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <Image 
              src="/doce25-logo.png" 
              alt="Doce25" 
              width={150}
              height={48}
              priority
              className={`transition-all duration-300 ${
                isScrolled ? 'h-10' : 'h-12'
              } w-auto group-hover:scale-105`}
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-1">
            {/* Nuestra Historia */}
            <div 
              className="relative group"
              onMouseEnter={() => handleMouseEnter('historia')}
              onMouseLeave={handleMouseLeave}
            >
              <button className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-cyan-600 transition-colors flex items-center gap-1">
                Nuestra Historia
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {activeDropdown === 'historia' && (
                <div 
                  className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-xl py-2 border border-gray-100"
                  onMouseEnter={() => handleMouseEnter('historia')}
                  onMouseLeave={handleMouseLeave}
                >
                  <Link href="/nosotros" className="block px-4 py-2 text-sm text-gray-700 hover:bg-cyan-50 hover:text-cyan-600 transition-colors">
                    Sobre Nosotros
                  </Link>
                  <Link href="/impacto" className="block px-4 py-2 text-sm text-gray-700 hover:bg-cyan-50 hover:text-cyan-600 transition-colors">
                    Nuestro Impacto
                  </Link>
                  <Link href="/galeria" className="block px-4 py-2 text-sm text-gray-700 hover:bg-cyan-50 hover:text-cyan-600 transition-colors">
                    Galería
                  </Link>
                </div>
              )}
            </div>

            {/* Nuestro Trabajo */}
            <div 
              className="relative group"
              onMouseEnter={() => handleMouseEnter('trabajo')}
              onMouseLeave={handleMouseLeave}
            >
              <button className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-cyan-600 transition-colors flex items-center gap-1">
                Nuestro Trabajo
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {activeDropdown === 'trabajo' && (
                <div 
                  className="absolute top-full left-0 mt-1 w-52 bg-white rounded-lg shadow-xl py-2 border border-gray-100"
                  onMouseEnter={() => handleMouseEnter('trabajo')}
                  onMouseLeave={handleMouseLeave}
                >
                  <Link href="/proyectos/playas-urbanas" className="block px-4 py-2 text-sm text-gray-700 hover:bg-cyan-50 hover:text-cyan-600 transition-colors">
                    Playas Urbanas
                  </Link>
                  <Link href="/proyectos/playas-remotas" className="block px-4 py-2 text-sm text-gray-700 hover:bg-cyan-50 hover:text-cyan-600 transition-colors">
                    Playas Remotas
                  </Link>
                  <Link href="/impacto" className="block px-4 py-2 text-sm text-gray-700 hover:bg-cyan-50 hover:text-cyan-600 transition-colors">
                    Educación Ambiental
                  </Link>
                  <div className="border-t border-gray-100 my-2"></div>
                  <Link href="/auspiciadores" className="block px-4 py-2 text-sm text-gray-700 hover:bg-cyan-50 hover:text-cyan-600 transition-colors">
                    🏢 Auspiciadores
                  </Link>
                  <Link href="/voluntarios-staff" className="block px-4 py-2 text-sm text-gray-700 hover:bg-cyan-50 hover:text-cyan-600 transition-colors">
                    👥 Voluntario Staff
                  </Link>
                </div>
              )}
            </div>

            {/* Enlaces directos */}
            <Link href="/eventos" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-cyan-600 transition-colors">
              Eventos
            </Link>

            <Link href="/contacto" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-cyan-600 transition-colors">
              Contacto
            </Link>
          </div>

          {/* Right Side Actions */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Donar Button */}
            <a
              href="https://www.paypal.com/donate/?hosted_button_id=A8X4ZTZDF8F5N"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-5 py-2 rounded-full text-sm font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              Donar
            </a>

            {/* Tomar Acción Button */}
            <Link
              href="/eventos"
              className="bg-gradient-to-r from-cyan-600 to-teal-600 text-white px-5 py-2 rounded-full text-sm font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              Tomar Acción
            </Link>

            {/* User Menu or Login */}
            {user ? (
              <div 
                className="relative"
                onMouseEnter={() => handleMouseEnter('user')}
                onMouseLeave={handleMouseLeave}
              >
                <button className="flex items-center gap-2">
                  <div className="w-9 h-9 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-full flex items-center justify-center text-white text-sm font-bold hover:scale-110 transition-transform shadow-md">
                    {user.fullName ? user.fullName.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                  </div>
                </button>
                {activeDropdown === 'user' && (
                  <div 
                    className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 border border-gray-100"
                    onMouseEnter={() => handleMouseEnter('user')}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900 truncate">{user.fullName || 'Usuario'}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    <Link href="/perfil" className="block px-4 py-2 text-sm text-gray-700 hover:bg-cyan-50 hover:text-cyan-600 transition-colors">
                      Mi Perfil
                    </Link>
                    <Link href="/perfil/editar" className="block px-4 py-2 text-sm text-gray-700 hover:bg-cyan-50 hover:text-cyan-600 transition-colors">
                      Editar Perfil
                    </Link>
                    <div className="border-t border-gray-100 mt-2 pt-2">
                      <button 
                        onClick={logout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Cerrar Sesión
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="border-2 border-gray-300 text-gray-700 px-5 py-2 rounded-full text-sm font-semibold hover:border-cyan-500 hover:text-cyan-600 transition-all"
              >
                Iniciar Sesión
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200">
            <div className="space-y-1">
              <Link href="/nosotros" className="block px-4 py-2 text-sm text-gray-700 hover:bg-cyan-50 hover:text-cyan-600 rounded-lg transition-colors">
                Sobre Nosotros
              </Link>
              <Link href="/impacto" className="block px-4 py-2 text-sm text-gray-700 hover:bg-cyan-50 hover:text-cyan-600 rounded-lg transition-colors">
                Nuestro Impacto
              </Link>
              <Link href="/proyectos/playas-urbanas" className="block px-4 py-2 text-sm text-gray-700 hover:bg-cyan-50 hover:text-cyan-600 rounded-lg transition-colors">
                Playas Urbanas
              </Link>
              <Link href="/proyectos/playas-remotas" className="block px-4 py-2 text-sm text-gray-700 hover:bg-cyan-50 hover:text-cyan-600 rounded-lg transition-colors">
                Playas Remotas
              </Link>
              <Link href="/auspiciadores" className="block px-4 py-2 text-sm text-gray-700 hover:bg-cyan-50 hover:text-cyan-600 rounded-lg transition-colors">
                Auspiciadores
              </Link>
              <Link href="/voluntarios-staff" className="block px-4 py-2 text-sm text-gray-700 hover:bg-cyan-50 hover:text-cyan-600 rounded-lg transition-colors">
                Voluntario Staff
              </Link>
              <Link href="/eventos" className="block px-4 py-2 text-sm text-gray-700 hover:bg-cyan-50 hover:text-cyan-600 rounded-lg transition-colors">
                Eventos
              </Link>
              <Link href="/galeria" className="block px-4 py-2 text-sm text-gray-700 hover:bg-cyan-50 hover:text-cyan-600 rounded-lg transition-colors">
                Galería
              </Link>
              <Link href="/contacto" className="block px-4 py-2 text-sm text-gray-700 hover:bg-cyan-50 hover:text-cyan-600 rounded-lg transition-colors">
                Contacto
              </Link>
              
              <div className="pt-4 space-y-2">
                <a 
                  href="https://www.paypal.com/donate/?hosted_button_id=A8X4ZTZDF8F5N"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-full font-semibold text-center hover:shadow-lg transition-all text-sm"
                >
                  Donar Ahora
                </a>
                <Link
                  href="/eventos"
                  className="block w-full bg-gradient-to-r from-cyan-600 to-teal-600 text-white px-6 py-3 rounded-full font-semibold text-center hover:shadow-lg transition-all text-sm"
                >
                  Tomar Acción
                </Link>
                
                {user ? (
                  <>
                    <Link href="/perfil" className="block w-full border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-full font-semibold text-center hover:border-cyan-500 transition-all text-sm">
                      Mi Perfil
                    </Link>
                    <button
                      onClick={logout}
                      className="block w-full border-2 border-red-300 text-red-600 px-6 py-3 rounded-full font-semibold text-center hover:bg-red-50 transition-all text-sm"
                    >
                      Cerrar Sesión
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    className="block w-full border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-full font-semibold text-center hover:border-cyan-500 transition-all text-sm"
                  >
                    Iniciar Sesión
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

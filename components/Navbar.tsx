'use client'

import { useState } from 'react'
import Link from 'next/link'

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-2xl font-bold text-white">D25</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">
              Doce25
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-1">
            {/* Nuestra Historia Dropdown */}
            <div 
              className="relative group"
              onMouseEnter={() => setActiveDropdown('historia')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="px-4 py-2 text-gray-700 hover:text-cyan-600 font-medium transition-colors flex items-center gap-1">
                Nuestra Historia
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {activeDropdown === 'historia' && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-xl py-2 animate-slide-in">
                  <Link href="/sobre-nosotros" className="block px-4 py-2 text-gray-700 hover:bg-cyan-50 hover:text-cyan-600 transition-colors">
                    Historia
                  </Link>
                  <Link href="/impacto" className="block px-4 py-2 text-gray-700 hover:bg-cyan-50 hover:text-cyan-600 transition-colors">
                    Nuestro Impacto
                  </Link>
                  <Link href="/sobre-nosotros" className="block px-4 py-2 text-gray-700 hover:bg-cyan-50 hover:text-cyan-600 transition-colors">
                    Finanzas
                  </Link>
                </div>
              )}
            </div>

            {/* Nuestro Equipo Dropdown */}
            <div 
              className="relative group"
              onMouseEnter={() => setActiveDropdown('equipo')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="px-4 py-2 text-gray-700 hover:text-cyan-600 font-medium transition-colors flex items-center gap-1">
                Nuestro Equipo
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {activeDropdown === 'equipo' && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-xl py-2 animate-slide-in">
                  <Link href="/sobre-nosotros" className="block px-4 py-2 text-gray-700 hover:bg-cyan-50 hover:text-cyan-600 transition-colors">
                    Personas & Cultura
                  </Link>
                  <Link href="/carreras" className="block px-4 py-2 text-gray-700 hover:bg-cyan-50 hover:text-cyan-600 transition-colors">
                    Oportunidades de Carrera
                  </Link>
                  <Link href="/sobre-nosotros" className="block px-4 py-2 text-gray-700 hover:bg-cyan-50 hover:text-cyan-600 transition-colors">
                    Liderazgo & Junta
                  </Link>
                </div>
              )}
            </div>

            {/* Nuestro Trabajo Dropdown */}
            <div 
              className="relative group"
              onMouseEnter={() => setActiveDropdown('trabajo')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="px-4 py-2 text-gray-700 hover:text-cyan-600 font-medium transition-colors flex items-center gap-1">
                Nuestro Trabajo
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {activeDropdown === 'trabajo' && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-xl py-2 animate-slide-in">
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Biodiversidad</div>
                  <Link href="/proyectos/playas-urbanas" className="block px-4 py-2 text-gray-700 hover:bg-cyan-50 hover:text-cyan-600 transition-colors">
                    Playas Urbanas
                  </Link>
                  <Link href="/proyectos/playas-remotas" className="block px-4 py-2 text-gray-700 hover:bg-cyan-50 hover:text-cyan-600 transition-colors">
                    Playas Remotas
                  </Link>
                  <div className="border-t border-gray-100 my-2"></div>
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Educación</div>
                  <Link href="/impacto" className="block px-4 py-2 text-gray-700 hover:bg-cyan-50 hover:text-cyan-600 transition-colors">
                    Programas Educativos
                  </Link>
                </div>
              )}
            </div>

            {/* Apoyar Dropdown */}
            <div 
              className="relative group"
              onMouseEnter={() => setActiveDropdown('apoyar')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="px-4 py-2 text-gray-700 hover:text-cyan-600 font-medium transition-colors flex items-center gap-1">
                Apoyar
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {activeDropdown === 'apoyar' && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-xl py-2 animate-slide-in">
                  <Link href="/donar" className="block px-4 py-2 text-gray-700 hover:bg-cyan-50 hover:text-cyan-600 transition-colors font-semibold">
                    Donar Ahora
                  </Link>
                  <Link href="/eventos" className="block px-4 py-2 text-gray-700 hover:bg-cyan-50 hover:text-cyan-600 transition-colors">
                    Tomar Acción
                  </Link>
                  <Link href="/donar" className="block px-4 py-2 text-gray-700 hover:bg-cyan-50 hover:text-cyan-600 transition-colors">
                    Formas de Dar
                  </Link>
                  <Link href="/contacto" className="block px-4 py-2 text-gray-700 hover:bg-cyan-50 hover:text-cyan-600 transition-colors">
                    Apoyo Corporativo
                  </Link>
                </div>
              )}
            </div>

            {/* Sala de Prensa Dropdown */}
            <div 
              className="relative group"
              onMouseEnter={() => setActiveDropdown('prensa')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="px-4 py-2 text-gray-700 hover:text-cyan-600 font-medium transition-colors flex items-center gap-1">
                Sala de Prensa
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {activeDropdown === 'prensa' && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-xl py-2 animate-slide-in">
                  <Link href="/prensa" className="block px-4 py-2 text-gray-700 hover:bg-cyan-50 hover:text-cyan-600 transition-colors">
                    Comunicados de Prensa
                  </Link>
                  <Link href="/galeria" className="block px-4 py-2 text-gray-700 hover:bg-cyan-50 hover:text-cyan-600 transition-colors">
                    Blog
                  </Link>
                  <Link href="/galeria" className="block px-4 py-2 text-gray-700 hover:bg-cyan-50 hover:text-cyan-600 transition-colors">
                    Galería de Fotos
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-3">
            <Link
              href="/donar"
              className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              Donar
            </Link>
            <Link
              href="/eventos"
              className="border-2 border-cyan-600 text-cyan-600 px-6 py-2.5 rounded-lg font-semibold hover:bg-cyan-50 transition-colors"
            >
              Tomar Acción
            </Link>
            <Link
              href="/contacto"
              className="text-gray-700 hover:text-cyan-600 font-medium transition-colors"
            >
              Suscribirse
            </Link>
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
          <div className="lg:hidden py-4 border-t border-gray-200 animate-slide-in">
            <div className="space-y-2">
              <Link href="/sobre-nosotros" className="block px-4 py-2 text-gray-700 hover:bg-cyan-50 hover:text-cyan-600 rounded-lg transition-colors">
                Sobre Nosotros
              </Link>
              <Link href="/eventos" className="block px-4 py-2 text-gray-700 hover:bg-cyan-50 hover:text-cyan-600 rounded-lg transition-colors">
                Eventos
              </Link>
              <Link href="/galeria" className="block px-4 py-2 text-gray-700 hover:bg-cyan-50 hover:text-cyan-600 rounded-lg transition-colors">
                Galería
              </Link>
              <Link href="/contacto" className="block px-4 py-2 text-gray-700 hover:bg-cyan-50 hover:text-cyan-600 rounded-lg transition-colors">
                Contacto
              </Link>
              <div className="pt-4 space-y-2">
                <Link
                  href="/donar"
                  className="block w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-lg font-semibold text-center hover:shadow-lg transition-all"
                >
                  Donar Ahora
                </Link>
                <Link
                  href="/eventos"
                  className="block w-full border-2 border-cyan-600 text-cyan-600 px-6 py-3 rounded-lg font-semibold text-center hover:bg-cyan-50 transition-colors"
                >
                  Tomar Acción
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

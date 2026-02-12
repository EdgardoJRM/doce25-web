'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="glass sticky top-0 z-50 border-b border-white/20 shadow-lg backdrop-blur-xl bg-white/80">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-24">
          <Link href="/" className="group relative flex items-center">
            <Image
              src="/doce25-logo.png"
              alt="Doce25 Logo"
              width={180}
              height={60}
              className="h-12 md:h-16 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              priority
            />
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-1">
            {[
              { href: '/proyectos', label: 'Proyectos' },
              { href: '/eventos', label: 'Eventos' },
              { href: '/impacto', label: 'Impacto' },
              { href: '/sobre-nosotros', label: 'Sobre Nosotros' },
            ].map((item) => (
              <Link 
                key={item.href}
                href={item.href} 
                className="relative px-4 py-2 text-gray-700 hover:text-gray-900 transition-all duration-300 font-medium group"
              >
                <span className="relative z-10">{item.label}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-ocean-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            ))}
            <Link 
              href="/donar" 
              className="relative ml-4 bg-gradient-to-r from-blue-600 to-ocean-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-ocean-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl hover:scale-105 overflow-hidden group"
            >
              <span className="relative z-10">Donar ahora</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-ocean-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden text-gray-700 hover:text-gray-900"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col space-y-4">
              <Link href="/proyectos" className="text-gray-700 hover:text-gray-900 transition font-medium">
                Proyectos
              </Link>
              <Link href="/eventos" className="text-gray-700 hover:text-gray-900 transition font-medium">
                Eventos
              </Link>
              <Link href="/impacto" className="text-gray-700 hover:text-gray-900 transition font-medium">
                Impacto
              </Link>
              <Link href="/sobre-nosotros" className="text-gray-700 hover:text-gray-900 transition font-medium">
                Sobre Nosotros
              </Link>
              <Link 
                href="/donar" 
                className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition font-semibold text-center"
              >
                Donar ahora
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}


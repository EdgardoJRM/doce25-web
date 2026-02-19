'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'

// Imágenes del hero - puedes agregar más fotos del club aquí
// Solo agrega más rutas al array cuando subas más fotos
const heroImages = [
  '/images/doce25-hero-main.jpg', // Imagen principal del club
  '/hero/hero-1.jpg',
  '/hero/hero-2.jpg',
  '/hero/hero-3.jpg',
  '/hero/hero-4.jpg',
  '/hero/hero-5.jpg',
  // Agregar más imágenes según necesites: hero-6.jpg, hero-7.jpg, etc.
]

export function Hero() {
  const [isVisible, setIsVisible] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  // Carrusel automático de imágenes cada 5 segundos
  useEffect(() => {
    if (heroImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % heroImages.length)
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [])

  return (
    <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden">
      {/* Animated Background with carousel */}
      <div className="absolute inset-0 z-0">
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-blue-800/70 to-ocean-900/80 z-10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40 z-10"></div>
        
        {/* Image carousel */}
        {heroImages.map((image, index) => (
          <div
            key={image}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={image}
              alt={`Tortuga Club PR - Limpieza de playa ${index + 1}`}
              fill
              priority={index === 0}
              quality={90}
              className="object-cover scale-105"
              sizes="100vw"
        />
          </div>
        ))}
        
        {/* Animated overlay pattern */}
        <div className="absolute inset-0 opacity-10 z-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
        }}></div>
      </div>
      
      {/* Content */}
      <div className={`relative z-20 container mx-auto px-4 py-24 text-center text-white transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="max-w-5xl mx-auto">
          <div className="mb-6 animate-fade-in">
            <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium border border-white/30">
              🌊 Limpiezas de Playas en Puerto Rico
            </span>
          </div>
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-8 leading-[1.2] tracking-tight animate-fade-in-up">
            Un Océano Saludable Y Un<br />
            <span className="text-gradient bg-gradient-to-r from-blue-300 via-white to-ocean-300 bg-clip-text text-transparent">
              Planeta Próspero
            </span>
          </h1>
          <p className="text-2xl md:text-3xl lg:text-4xl mb-12 text-gray-100 max-w-3xl mx-auto leading-relaxed font-light animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Para Siempre Y Para Todos
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <Link
              href="/eventos"
              className="group relative bg-white text-gray-900 px-10 py-5 rounded-xl font-semibold text-lg hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-blue-500/50 overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Ver Próximos Eventos
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-ocean-50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </Link>
            <Link
              href="https://www.paypal.com/donate/?hosted_button_id=A8X4ZTZDF8F5N"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative bg-transparent border-2 border-white/80 text-white px-10 py-5 rounded-xl font-semibold text-lg hover:bg-white hover:text-gray-900 transition-all duration-300 backdrop-blur-sm hover:scale-105 overflow-hidden"
            >
              <span className="relative z-10">Hacer una Donación</span>
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
        <svg className="w-6 h-6 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  )
}

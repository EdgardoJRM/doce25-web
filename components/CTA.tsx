'use client'

import Link from 'next/link'

export function CTA() {
  return (
    <section className="relative section-padding bg-gradient-to-br from-blue-600 via-blue-700 to-ocean-600 text-white overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 animate-gradient" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px',
        }}></div>
      </div>
      
      {/* Floating orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-ocean-300/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="mb-8 animate-fade-in">
          <span className="inline-block px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold border border-white/30">
            🌊 Únete a la transformación
          </span>
        </div>
        <h2 className="font-display text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-8 leading-tight animate-fade-in-up">
          Únete al<br />
          <span className="text-white">cambio</span>
        </h2>
        <p className="text-xl md:text-2xl lg:text-3xl mb-12 text-blue-50 max-w-4xl mx-auto leading-relaxed font-light animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          Cada donación, cada voluntario, cada acción cuenta. Juntos podemos crear un impacto real y duradero 
          en nuestras comunidades y en nuestro planeta.
        </p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <a
            href="https://www.paypal.com/donate/?hosted_button_id=A8X4ZTZDF8F5N"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative bg-white text-gray-900 px-10 py-5 rounded-xl font-semibold text-lg hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-white/50 overflow-hidden inline-block"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              Hacer una Donación
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-ocean-50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </a>
          <Link
            href="/eventos"
            className="group relative bg-transparent border-2 border-white/80 text-white px-10 py-5 rounded-xl font-semibold text-lg hover:bg-white hover:text-gray-900 transition-all duration-300 backdrop-blur-sm hover:scale-105 overflow-hidden"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              Ver Próximos Eventos
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </Link>
        </div>
      </div>
    </section>
  )
}

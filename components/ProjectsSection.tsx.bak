'use client'

import Link from 'next/link'

export function ProjectsSection() {
  return (
    <section className="section-padding bg-gradient-to-b from-white via-gray-50 to-white relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-ocean-100/30 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 animate-fade-in-up">
            <span className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-6">
              Nuestros Proyectos
            </span>
            <h2 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-gray-900 leading-tight">
              Transformando playas<br />
              <span className="text-gradient">una a la vez</span>
            </h2>
          </div>

          {/* Main Projects */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
            {/* Beach Cleanups Urban */}
            <div className="group relative bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 card-hover border border-gray-100">
              <div className="relative h-72 md:h-96 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10"></div>
                <img
                  src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=2070"
                  alt="Limpieza de playas urbanas"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-6 left-6 z-20">
                  <span className="px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full text-sm font-semibold text-gray-900">
                    🏙️ Urbano
                  </span>
                </div>
              </div>
              <div className="p-8 md:p-10">
                <h3 className="font-display text-3xl md:text-4xl font-bold mb-5 text-gray-900 leading-tight">
                  Limpieza de<br />playas urbanas
                </h3>
                <p className="text-gray-600 mb-8 leading-relaxed text-lg font-light">
                  Coordinamos jornadas de limpieza en playas cercanas a ciudades y áreas pobladas 
                  de Puerto Rico, donde se concentra gran parte de los residuos. Trabajamos con 
                  empresas, escuelas y voluntarios para transformar estos espacios en lugares 
                  seguros y limpios para toda la comunidad.
                </p>
                <Link
                  href="/proyectos/playas-urbanas"
                  className="group/link inline-flex items-center gap-3 text-blue-600 font-semibold hover:text-blue-700 text-lg transition-colors"
                >
                  <span>Saber más</span>
                  <svg className="w-6 h-6 group-hover/link:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-ocean-500/0 group-hover:from-blue-500/5 group-hover:to-ocean-500/5 transition-all duration-500 pointer-events-none rounded-3xl"></div>
            </div>

            {/* Beach Cleanups Remote */}
            <div className="group relative bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 card-hover border border-gray-100">
              <div className="relative h-72 md:h-96 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10"></div>
                <img
                  src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073"
                  alt="Limpieza de playas remotas"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-6 left-6 z-20">
                  <span className="px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full text-sm font-semibold text-gray-900">
                    🌴 Remoto
                  </span>
                </div>
              </div>
              <div className="p-8 md:p-10">
                <h3 className="font-display text-3xl md:text-4xl font-bold mb-5 text-gray-900 leading-tight">
                  Limpieza de<br />playas remotas
                </h3>
                <p className="text-gray-600 mb-8 leading-relaxed text-lg font-light">
                  Llegamos a playas menos accesibles de Puerto Rico, donde la basura se acumula 
                  durante años sin ser removida. Nuestras brigadas retiran residuos, clasifican 
                  materiales reciclables y apoyan a las comunidades locales para mantener las 
                  costas libres de contaminación.
                </p>
                <Link
                  href="/proyectos/playas-remotas"
                  className="group/link inline-flex items-center gap-3 text-blue-600 font-semibold hover:text-blue-700 text-lg transition-colors"
                >
                  <span>Saber más</span>
                  <svg className="w-6 h-6 group-hover/link:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-ocean-500/0 group-hover:from-blue-500/5 group-hover:to-ocean-500/5 transition-all duration-500 pointer-events-none rounded-3xl"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}


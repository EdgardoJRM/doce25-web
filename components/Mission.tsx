'use client'

export function Mission() {
  return (
    <section className="section-padding bg-gradient-to-b from-white via-blue-50/30 to-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/20 rounded-full blur-3xl -z-0"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-ocean-100/20 rounded-full blur-3xl -z-0"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20 animate-fade-in-up">
            <span className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-6">
              Nuestra Historia
            </span>
            <h2 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold mb-8 text-gray-900 leading-tight">
              100% Hecho en Puerto Rico<br />
              <span className="text-gradient">para Puerto Rico</span>
            </h2>
            <div className="max-w-4xl mx-auto space-y-6">
              <p className="text-xl md:text-2xl text-gray-600 leading-relaxed font-light">
                Doce25 es una organización sin fines de lucro <strong className="font-semibold text-gray-900">100% puertorriqueña</strong>, 
                creada por puertorriqueños para proteger nuestras playas. Nuestro nombre viene de las <strong className="font-semibold text-gray-900">1,225 playas</strong> 
                que tiene nuestra isla - una por cada día del año y más.
              </p>
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed font-light">
                Desde 2020, trabajamos exclusivamente en Puerto Rico con voluntarios, organizaciones 
                y comunidades locales para retirar residuos, proteger la vida marina y devolverle vida a nuestras costas. 
                Cada limpieza es un paso más hacia playas más limpias para todos los puertorriqueños.
              </p>
              <div className="flex items-center justify-center gap-2 mt-8">
                <span className="text-2xl">🇵🇷</span>
                <span className="text-lg font-semibold text-gray-700">Hecho en Puerto Rico, para Puerto Rico</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {[
              { number: '20', label: 'Limpiezas públicas realizadas', icon: '🏖️' },
              { number: '69,554', label: 'Libras de basura removida', icon: '♻️' },
              { number: '5', label: 'Años de impacto', icon: '📅' },
            ].map((stat, index) => (
              <div 
                key={index}
                className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 card-hover border border-gray-100"
              >
                <div className="absolute top-4 right-4 text-4xl opacity-20 group-hover:opacity-40 transition-opacity">
                  {stat.icon}
                </div>
                <div className="text-6xl md:text-7xl font-display font-bold text-gradient mb-4">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium text-lg">{stat.label}</div>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-ocean-50/0 group-hover:from-blue-50/50 group-hover:to-ocean-50/50 rounded-2xl transition-all duration-500 -z-10"></div>
              </div>
            ))}
          </div>

          {/* Mission Statement */}
          <div className="relative bg-gradient-to-br from-gray-50 via-white to-blue-50/30 rounded-3xl p-10 md:p-16 shadow-2xl border border-gray-100 overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-200/20 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-ocean-200/20 rounded-full blur-2xl"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-1 bg-gradient-to-r from-blue-600 to-ocean-600 rounded-full"></div>
                <span className="text-blue-600 font-semibold uppercase text-sm tracking-wider">El Problema</span>
              </div>
              <h3 className="font-display text-4xl md:text-5xl font-bold mb-6 text-gray-900 leading-tight">
                Un problema que afecta<br />nuestras playas
              </h3>
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-8 font-light">
                Cada año, toneladas de plástico y residuos llegan a las playas de Puerto Rico. 
                Esta contaminación no solo afecta la vida marina y los ecosistemas costeros, 
                sino que también daña la salud y la economía de nuestras comunidades. Los residuos 
                pueden persistir durante décadas, degradándose en microplásticos que afectan tanto 
                a la vida silvestre como a las personas.
              </p>
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border-l-4 border-blue-600">
                <p className="text-xl md:text-2xl font-semibold text-gray-900 leading-relaxed">
                  Nuestro compromiso es limpiar playa por playa, creando un impacto medible y duradero en Puerto Rico
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}


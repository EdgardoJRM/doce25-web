import Link from 'next/link'
import { EventList } from '@/components/EventList'

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section with Video Background Effect */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-ocean-800 to-teal-900">
          <div className="absolute inset-0 bg-black/40"></div>
          {/* Animated Wave Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/5 to-transparent animate-pulse"></div>
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight animate-fade-in">
            Un océano saludable y un planeta<br />próspero, para siempre y para todos
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-blue-100 animate-slide-in">
            Limpiamos playas, protegemos nuestro océano y construimos comunidades más fuertes en Puerto Rico.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-in">
            <Link
              href="/donar"
              className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              Donar Ahora
            </Link>
            <Link
              href="/eventos"
              className="bg-white/10 backdrop-blur-md border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white/20 transition-all duration-300"
            >
              Únete a un Evento
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
          </div>
        </div>
      </section>

      {/* Impact Stats Section */}
      <section className="py-20 bg-gradient-to-br from-cyan-50 to-blue-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-gray-900">
            No podríamos hacer nuestro trabajo sin ti
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Stat 1 */}
            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="bg-white rounded-2xl shadow-xl p-8 border-t-4 border-cyan-500">
                <div className="text-6xl font-bold bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent mb-4">
                  5+
                </div>
                <div className="text-xl font-semibold text-gray-800 mb-2">
                  Años de Impacto
                </div>
                <p className="text-gray-600">
                  Transformando playas de Puerto Rico
                </p>
              </div>
            </div>

            {/* Stat 2 */}
            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="bg-white rounded-2xl shadow-xl p-8 border-t-4 border-orange-500">
                <div className="text-6xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-4">
                  50K+
                </div>
                <div className="text-xl font-semibold text-gray-800 mb-2">
                  Libras de Basura
                </div>
                <p className="text-gray-600">
                  Removidas de nuestras costas
                </p>
              </div>
            </div>

            {/* Stat 3 */}
            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="bg-white rounded-2xl shadow-xl p-8 border-t-4 border-teal-500">
                <div className="text-6xl font-bold bg-gradient-to-r from-teal-600 to-green-600 bg-clip-text text-transparent mb-4">
                  1,000+
                </div>
                <div className="text-xl font-semibold text-gray-800 mb-2">
                  Voluntarios
                </div>
                <p className="text-gray-600">
                  Trabajando juntos por PR
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Work Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto mb-16 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Nuestro Trabajo
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Nuestro océano produce la mitad del oxígeno del mundo y soporta millones de especies. 
              En Doce25 trabajamos para proteger nuestras playas y océanos de Puerto Rico a través de 
              limpiezas comunitarias, educación ambiental y conservación marina.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Beach Cleanups */}
            <div className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300">
                <div className="h-64 bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
                  <span className="text-8xl">🏖️</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2 group-hover:translate-y-[-4px] transition-transform">
                    Limpiezas de Playas
                  </h3>
                  <p className="text-blue-100">
                    Eventos comunitarios para mantener nuestras costas limpias y hermosas.
                  </p>
                </div>
              </div>
            </div>

            {/* Marine Conservation */}
            <div className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300">
                <div className="h-64 bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center">
                  <span className="text-8xl">🐢</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2 group-hover:translate-y-[-4px] transition-transform">
                    Conservación Marina
                  </h3>
                  <p className="text-teal-100">
                    Protegemos la vida marina y los ecosistemas costeros de Puerto Rico.
                  </p>
                </div>
              </div>
            </div>

            {/* Education */}
            <div className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300">
                <div className="h-64 bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center">
                  <span className="text-8xl">📚</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2 group-hover:translate-y-[-4px] transition-transform">
                    Educación Ambiental
                  </h3>
                  <p className="text-green-100">
                    Concienciamos sobre la importancia de cuidar nuestro planeta.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Spotlight/Featured Section */}
      <section className="py-20 bg-gradient-to-br from-blue-900 to-ocean-900 text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            En el Foco
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Featured 1 */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 hover:bg-white/15 transition-all duration-300 border border-white/20">
              <div className="text-5xl mb-4">🌊</div>
              <h3 className="text-2xl font-bold mb-4">Protege Nuestras Playas</h3>
              <p className="text-blue-100 mb-6">
                El cambio climático está afectando nuestras costas. Únete a nosotros para proteger 
                las playas de Puerto Rico para las futuras generaciones.
              </p>
              <Link
                href="/eventos"
                className="inline-block bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
              >
                Únete Ahora →
              </Link>
            </div>

            {/* Featured 2 */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 hover:bg-white/15 transition-all duration-300 border border-white/20">
              <div className="text-5xl mb-4">🤝</div>
              <h3 className="text-2xl font-bold mb-4">Conviértete en Donante Mensual</h3>
              <p className="text-blue-100 mb-6">
                Ayuda a mantener nuestro océano limpio y protegido. Tu donación mensual nos permite 
                planificar y responder rápidamente a emergencias ambientales.
              </p>
              <Link
                href="/donar"
                className="inline-block bg-white text-ocean-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Donar Ahora →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Próximos Eventos
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Únete a nuestras limpiezas de playa y eventos comunitarios. Cada acción cuenta.
            </p>
          </div>
          <EventList />
          <div className="text-center mt-12">
            <Link
              href="/eventos"
              className="inline-block bg-gradient-to-r from-cyan-600 to-teal-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              Ver Todos los Eventos
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            ¿Amas el Océano?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Convierte tu pasión en impacto. Explora acciones que puedes tomar ahora mismo 
            para proteger la vida marina y defender el futuro de nuestro océano.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/eventos"
              className="bg-white text-orange-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
            >
              Tomar Acción
            </Link>
            <Link
              href="/contacto"
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white/10 transition-colors"
            >
              Contáctanos
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              Mantente Informado
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Recibe actualizaciones y haz la diferencia por el futuro de nuestro océano
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Tu email"
                className="flex-1 px-6 py-4 rounded-lg border-2 border-gray-300 focus:border-cyan-500 focus:outline-none text-gray-900"
              />
              <button className="bg-gradient-to-r from-cyan-600 to-teal-600 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-lg transition-all">
                Suscribirse
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              Doce25 es una organización 501(c)3 – Las donaciones son 100% deducibles de impuestos.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

import Link from 'next/link'
import Image from 'next/image'
import { EventList } from '@/components/EventList'
import { ImpactCounter } from '@/components/ImpactCounter'
import { InteractivePuertoRicoMap } from '@/components/InteractivePuertoRicoMap'

export default function Home() {
  return (
    <div className="min-h-screen pb-24 md:pb-32">
      {/* Hero Section with Image Background */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden py-16 md:py-24">
        {/* Image Background */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/doce25-hero-main.jpg"
            alt="Doce25 - Limpieza de playas"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          {/* Image Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60"></div>
        </div>

        {/* Hero Content - más espacio, tipografía más equilibrada */}
        <div className="relative z-10 container mx-auto px-4 text-center text-white flex-1 flex flex-col justify-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight animate-fade-in normal-case">
            Un océano saludable
            <br />
            y un planeta próspero
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl mb-10 max-w-2xl mx-auto text-blue-100 font-light animate-slide-in">
            para siempre y para todos
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-in">
            <a
              href="https://www.paypal.com/donate/?hosted_button_id=A8X4ZTZDF8F5N"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-full text-lg font-bold hover:shadow-2xl transition-all duration-300 overflow-hidden inline-block"
            >
              <span className="relative z-10">Donar Ahora</span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </a>
            <Link
              href="/eventos"
              className="bg-white/10 backdrop-blur-md border-2 border-white text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-white hover:text-cyan-900 transition-all duration-300"
            >
              Únete a un Evento
            </Link>
          </div>
        </div>

        {/* Scroll Indicator - debajo de los botones, sin superponer */}
        <div className="relative z-10 pt-8 pb-4 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/80 rounded-full flex justify-center p-1.5">
            <div className="w-1.5 h-2 bg-white/90 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Impact Counter - Interactive */}
      <ImpactCounter />

      {/* Interactive Puerto Rico Map */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Nuestro Impacto en Puerto Rico
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Explora las comunidades y playas donde hemos realizado limpiezas
            </p>
          </div>
          <InteractivePuertoRicoMap />
        </div>
      </section>

      {/* Mission Statement with Video */}
      <section className="py-24 bg-gradient-to-br from-cyan-900 via-blue-900 to-ocean-900 text-white relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute w-full h-full">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute bg-white rounded-full"
                style={{
                  width: Math.random() * 4 + 2 + 'px',
                  height: Math.random() * 4 + 2 + 'px',
                  left: Math.random() * 100 + '%',
                  top: Math.random() * 100 + '%',
                  animation: `float ${Math.random() * 10 + 10}s ease-in-out infinite`,
                  animationDelay: Math.random() * 5 + 's'
                }}
              />
            ))}
          </div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-5xl md:text-6xl font-bold mb-8 leading-tight">
                Nuestro Océano<br />Necesita Tu Ayuda
              </h2>
              <p className="text-xl text-blue-100 mb-6 leading-relaxed">
                Nuestro océano produce la mitad del oxígeno del mundo, absorbe el 90% del exceso de calor del cambio climático y soporta millones de especies.
              </p>
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                En Doce25, trabajamos para proteger nuestras playas y océanos de Puerto Rico a través de limpiezas comunitarias y educación ambiental.
              </p>
              <Link
                href="/nosotros"
                className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md border-2 border-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-cyan-900 transition-all duration-300"
              >
                Conoce Más
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            <div className="relative">
              <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/doce25-featured.jpg"
                  alt="Doce25 - Impacto comunitario"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              {/* Decorative element */}
              <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-3xl -z-10 blur-2xl opacity-30"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Work Grid */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Nuestro Trabajo
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Protegemos nuestras playas y océanos a través de dos pilares fundamentales
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Work Card 1 - Beach Cleanups */}
            <Link href="/proyectos/playas-urbanas" className="group relative overflow-hidden rounded-3xl aspect-[4/5] shadow-xl hover:shadow-2xl transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-teal-500">
                <Image
                  src="/hero/hero-1.jpg"
                  alt="Limpiezas de playas"
                  fill
                  className="object-cover opacity-80 group-hover:scale-110 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white transform group-hover:-translate-y-2 transition-transform duration-300">
                <div className="text-6xl mb-4">🏖️</div>
                <h3 className="text-3xl font-bold mb-3">
                  Limpiezas de Playas
                </h3>
                <p className="text-lg text-blue-100 mb-4">
                  Eventos comunitarios para mantener nuestras costas limpias y hermosas
                </p>
                <div className="flex items-center gap-2 text-cyan-300 font-semibold">
                  <span>Conoce Más</span>
                  <svg className="w-5 h-5 transform group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>

            {/* Work Card 2 - Education */}
            <Link href="/impacto" className="group relative overflow-hidden rounded-3xl aspect-[4/5] shadow-xl hover:shadow-2xl transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500">
                <Image
                  src="/hero/hero-2.jpg"
                  alt="Educación ambiental"
                  fill
                  className="object-cover opacity-80 group-hover:scale-110 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white transform group-hover:-translate-y-2 transition-transform duration-300">
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-3xl font-bold mb-3">
                  Educación Ambiental
                </h3>
                <p className="text-lg text-blue-100 mb-4">
                  Concienciamos sobre la importancia de cuidar nuestro planeta
                </p>
                <div className="flex items-center gap-2 text-cyan-300 font-semibold">
                  <span>Conoce Más</span>
                  <svg className="w-5 h-5 transform group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Spotlight Section */}
      <section className="py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-900 text-white relative overflow-hidden">
        {/* Pattern overlay removed - using gradient instead */}
        
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-5xl md:text-6xl font-bold text-center mb-20">
            En el Foco
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-7xl mx-auto">
            {/* Featured 1 */}
            <div className="group relative bg-white/5 backdrop-blur-xl rounded-3xl p-10 border border-white/10 hover:bg-white/10 transition-all duration-500 overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500 rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <div className="relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-teal-400 rounded-2xl flex items-center justify-center text-4xl mb-6 group-hover:scale-110 transition-transform">
                  🌊
                </div>
                <h3 className="text-3xl font-bold mb-6">Protege el Ártico Central</h3>
                <p className="text-blue-100 text-lg mb-8 leading-relaxed">
                  El cambio climático está derritiendo rápidamente el hielo marino, proporcionando nuevo acceso a industrias. Exige protección internacional de este tesoro global.
                </p>
                <Link
                  href="/eventos"
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-4 rounded-full text-lg font-bold hover:shadow-2xl hover:scale-105 transition-all duration-300"
                >
                  Tomar Acción
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Featured 2 */}
            <div className="group relative bg-white/5 backdrop-blur-xl rounded-3xl p-10 border border-white/10 hover:bg-white/10 transition-all duration-500 overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500 rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <div className="relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-red-400 rounded-2xl flex items-center justify-center text-4xl mb-6 group-hover:scale-110 transition-transform">
                  🤝
                </div>
                <h3 className="text-3xl font-bold mb-6">Donante Mensual</h3>
                <p className="text-blue-100 text-lg mb-8 leading-relaxed">
                  Ayuda a mantener nuestro océano limpio y protegido. Tu donación mensual nos permite planificar y responder rápidamente a emergencias.
                </p>
                <a
                  href="https://www.paypal.com/donate/?hosted_button_id=A8X4ZTZDF8F5N"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-white text-cyan-900 px-8 py-4 rounded-full text-lg font-bold hover:shadow-2xl hover:scale-105 transition-all duration-300"
                >
                  Donar Ahora
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900">
              Próximos Eventos
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Únete a nuestras limpiezas de playa y eventos comunitarios. Cada acción cuenta.
            </p>
          </div>
          <EventList />
          <div className="text-center mt-16">
            <Link
              href="/eventos"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-cyan-600 to-teal-600 text-white px-12 py-5 rounded-full text-xl font-bold hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              Ver Todos los Eventos
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-gradient-to-r from-orange-500 via-orange-600 to-red-500 text-white relative overflow-hidden">
        {/* Wave pattern removed - using gradient instead */}
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-5xl md:text-7xl font-bold mb-8">
            ¿Amas el Océano?
          </h2>
          <p className="text-2xl mb-12 max-w-3xl mx-auto font-light">
            Convierte tu pasión en impacto. Explora acciones que puedes tomar ahora mismo para proteger la vida marina.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center flex-wrap">
            <Link
              href="/eventos"
              className="bg-white text-orange-600 px-12 py-5 rounded-full text-xl font-bold hover:bg-gray-100 hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              Tomar Acción
            </Link>
            <Link
              href="/contacto"
              className="bg-transparent border-2 border-white text-white px-12 py-5 rounded-full text-xl font-bold hover:bg-white/10 transition-all duration-300"
            >
              Contáctanos
            </Link>
          </div>
        </div>
      </section>

      {/* Auspiciadores y Staff */}
      <section className="py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Únete a Doce25
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Empresas, marcas y voluntarios comprometidos hacen posible nuestro trabajo
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Link
              href="/auspiciadores"
              className="group bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-10 hover:bg-white/10 hover:border-white/30 transition-all duration-300"
            >
              <div className="text-5xl mb-6">🏢</div>
              <h3 className="text-2xl font-bold mb-4">Sé Auspiciador</h3>
              <p className="text-blue-100 mb-6">
                ¿Tu empresa o marca quiere apoyar la causa? Únete como auspiciador y amplifica nuestro impacto en las playas de Puerto Rico.
              </p>
              <span className="inline-flex items-center gap-2 text-cyan-300 font-semibold group-hover:gap-3 transition-all">
                Aplicar como auspiciador
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </Link>
            <Link
              href="/voluntarios-staff"
              className="group bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-10 hover:bg-white/10 hover:border-white/30 transition-all duration-300"
            >
              <div className="text-5xl mb-6">👥</div>
              <h3 className="text-2xl font-bold mb-4">Voluntario Staff</h3>
              <p className="text-blue-100 mb-6">
                ¿Quieres liderar las limpiezas? Únete como voluntario staff y coordina actividades, apoya participantes y amplifica el impacto.
              </p>
              <span className="inline-flex items-center gap-2 text-cyan-300 font-semibold group-hover:gap-3 transition-all">
                Aplicar como staff
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-24 bg-gradient-to-br from-cyan-50 via-blue-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl p-12 md:p-16">
              <div className="text-center mb-10">
                <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
                  Mantente Informado
                </h2>
                <p className="text-xl text-gray-600">
                  Recibe actualizaciones y haz la diferencia por el futuro de nuestro océano
                </p>
              </div>
              <form className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  placeholder="tu@email.com"
                  className="flex-1 px-8 py-5 rounded-full border-2 border-gray-300 focus:border-cyan-500 focus:outline-none text-lg text-gray-900"
                />
                <button 
                  type="submit"
                  className="bg-gradient-to-r from-cyan-600 to-teal-600 text-white px-12 py-5 rounded-full font-bold text-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  Suscribirse
                </button>
              </form>
              <p className="text-sm text-gray-500 mt-6 text-center">
                Doce25 es una organización 501(c)3. Las donaciones son 100% deducibles de impuestos.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
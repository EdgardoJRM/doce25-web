import Link from 'next/link'
import Image from 'next/image'

export default function PlayasUrbanasPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-cyan-600 to-teal-600 text-white py-24">
        <div className="absolute inset-0 opacity-20">
          <Image
            src="/hero/hero-1.jpg"
            alt="Limpieza de playa"
            fill
            className="object-cover"
          />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-6xl mb-4">🏖️</div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Limpiezas de Playas Urbanas
            </h1>
            <p className="text-xl opacity-90">
              Eventos comunitarios para mantener nuestras costas limpias y hermosas
            </p>
          </div>
        </div>
      </section>

      {/* Contenido */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Nuestro Trabajo</h2>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Las playas urbanas de Puerto Rico son espacios de encuentro para nuestras comunidades.
              Organizamos limpiezas masivas donde voluntarios retiran residuos, plásticos y desechos
              que contaminan nuestras costas y afectan la vida marina.
            </p>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              Cada evento reúne a cientos de personas comprometidas con el medio ambiente.
              Juntos transformamos playas contaminadas en espacios limpios y seguros para
              disfrutar en familia.
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-cyan-50 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-gray-900 mb-3">¿Qué hacemos?</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Limpiezas de playas accesibles</li>
                  <li>• Recogida de plásticos y microplásticos</li>
                  <li>• Clasificación y reciclaje de residuos</li>
                  <li>• Educación ambiental en el lugar</li>
                </ul>
              </div>
              <div className="bg-teal-50 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-gray-900 mb-3">¿Cómo participar?</h3>
                <p className="text-gray-700 mb-4">
                  Regístrate en cualquiera de nuestros próximos eventos. Solo necesitas
                  ganas de ayudar y ropa cómoda.
                </p>
                <Link
                  href="/eventos"
                  className="inline-block bg-gradient-to-r from-cyan-600 to-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition"
                >
                  Ver Próximos Eventos
                </Link>
              </div>
            </div>

            <div className="text-center">
              <Link
                href="/"
                className="text-cyan-600 hover:text-cyan-700 font-semibold"
              >
                ← Volver al inicio
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}


import Image from 'next/image'

export default function PlayasUrbanasPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-cyan-600 to-teal-600 text-white py-24">
        <div className="absolute inset-0 opacity-20">
          <Image
            src="/hero/hero-1.jpg"
            alt="Limpieza de playa"
            fill
            className="object-cover"
          />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-6xl mb-4">🏖️</div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Limpiezas de Playas Urbanas
            </h1>
            <p className="text-xl opacity-90">
              Eventos comunitarios para mantener nuestras costas limpias y hermosas
            </p>
          </div>
        </div>
      </section>

      {/* Contenido */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Nuestro Trabajo</h2>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Las playas urbanas de Puerto Rico son espacios de encuentro para nuestras comunidades.
              Organizamos limpiezas masivas donde voluntarios retiran residuos, plásticos y desechos
              que contaminan nuestras costas y afectan la vida marina.
            </p>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              Cada evento reúne a cientos de personas comprometidas con el medio ambiente.
              Juntos transformamos playas contaminadas en espacios limpios y seguros para
              disfrutar en familia.
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-cyan-50 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-gray-900 mb-3">¿Qué hacemos?</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Limpiezas de playas accesibles</li>
                  <li>• Recogida de plásticos y microplásticos</li>
                  <li>• Clasificación y reciclaje de residuos</li>
                  <li>• Educación ambiental en el lugar</li>
                </ul>
              </div>
              <div className="bg-teal-50 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-gray-900 mb-3">¿Cómo participar?</h3>
                <p className="text-gray-700 mb-4">
                  Regístrate en cualquiera de nuestros próximos eventos. Solo necesitas
                  ganas de ayudar y ropa cómoda.
                </p>
                <Link
                  href="/eventos"
                  className="inline-block bg-gradient-to-r from-cyan-600 to-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition"
                >
                  Ver Próximos Eventos
                </Link>
              </div>
            </div>

            <div className="text-center">
              <Link
                href="/"
                className="text-cyan-600 hover:text-cyan-700 font-semibold"
              >
                ← Volver al inicio
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}


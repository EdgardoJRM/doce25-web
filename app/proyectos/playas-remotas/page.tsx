import Link from 'next/link'
import Image from 'next/image'

export default function PlayasRemotasPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-teal-600 to-green-600 text-white py-24">
        <div className="absolute inset-0 opacity-20">
          <Image
            src="/hero/hero-2.jpg"
            alt="Conservación marina"
            fill
            className="object-cover"
          />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-6xl mb-4">🐢</div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Conservación Marina y Playas Remotas
            </h1>
            <p className="text-xl opacity-90">
              Protegemos la vida marina y los ecosistemas costeros de Puerto Rico
            </p>
          </div>
        </div>
      </section>

      {/* Contenido */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Nuestra Misión</h2>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Las playas remotas y los ecosistemas marinos de Puerto Rico albergan especies
              en peligro como tortugas marinas, corales y aves costeras. Llegamos a lugares
              de difícil acceso donde la basura se acumula sin control.
            </p>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              Nuestras expediciones combinan limpieza con monitoreo científico y
              protección de nidos de tortugas. Cada acción contribuye a conservar
              la biodiversidad de nuestra isla.
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-teal-50 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Protección Marina</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Expediciones a playas remotas</li>
                  <li>• Monitoreo de tortugas marinas</li>
                  <li>• Limpieza de ecosistemas sensibles</li>
                  <li>• Colaboración con científicos</li>
                </ul>
              </div>
              <div className="bg-green-50 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Únete</h3>
                <p className="text-gray-700 mb-4">
                  Las expediciones requieren preparación. Contáctanos para conocer
                  los requisitos y fechas disponibles.
                </p>
                <Link
                  href="/contacto"
                  className="inline-block bg-gradient-to-r from-teal-600 to-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition"
                >
                  Contáctanos
                </Link>
              </div>
            </div>

            <div className="text-center">
              <Link
                href="/"
                className="text-teal-600 hover:text-teal-700 font-semibold"
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


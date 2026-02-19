import Link from 'next/link'
import Image from 'next/image'

export default function ImpactoPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-blue-600 to-cyan-600 text-white py-24">
        <div className="absolute inset-0 opacity-20">
          <Image
            src="/hero/hero-3.jpg"
            alt="Educación ambiental"
            fill
            className="object-cover"
          />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-6xl mb-4">📚</div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Educación Ambiental
            </h1>
            <p className="text-xl opacity-90">
              Concienciamos sobre la importancia de cuidar nuestro planeta
            </p>
          </div>
        </div>
      </section>

      {/* Contenido */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Nuestro Impacto</h2>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              La educación es la base del cambio. En Doce25 creemos que cada persona
              puede ser un agente de transformación. Por eso llevamos talleres,
              charlas y actividades a escuelas, comunidades y empresas.
            </p>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              Enseñamos sobre la contaminación por plásticos, la importancia de los
              océanos, el reciclaje y las acciones que cada uno puede tomar para
              proteger nuestro planeta.
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-blue-50 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Programas</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Talleres en escuelas</li>
                  <li>• Charlas comunitarias</li>
                  <li>• Capacitaciones empresariales</li>
                  <li>• Material educativo gratuito</li>
                </ul>
              </div>
              <div className="bg-cyan-50 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Participa</h3>
                <p className="text-gray-700 mb-4">
                  ¿Quieres llevar educación ambiental a tu comunidad o empresa?
                  Contáctanos para coordinar.
                </p>
                <Link
                  href="/contacto"
                  className="inline-block bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition"
                >
                  Contáctanos
                </Link>
              </div>
            </div>

            <div className="text-center">
              <Link
                href="/"
                className="text-blue-600 hover:text-blue-700 font-semibold"
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


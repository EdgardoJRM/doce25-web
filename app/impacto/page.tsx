import Link from 'next/link'
import Image from 'next/image'
import InteractivePuertoRicoMap from '@/components/InteractivePuertoRicoMap'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Nuestro Impacto en Puerto Rico | Mapa Interactivo de Limpiezas',
  description: 'Descubre el impacto real de Doce25 en Puerto Rico: 53,130 libras de basura removidas, 16 limpiezas en 10 municipios. Mapa interactivo con datos verificados de nuestras limpiezas de playas en las regiones Norte, Este y Sur de la isla.',
  keywords: [
    'impacto ambiental puerto rico',
    'limpiezas playas puerto rico',
    'mapa limpiezas doce25',
    'conservación costera',
    'municipios impactados',
    'basura removida puerto rico',
    'voluntariado ambiental',
    'playas limpias puerto rico',
    'manatí limpieza',
    'loíza playas',
    'luquillo conservación',
  ],
  openGraph: {
    title: 'Impacto de Doce25 en Puerto Rico - 53,130 libras removidas',
    description: '10 municipios, 16 limpiezas, 53,130 libras de basura removidas. Mapa interactivo con datos reales de nuestro impacto en las costas de Puerto Rico.',
    type: 'website',
    url: 'https://doce25.precotracks.org/impacto',
    images: [
      {
        url: '/doce25-logo.png',
        width: 1200,
        height: 630,
        alt: 'Mapa de impacto Doce25 en Puerto Rico',
      },
    ],
  },
  alternates: {
    canonical: 'https://doce25.precotracks.org/impacto',
  },
}

export default function ImpactoPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-cyan-600 via-teal-600 to-blue-600 text-white py-24">
        <div className="absolute inset-0 opacity-20">
          <Image
            src="/hero/hero-3.jpg"
            alt="Nuestro impacto en Puerto Rico"
            fill
            className="object-cover"
          />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-6xl mb-4">🌊</div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Nuestro Impacto en Puerto Rico
            </h1>
            <p className="text-xl opacity-90">
              Transformando playas y comunidades, un pueblo a la vez
            </p>
          </div>
        </div>
      </section>

      {/* Mapa Interactivo */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <InteractivePuertoRicoMap />
        </div>
      </section>

      {/* Contenido Educativo */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              🌱 Educación Ambiental
            </h2>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              La educación es la base del cambio. En Doce25 creemos que cada persona
              puede ser un agente de transformación. Por eso llevamos talleres,
              charlas y actividades a escuelas, comunidades y empresas en toda la isla.
            </p>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              Enseñamos sobre la contaminación por plásticos, la importancia de los
              océanos, el reciclaje y las acciones que cada uno puede tomar para
              proteger nuestro planeta y mantener nuestras playas limpias.
            </p>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 p-6 rounded-xl border-2 border-cyan-200">
                <div className="text-4xl mb-4">🏫</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Programas Educativos</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>✓ Talleres en escuelas</li>
                  <li>✓ Charlas comunitarias</li>
                  <li>✓ Capacitaciones empresariales</li>
                  <li>✓ Material educativo gratuito</li>
                </ul>
              </div>
              
              <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-6 rounded-xl border-2 border-teal-200">
                <div className="text-4xl mb-4">🌊</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Limpiezas Costeras</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>✓ Eventos mensuales</li>
                  <li>✓ Playas urbanas y remotas</li>
                  <li>✓ Recolección de datos</li>
                  <li>✓ Clasificación de residuos</li>
                </ul>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border-2 border-blue-200">
                <div className="text-4xl mb-4">🤝</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Colaboraciones</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>✓ Gobiernos municipales</li>
                  <li>✓ Empresas privadas</li>
                  <li>✓ ONGs ambientales</li>
                  <li>✓ Grupos comunitarios</li>
                </ul>
              </div>
            </div>

            {/* CTA Final */}
            <div className="bg-gradient-to-r from-cyan-500 to-teal-600 p-8 rounded-2xl text-white text-center">
              <h3 className="text-2xl font-bold mb-4">¿Quieres ser parte del cambio?</h3>
              <p className="text-cyan-50 mb-6 text-lg">
                Únete a nosotros en nuestra próxima limpieza o trae educación 
                ambiental a tu comunidad o empresa
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/eventos"
                  className="inline-block bg-white text-cyan-600 px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition"
                >
                  Ver Próximos Eventos
                </Link>
                <Link
                  href="/contacto"
                  className="inline-block bg-cyan-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-cyan-800 transition"
                >
                  Contáctanos
                </Link>
              </div>
            </div>

            <div className="text-center mt-12">
              <Link
                href="/"
                className="text-cyan-600 hover:text-cyan-700 font-semibold inline-flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Volver al inicio
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}


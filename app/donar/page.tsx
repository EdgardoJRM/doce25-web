import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'

export default function DonarPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {/* Hero */}
        <section className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold mb-6">
              Tu Donación Transforma Vidas
            </h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Cada aporte, sin importar su tamaño, nos ayuda a llevar esperanza,
              educación y oportunidades a quienes más lo necesitan.
            </p>
          </div>
        </section>

        {/* Impacto de las Donaciones */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
              ¿Cómo Usamos tus Donaciones?
            </h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="bg-gradient-to-br from-cyan-50 to-teal-50 p-8 rounded-lg shadow-lg text-center">
                <div className="text-5xl mb-4">📚</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Educación</h3>
                <p className="text-gray-700 mb-4">
                  Programas educativos, útiles escolares y becas para niños y jóvenes
                </p>
                <div className="text-3xl font-bold text-cyan-600">40%</div>
              </div>

              <div className="bg-gradient-to-br from-cyan-50 to-teal-50 p-8 rounded-lg shadow-lg text-center">
                <div className="text-5xl mb-4">🍽️</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Alimentación</h3>
                <p className="text-gray-700 mb-4">
                  Despensas, comidas comunitarias y apoyo nutricional
                </p>
                <div className="text-3xl font-bold text-cyan-600">35%</div>
              </div>

              <div className="bg-gradient-to-br from-cyan-50 to-teal-50 p-8 rounded-lg shadow-lg text-center">
                <div className="text-5xl mb-4">🏥</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Desarrollo Social</h3>
                <p className="text-gray-700 mb-4">
                  Talleres, eventos y programas de desarrollo comunitario
                </p>
                <div className="text-3xl font-bold text-cyan-600">25%</div>
              </div>
            </div>
          </div>
        </section>

        {/* Formas de Donar */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
                Formas de Donar
              </h2>

              {/* Donación Monetaria */}
              <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  💰 Donación Monetaria
                </h3>
                
                <div className="space-y-4">
                  <div className="border-l-4 border-cyan-500 pl-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Transferencia Bancaria</h4>
                    <div className="text-gray-700 space-y-1">
                      <p><strong>Banco:</strong> BBVA</p>
                      <p><strong>Cuenta:</strong> 0123456789</p>
                      <p><strong>CLABE:</strong> 012180001234567890</p>
                      <p><strong>A nombre de:</strong> Fundación Dosce25 A.C.</p>
                    </div>
                  </div>

                  <div className="border-l-4 border-teal-500 pl-4">
                    <h4 className="font-semibold text-gray-900 mb-2">PayPal</h4>
                    <p className="text-gray-700">
                      Email: <a href="mailto:donaciones@dosce25.org" className="text-blue-600 hover:underline">
                        donaciones@dosce25.org
                      </a>
                    </p>
                  </div>

                  <div className="border-l-4 border-cyan-500 pl-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Mercado Pago</h4>
                    <p className="text-gray-700">Alias: dosce25.fundacion</p>
                  </div>
                </div>

                <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-gray-700">
                    <strong>Importante:</strong> Después de realizar tu donación, envíanos el
                    comprobante a <a href="mailto:donaciones@dosce25.org" className="text-blue-600 hover:underline">
                      donaciones@dosce25.org
                    </a> para emitir tu recibo deducible de impuestos.
                  </p>
                </div>
              </div>

              {/* Donación en Especie */}
              <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  📦 Donación en Especie
                </h3>
                <p className="text-gray-700 mb-4">
                  También aceptamos donaciones de:
                </p>
                <ul className="grid md:grid-cols-2 gap-3 text-gray-700">
                  <li className="flex items-center">
                    <span className="text-cyan-500 mr-2">✓</span>
                    Útiles escolares
                  </li>
                  <li className="flex items-center">
                    <span className="text-cyan-500 mr-2">✓</span>
                    Ropa en buen estado
                  </li>
                  <li className="flex items-center">
                    <span className="text-cyan-500 mr-2">✓</span>
                    Alimentos no perecederos
                  </li>
                  <li className="flex items-center">
                    <span className="text-cyan-500 mr-2">✓</span>
                    Juguetes
                  </li>
                  <li className="flex items-center">
                    <span className="text-cyan-500 mr-2">✓</span>
                    Libros
                  </li>
                  <li className="flex items-center">
                    <span className="text-cyan-500 mr-2">✓</span>
                    Material deportivo
                  </li>
                </ul>
                <p className="text-gray-700 mt-4">
                  Para coordinar la entrega, contáctanos a{' '}
                  <a href="mailto:donaciones@dosce25.org" className="text-blue-600 hover:underline">
                    donaciones@dosce25.org
                  </a>
                </p>
              </div>

              {/* Donación de Tiempo */}
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  ⏰ Donación de Tiempo (Voluntariado)
                </h3>
                <p className="text-gray-700 mb-4">
                  Tu tiempo y talento también son valiosos. Únete como voluntario y ayúdanos
                  en nuestros eventos y programas.
                </p>
                <a
                  href="/contacto"
                  className="inline-block bg-gradient-to-r from-cyan-500 to-teal-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition"
                >
                  Quiero ser Voluntario
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Transparencia */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Compromiso de Transparencia
              </h2>
              <p className="text-lg text-gray-700 mb-8">
                Nos comprometemos a utilizar cada donación de manera responsable y transparente.
                Publicamos reportes anuales de nuestras actividades y finanzas.
              </p>
              <div className="bg-cyan-50 border-l-4 border-cyan-500 p-6 text-left">
                <p className="text-gray-700">
                  <strong>Dosce25 es una organización sin fines de lucro registrada.</strong> Todas
                  las donaciones son deducibles de impuestos según la legislación aplicable.
                  Emitimos recibos oficiales para todas las contribuciones.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-gradient-to-r from-cyan-500 to-teal-500 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">
              ¿Preguntas sobre Donaciones?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Estamos aquí para ayudarte. Contáctanos para cualquier consulta.
            </p>
            <a
              href="/contacto"
              className="inline-block bg-white text-cyan-600 px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition"
            >
              Contáctanos
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}


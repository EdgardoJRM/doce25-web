import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sobre Nosotros | Nuestra Misión y Visión',
  description: 'Conoce a Doce25, Fundación Tortuga Club PR. Organización 501(c)(3) sin fines de lucro dedicada a la limpieza de playas y conservación marina en Puerto Rico desde 2020. Más de 69,000 libras de basura removidas.',
  openGraph: {
    title: 'Sobre Doce25 - Fundación Tortuga Club PR',
    description: 'Transformando vidas a través del servicio y la solidaridad. Conoce nuestra misión de limpieza y conservación de playas en Puerto Rico.',
    type: 'website',
  },
}

export default function NosotrosPage() {
  return (
    <div className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-5xl font-bold mb-6">
                Sobre Dosce25
              </h1>
              <p className="text-xl opacity-90">
                Transformando vidas a través del servicio y la solidaridad
              </p>
            </div>
          </div>
        </section>

        {/* Nuestra Historia */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Nuestra Historia</h2>
              <div className="prose prose-lg max-w-none text-gray-700">
                <p className="mb-4">
                  La Fundación Dosce25 nació del sueño de un grupo de jóvenes comprometidos con
                  hacer una diferencia en su comunidad. Inspirados por el mensaje de servicio y
                  solidaridad, decidieron unir fuerzas para crear un impacto positivo en la vida
                  de quienes más lo necesitan.
                </p>
                <p className="mb-4">
                  Lo que comenzó como pequeñas acciones de ayuda comunitaria ha crecido hasta
                  convertirse en una organización que toca miles de vidas cada año. Nuestro nombre,
                  &quot;Dosce25&quot;, representa nuestro compromiso de dar el 12.5% (o más) de nuestro
                  tiempo, talento y recursos para servir a los demás.
                </p>
                <p>
                  Hoy, somos más que una fundación; somos una familia unida por el propósito común
                  de construir un mundo más justo, compasivo y lleno de esperanza.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Misión y Visión */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-lg shadow-lg">
                  <div className="text-cyan-500 text-4xl mb-4">🎯</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Nuestra Misión</h3>
                  <p className="text-gray-700">
                    Servir a las comunidades vulnerables a través de programas de educación,
                    alimentación y desarrollo social, promoviendo el bienestar integral y
                    generando oportunidades de crecimiento para niños, jóvenes y familias.
                  </p>
                </div>

                <div className="bg-white p-8 rounded-lg shadow-lg">
                  <div className="text-teal-500 text-4xl mb-4">👁️</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Nuestra Visión</h3>
                  <p className="text-gray-700">
                    Ser una organización referente en transformación social, reconocida por su
                    impacto positivo en las comunidades que servimos, inspirando a otros a unirse
                    en la construcción de un mundo más equitativo y solidario.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Valores */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
                Nuestros Valores
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-5xl mb-4">❤️</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Amor</h3>
                  <p className="text-gray-600">
                    Servimos con amor genuino, poniendo el corazón en cada acción
                  </p>
                </div>

                <div className="text-center">
                  <div className="text-5xl mb-4">🤝</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Solidaridad</h3>
                  <p className="text-gray-600">
                    Caminamos junto a quienes necesitan apoyo, siendo sus aliados
                  </p>
                </div>

                <div className="text-center">
                  <div className="text-5xl mb-4">✨</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Excelencia</h3>
                  <p className="text-gray-600">
                    Buscamos la excelencia en todo lo que hacemos
                  </p>
                </div>

                <div className="text-center">
                  <div className="text-5xl mb-4">🙏</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Humildad</h3>
                  <p className="text-gray-600">
                    Servimos con humildad, reconociendo que todos aprendemos
                  </p>
                </div>

                <div className="text-center">
                  <div className="text-5xl mb-4">🎨</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Creatividad</h3>
                  <p className="text-gray-600">
                    Innovamos constantemente para generar mayor impacto
                  </p>
                </div>

                <div className="text-center">
                  <div className="text-5xl mb-4">🌱</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Integridad</h3>
                  <p className="text-gray-600">
                    Actuamos con honestidad y transparencia en todo momento
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Nuestro Equipo */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
                Nuestro Equipo
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                {/* Puedes agregar fotos y nombres reales del equipo aquí */}
                <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                  <div className="w-32 h-32 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-4xl font-bold">
                    D
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Director/a General</h3>
                  <p className="text-gray-600">Liderazgo y Visión Estratégica</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                  <div className="w-32 h-32 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-4xl font-bold">
                    C
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Coordinador/a de Programas</h3>
                  <p className="text-gray-600">Gestión de Proyectos</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                  <div className="w-32 h-32 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-4xl font-bold">
                    V
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Coordinador/a de Voluntarios</h3>
                  <p className="text-gray-600">Gestión del Talento Humano</p>
                </div>
              </div>

              <div className="mt-12 text-center">
                <p className="text-gray-700 text-lg mb-4">
                  Contamos con más de <strong>100 voluntarios</strong> comprometidos que hacen
                  posible nuestro trabajo cada día.
                </p>
                <a
                  href="/contacto"
                  className="inline-block bg-gradient-to-r from-cyan-500 to-teal-500 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition"
                >
                  Únete al Equipo
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-gradient-to-r from-cyan-500 to-teal-500 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">
              ¿Quieres ser parte del cambio?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Hay muchas formas de colaborar con Dosce25. ¡Únete a nosotros!
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href="/eventos"
                className="bg-white text-cyan-600 px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition"
              >
                Ver Eventos
              </a>
              <a
                href="https://www.paypal.com/donate/?hosted_button_id=A8X4ZTZDF8F5N"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-teal-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-teal-700 transition"
              >
                Donar
              </a>
              <a
                href="/contacto"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-cyan-600 transition"
              >
                Contacto
              </a>
            </div>
          </div>
        </section>
    </div>
  )
}

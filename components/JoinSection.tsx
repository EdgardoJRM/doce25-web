import Link from 'next/link'

export function JoinSection() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-bold mb-12 text-center text-gray-900">
            Únete a la transformación
          </h2>
          <p className="text-xl text-gray-600 text-center mb-16 max-w-3xl mx-auto leading-relaxed">
            La contaminación es un desafío que podemos abordar juntos. Ya sea que dones, colabores 
            o simplemente te mantengas informado, serás parte de una comunidad global trabajando 
            para asegurar océanos y comunidades limpias para las generaciones venideras.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Help Remove */}
            <div className="text-center p-8 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">Ayuda a remover</h3>
              <p className="text-gray-600 mb-6">
                Cada donación impulsa misiones de remoción y genera nuevas soluciones para detener 
                la contaminación en su origen.
              </p>
              <div className="space-y-3">
                <a
                  href="https://www.paypal.com/donate/?hosted_button_id=A8X4ZTZDF8F5N"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-blue-600 font-semibold hover:text-blue-700"
                >
                  Hacer una donación
                </a>
                <Link
                  href="/eventos"
                  className="block text-blue-600 font-semibold hover:text-blue-700"
                >
                  Ver eventos
                </Link>
              </div>
            </div>

            {/* Work with Purpose */}
            <div className="text-center p-8 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">Trabaja con propósito</h3>
              <p className="text-gray-600 mb-6">
                Únete a un equipo impulsado por la misión que combina tecnología e impacto para 
                abordar uno de los mayores desafíos ambientales del mundo.
              </p>
              <Link
                href="/carreras"
                className="text-blue-600 font-semibold hover:text-blue-700"
              >
                Ver roles abiertos
              </Link>
            </div>

            {/* Stay Connected */}
            <div className="text-center p-8 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">Mantente conectado</h3>
              <p className="text-gray-600 mb-6">
                Ve el progreso en tiempo real, desde despliegues hasta descubrimientos, y descubre 
                cómo personas como tú están haciendo posible el cambio.
              </p>
              <Link
                href="/newsletter"
                className="text-blue-600 font-semibold hover:text-blue-700"
              >
                Suscribirse
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}




export function JoinSection() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-bold mb-12 text-center text-gray-900">
            Únete a la transformación
          </h2>
          <p className="text-xl text-gray-600 text-center mb-16 max-w-3xl mx-auto leading-relaxed">
            La contaminación es un desafío que podemos abordar juntos. Ya sea que dones, colabores 
            o simplemente te mantengas informado, serás parte de una comunidad global trabajando 
            para asegurar océanos y comunidades limpias para las generaciones venideras.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Help Remove */}
            <div className="text-center p-8 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">Ayuda a remover</h3>
              <p className="text-gray-600 mb-6">
                Cada donación impulsa misiones de remoción y genera nuevas soluciones para detener 
                la contaminación en su origen.
              </p>
              <div className="space-y-3">
                <a
                  href="https://www.paypal.com/donate/?hosted_button_id=A8X4ZTZDF8F5N"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-blue-600 font-semibold hover:text-blue-700"
                >
                  Hacer una donación
                </a>
                <Link
                  href="/eventos"
                  className="block text-blue-600 font-semibold hover:text-blue-700"
                >
                  Ver eventos
                </Link>
              </div>
            </div>

            {/* Work with Purpose */}
            <div className="text-center p-8 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">Trabaja con propósito</h3>
              <p className="text-gray-600 mb-6">
                Únete a un equipo impulsado por la misión que combina tecnología e impacto para 
                abordar uno de los mayores desafíos ambientales del mundo.
              </p>
              <Link
                href="/carreras"
                className="text-blue-600 font-semibold hover:text-blue-700"
              >
                Ver roles abiertos
              </Link>
            </div>

            {/* Stay Connected */}
            <div className="text-center p-8 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">Mantente conectado</h3>
              <p className="text-gray-600 mb-6">
                Ve el progreso en tiempo real, desde despliegues hasta descubrimientos, y descubre 
                cómo personas como tú están haciendo posible el cambio.
              </p>
              <Link
                href="/newsletter"
                className="text-blue-600 font-semibold hover:text-blue-700"
              >
                Suscribirse
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}


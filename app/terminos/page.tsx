export default function TerminosPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8 md:p-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">
              Términos y Condiciones
            </h1>

            <div className="prose prose-lg max-w-none">
              <p className="text-gray-600 mb-6">
                <strong>Última actualización:</strong> 12 de Febrero de 2026
              </p>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  1. Aceptación de los Términos
                </h2>
                <p className="text-gray-700">
                  Al acceder y utilizar el sitio web de la Fundación Doce25 (doce25.org), usted
                  acepta cumplir y estar sujeto a los siguientes términos y condiciones de uso.
                  Si no está de acuerdo con alguno de estos términos, por favor no utilice nuestro sitio.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  2. Uso del Sitio Web
                </h2>
                <p className="text-gray-700 mb-4">
                  El contenido de este sitio es para su información general y uso personal.
                  Está sujeto a cambios sin previo aviso.
                </p>
                <p className="text-gray-700">
                  Usted se compromete a utilizar este sitio únicamente para propósitos legales y de
                  manera que no infrinja los derechos de terceros o restrinja o inhiba el uso y
                  disfrute de este sitio por parte de terceros.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  3. Propiedad Intelectual
                </h2>
                <p className="text-gray-700 mb-4">
                  Todo el contenido incluido en este sitio, como texto, gráficos, logos, imágenes,
                  audio clips, videos y software, es propiedad de la Fundación Doce25 o sus
                  proveedores de contenido y está protegido por las leyes de derechos de autor.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  4. Registro de Eventos
                </h2>
                <p className="text-gray-700 mb-4">
                  Al registrarse a un evento a través de nuestro sitio:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Acepta proporcionar información verdadera y completa</li>
                  <li>Acepta recibir comunicaciones relacionadas con el evento</li>
                  <li>Acepta el <a href="/relevo-responsabilidad" className="text-blue-600 hover:underline">Relevo de Responsabilidad</a></li>
                  <li>Entiende que el cupo puede ser limitado</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  5. Limitación de Responsabilidad
                </h2>
                <p className="text-gray-700">
                  La Fundación Doce25 no será responsable por ningún daño directo, indirecto,
                  incidental, especial o consecuente que resulte del uso o la imposibilidad de
                  usar este sitio o cualquier información contenida en él.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  6. Enlaces a Sitios de Terceros
                </h2>
                <p className="text-gray-700">
                  Nuestro sitio puede contener enlaces a sitios web de terceros. No tenemos control
                  sobre el contenido y las prácticas de estos sitios y no asumimos responsabilidad
                  por ellos.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  7. Modificaciones
                </h2>
                <p className="text-gray-700">
                  Nos reservamos el derecho de modificar estos términos en cualquier momento.
                  Los cambios entrarán en vigor inmediatamente después de su publicación en el sitio.
                  Es su responsabilidad revisar periódicamente estos términos.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  8. Ley Aplicable
                </h2>
                <p className="text-gray-700">
                  Estos términos se regirán e interpretarán de acuerdo con las leyes de México,
                  sin dar efecto a ningún principio de conflictos de ley.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  9. Contacto
                </h2>
                <p className="text-gray-700 mb-4">
                  Si tiene preguntas sobre estos Términos y Condiciones:
                </p>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <p className="text-gray-700 mb-2">
                    <strong>Fundación Doce25</strong>
                  </p>
                  <p className="text-gray-700 mb-2">
                    Email: <a href="mailto:info@doce25.org" className="text-blue-600 hover:underline">
                      info@doce25.org
                    </a>
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>
    </div>
  )
}

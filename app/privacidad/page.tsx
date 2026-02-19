export default function PrivacidadPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8 md:p-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">
              Política de Privacidad
            </h1>

            <div className="prose prose-lg max-w-none">
              <p className="text-gray-600 mb-6">
                <strong>Última actualización:</strong> 12 de Febrero de 2026
              </p>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  1. Información que Recopilamos
                </h2>
                <p className="text-gray-700 mb-4">
                  La Fundación Doce25 recopila la siguiente información personal cuando usted
                  se registra a nuestros eventos:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li><strong>Información de contacto:</strong> Nombre completo, correo electrónico, número de teléfono</li>
                  <li><strong>Información del evento:</strong> Evento al que se registra, fecha de registro</li>
                  <li><strong>Código QR:</strong> Generado automáticamente para su check-in</li>
                  <li><strong>Registro de asistencia:</strong> Fecha y hora de check-in al evento</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  2. Cómo Utilizamos su Información
                </h2>
                <p className="text-gray-700 mb-4">
                  Utilizamos su información personal para:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Gestionar su registro y participación en eventos</li>
                  <li>Enviarle su código QR de acceso por correo electrónico</li>
                  <li>Comunicarnos con usted sobre detalles del evento</li>
                  <li>Llevar control de asistencia a los eventos</li>
                  <li>Generar estadísticas internas (de forma anonimizada)</li>
                  <li>Mejorar nuestros servicios y eventos</li>
                  <li>Cumplir con requisitos legales</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  3. Compartir Información
                </h2>
                <p className="text-gray-700 mb-4">
                  <strong>No vendemos</strong> su información personal a terceros. Solo compartimos
                  su información cuando:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Es necesario para la operación del evento (ej. proveedores de servicios)</li>
                  <li>Es requerido por ley o proceso legal</li>
                  <li>Usted nos da su consentimiento explícito</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  4. Seguridad de la Información
                </h2>
                <p className="text-gray-700">
                  Implementamos medidas de seguridad técnicas y organizacionales apropiadas para
                  proteger su información personal contra acceso no autorizado, alteración,
                  divulgación o destrucción. Sin embargo, ningún método de transmisión por Internet
                  o almacenamiento electrónico es 100% seguro.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  5. Retención de Datos
                </h2>
                <p className="text-gray-700">
                  Conservamos su información personal durante el tiempo necesario para cumplir con
                  los propósitos descritos en esta política, a menos que la ley requiera o permita
                  un período de retención más largo.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  6. Sus Derechos
                </h2>
                <p className="text-gray-700 mb-4">
                  Usted tiene derecho a:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li><strong>Acceder:</strong> Solicitar una copia de su información personal</li>
                  <li><strong>Rectificar:</strong> Corregir información inexacta o incompleta</li>
                  <li><strong>Eliminar:</strong> Solicitar la eliminación de su información (con ciertas excepciones)</li>
                  <li><strong>Oponerse:</strong> Objetar el procesamiento de su información personal</li>
                  <li><strong>Portabilidad:</strong> Recibir su información en un formato estructurado</li>
                </ul>
                <p className="text-gray-700 mt-4">
                  Para ejercer estos derechos, contáctenos a{' '}
                  <a href="mailto:info@doce25.org" className="text-blue-600 hover:underline">
                    info@doce25.org
                  </a>
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  7. Cookies y Tecnologías Similares
                </h2>
                <p className="text-gray-700">
                  Nuestro sitio web utiliza cookies esenciales para su funcionamiento. No utilizamos
                  cookies de seguimiento o publicidad. Puede configurar su navegador para rechazar
                  cookies, aunque esto puede afectar la funcionalidad del sitio.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  8. Privacidad de Menores
                </h2>
                <p className="text-gray-700">
                  Respetamos la privacidad de los menores. Si un menor participa en nuestros eventos,
                  la información debe ser proporcionada por un padre, madre o tutor legal. No
                  recopilamos intencionalmente información personal de menores sin el consentimiento
                  parental.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  9. Cambios a esta Política
                </h2>
                <p className="text-gray-700">
                  Podemos actualizar esta Política de Privacidad ocasionalmente. Le notificaremos
                  sobre cambios significativos publicando la nueva política en esta página y
                  actualizando la fecha de &quot;última actualización&quot;.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  10. Contacto
                </h2>
                <p className="text-gray-700 mb-4">
                  Si tiene preguntas sobre esta Política de Privacidad o sobre cómo manejamos
                  su información personal:
                </p>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <p className="text-gray-700 mb-2">
                    <strong>Fundación Doce25</strong>
                  </p>
                  <p className="text-gray-700 mb-2">
                    <strong>Responsable de Protección de Datos</strong>
                  </p>
                  <p className="text-gray-700">
                    Email: <a href="mailto:info@doce25.org" className="text-blue-600 hover:underline">
                      info@doce25.org
                    </a>
                  </p>
                </div>
              </section>

              <div className="mt-12 pt-8 border-t border-gray-200">
                <p className="text-sm text-gray-500 text-center">
                  Al utilizar nuestro sitio y servicios, usted consiente la recopilación y uso
                  de información de acuerdo con esta política.
                </p>
              </div>
            </div>
          </div>
        </div>
    </div>
  )
}


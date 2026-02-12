import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'

export default function RelevoResponsabilidadPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8 md:p-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">
              Relevo de Responsabilidad
            </h1>

            <div className="prose prose-lg max-w-none">
              <p className="text-gray-600 mb-6">
                <strong>Última actualización:</strong> 12 de Febrero de 2026
              </p>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  1. Aceptación de Riesgos
                </h2>
                <p className="text-gray-700 mb-4">
                  Al registrarse y participar en cualquier evento organizado por la Fundación Dosce25,
                  usted reconoce y acepta que la participación en actividades físicas, recreativas y/o
                  educativas conlleva ciertos riesgos inherentes, incluyendo pero no limitado a:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Lesiones físicas menores o mayores</li>
                  <li>Daños a la propiedad personal</li>
                  <li>Exposición a condiciones climáticas</li>
                  <li>Interacción con otros participantes</li>
                  <li>Uso de instalaciones y equipamiento</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  2. Exoneración de Responsabilidad
                </h2>
                <p className="text-gray-700 mb-4">
                  El participante (o su representante legal en caso de menores de edad) exonera de toda
                  responsabilidad a la Fundación Dosce25, sus directivos, empleados, voluntarios y
                  colaboradores por cualquier:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Lesión personal, enfermedad o muerte que pueda ocurrir durante el evento</li>
                  <li>Pérdida, robo o daño a la propiedad personal</li>
                  <li>Cualquier otro incidente que pueda surgir durante la participación en el evento</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  3. Seguro y Atención Médica
                </h2>
                <p className="text-gray-700 mb-4">
                  El participante declara:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Estar en condiciones físicas y de salud adecuadas para participar en el evento</li>
                  <li>Contar con seguro médico vigente</li>
                  <li>
                    Autorizar a la Fundación Dosce25 a buscar atención médica de emergencia si fuera necesario,
                    asumiendo la responsabilidad por los costos derivados
                  </li>
                  <li>
                    Haber informado sobre cualquier condición médica, alergia o necesidad especial que
                    pueda requerir atención durante el evento
                  </li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  4. Menores de Edad
                </h2>
                <p className="text-gray-700 mb-4">
                  Si el participante es menor de edad, el padre, madre o tutor legal que firma este
                  documento:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Autoriza la participación del menor en el evento</li>
                  <li>Acepta todos los términos de este relevo en nombre del menor</li>
                  <li>Se compromete a supervisar al menor durante el evento cuando sea necesario</li>
                  <li>Acepta la responsabilidad por las acciones del menor durante el evento</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  5. Normas de Conducta
                </h2>
                <p className="text-gray-700 mb-4">
                  El participante se compromete a:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Seguir todas las instrucciones del personal y voluntarios de Dosce25</li>
                  <li>Respetar a otros participantes, personal y las instalaciones</li>
                  <li>No participar bajo la influencia de alcohol o sustancias prohibidas</li>
                  <li>Cumplir con las normas de seguridad establecidas para cada actividad</li>
                </ul>
                <p className="text-gray-700 mt-4">
                  La Fundación Dosce25 se reserva el derecho de negar o revocar la participación de
                  cualquier persona que no cumpla con estas normas.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  6. Uso de Imagen
                </h2>
                <p className="text-gray-700 mb-4">
                  El participante autoriza a la Fundación Dosce25 a tomar fotografías y/o videos
                  durante el evento y a utilizarlos para:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Promoción y difusión de actividades de la fundación</li>
                  <li>Publicación en redes sociales, sitio web y materiales impresos</li>
                  <li>Reportes e informes de actividades</li>
                </ul>
                <p className="text-gray-700 mt-4">
                  Si no desea que se utilicen imágenes suyas o de su representado, debe notificarlo
                  por escrito a <a href="mailto:info@dosce25.org" className="text-blue-600 hover:underline">info@dosce25.org</a>.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  7. Protección de Datos Personales
                </h2>
                <p className="text-gray-700 mb-4">
                  Los datos personales proporcionados serán tratados conforme a nuestra{' '}
                  <a href="/privacidad" className="text-blue-600 hover:underline">
                    Política de Privacidad
                  </a>
                  . La información será utilizada únicamente para:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Gestión del registro al evento</li>
                  <li>Comunicaciones relacionadas con el evento</li>
                  <li>Contacto en caso de emergencia</li>
                  <li>Estadísticas internas (datos anonimizados)</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  8. Modificaciones y Cancelaciones
                </h2>
                <p className="text-gray-700 mb-4">
                  La Fundación Dosce25 se reserva el derecho de:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Modificar la fecha, hora o ubicación del evento por causas de fuerza mayor</li>
                  <li>Cancelar el evento si las condiciones no son adecuadas para su realización</li>
                  <li>Hacer cambios en el programa o actividades del evento</li>
                </ul>
                <p className="text-gray-700 mt-4">
                  En caso de cancelación, se notificará a los participantes registrados a la brevedad posible.
                </p>
              </section>

              <section className="mb-8 bg-yellow-50 border-l-4 border-yellow-400 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  9. Declaración y Aceptación
                </h2>
                <p className="text-gray-700 mb-4">
                  <strong>
                    Al marcar la casilla de aceptación en el formulario de registro, usted declara que:
                  </strong>
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Ha leído y comprendido completamente este Relevo de Responsabilidad</li>
                  <li>Acepta voluntariamente todos los términos y condiciones aquí establecidos</li>
                  <li>Entiende que está renunciando a ciertos derechos legales</li>
                  <li>
                    Si es padre/madre/tutor de un menor, tiene autoridad legal para firmar en su nombre
                  </li>
                  <li>Toda la información proporcionada es verdadera y completa</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  10. Contacto
                </h2>
                <p className="text-gray-700 mb-4">
                  Para cualquier pregunta o aclaración sobre este relevo de responsabilidad:
                </p>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <p className="text-gray-700 mb-2">
                    <strong>Fundación Dosce25</strong>
                  </p>
                  <p className="text-gray-700 mb-2">
                    Email: <a href="mailto:info@dosce25.org" className="text-blue-600 hover:underline">
                      info@dosce25.org
                    </a>
                  </p>
                  <p className="text-gray-700">
                    Sitio web: <a href="https://dosce25.org" className="text-blue-600 hover:underline">
                      www.dosce25.org
                    </a>
                  </p>
                </div>
              </section>

              <div className="mt-12 pt-8 border-t border-gray-200">
                <p className="text-sm text-gray-500 text-center">
                  Este documento constituye un acuerdo legal. Si no está de acuerdo con estos términos,
                  por favor no participe en el evento.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}


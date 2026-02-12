import Link from 'next/link'

export function Projects() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition border border-gray-100">
            <div className="h-48 relative">
              <img
                src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073"
                alt="Limpieza de playas"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Limpiezas Comunitarias</h3>
              <p className="text-gray-600 mb-4">
                Organizamos jornadas abiertas al público donde familias, estudiantes y voluntarios 
                se unen para limpiar nuestras playas.
              </p>
              <Link href="/proyectos/comunitarias" className="text-blue-600 hover:text-blue-700 font-semibold inline-flex items-center group">
                Saber más
                <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
          <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition border border-gray-100">
            <div className="h-48 relative">
              <img
                src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=2032"
                alt="Limpiezas corporativas"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Limpiezas Corporativas</h3>
              <p className="text-gray-600 mb-4">
                Colaboramos con empresas que quieren hacer un impacto positivo organizando 
                limpiezas de playas como parte de su responsabilidad social.
              </p>
              <Link href="/proyectos/corporativas" className="text-blue-600 hover:text-blue-700 font-semibold inline-flex items-center group">
                Saber más
                <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
          <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition border border-gray-100">
            <div className="h-48 relative">
              <img
                src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2022"
                alt="Educación en playas"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Educación en Playas</h3>
              <p className="text-gray-600 mb-4">
                Durante nuestras limpiezas, educamos a los participantes sobre el impacto de los 
                residuos en las playas y cómo prevenir la contaminación.
              </p>
              <Link href="/proyectos/educacion" className="text-blue-600 hover:text-blue-700 font-semibold inline-flex items-center group">
                Saber más
                <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}


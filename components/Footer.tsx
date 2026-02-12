import Link from 'next/link'
import Image from 'next/image'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-20">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          <div className="lg:col-span-2">
            <div className="mb-6">
              <Image
                src="/doce25-logo.png"
                alt="Doce25 Logo"
                width={200}
                height={70}
                className="h-12 md:h-16 w-auto object-contain brightness-0 invert"
              />
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              Organización sin fines de lucro dedicada a limpiezas de playas en Puerto Rico. 
              Desde 2020, trabajamos para proteger nuestras costas y comunidades.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://www.instagram.com/doce25pr" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition" 
                aria-label="Instagram"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-white">Proyectos</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/proyectos/playas-urbanas" className="hover:text-white transition">
                  Playas Urbanas
                </Link>
              </li>
              <li>
                <Link href="/proyectos/playas-remotas" className="hover:text-white transition">
                  Playas Remotas
                </Link>
              </li>
              <li>
                <Link href="/impacto" className="hover:text-white transition">
                  Impacto
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-white">Ayuda</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/donar" className="hover:text-white transition">
                  Donar ahora
                </Link>
              </li>
              <li>
                <Link href="/eventos" className="hover:text-white transition">
                  Eventos
                </Link>
              </li>
              <li>
                <Link href="/carreras" className="hover:text-white transition">
                  Carreras
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-white">Contacto</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="mailto:contacto@dosce25.org" className="hover:text-white transition">
                  contacto@dosce25.org
                </a>
              </li>
              <li>
                <a href="/sobre-nosotros" className="hover:text-white transition">
                  Sobre Nosotros
                </a>
              </li>
              <li>
                <a href="/prensa" className="hover:text-white transition">
                  Prensa
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
            <p>&copy; {new Date().getFullYear()} Doce25. Todos los derechos reservados.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacidad" className="hover:text-white transition">
                Privacidad
              </Link>
              <Link href="/terminos" className="hover:text-white transition">
                Términos
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}


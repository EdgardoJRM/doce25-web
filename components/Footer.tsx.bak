import Link from 'next/link'
import Image from 'next/image'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-20">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          <div className="lg:col-span-2">
            <div className="mb-6">
              <Link href="/" className="block">
                <Image
                  src="/doce25-logo.png"
                  alt="Doce25 Logo"
                  width={200}
                  height={70}
                  className="h-12 md:h-16 w-auto object-contain brightness-0 invert"
                  priority
                />
              </Link>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              Fundación dedicada a transformar vidas a través del servicio y la solidaridad. 
              Trabajamos por comunidades más justas y llenas de esperanza.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://www.instagram.com/doce25pr/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition" 
                aria-label="Instagram"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a 
                href="https://www.facebook.com/doce25" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition" 
                aria-label="Facebook"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-white">Conoce Más</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/nosotros" className="hover:text-white transition">
                  Sobre Nosotros
                </Link>
              </li>
              <li>
                <Link href="/eventos" className="hover:text-white transition">
                  Eventos
                </Link>
              </li>
              <li>
                <Link href="/galeria" className="hover:text-white transition">
                  Galería
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-white">Participa</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="https://www.paypal.com/donate/?hosted_button_id=A8X4ZTZDF8F5N" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
                  Donar
                </a>
              </li>
              <li>
                <Link href="/auspiciadores" className="hover:text-white transition">
                  Auspiciadores
                </Link>
              </li>
              <li>
                <Link href="/voluntarios-staff" className="hover:text-white transition">
                  Voluntario Staff
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="hover:text-white transition">
                  Contáctanos
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-white transition">
                  Admin
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-white">Información</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/terminos" className="hover:text-white transition">
                  Términos
                </Link>
              </li>
              <li>
                <Link href="/privacidad" className="hover:text-white transition">
                  Privacidad
                </Link>
              </li>
              <li>
                <Link href="/relevo-responsabilidad" className="hover:text-white transition">
                  Relevo de Responsabilidad
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
            <p>&copy; {new Date().getFullYear()} Fundación Doce25. Todos los derechos reservados.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="mailto:info@doce25.org" className="hover:text-white transition">
                info@doce25.org
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

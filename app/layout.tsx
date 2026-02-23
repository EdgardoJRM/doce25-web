import type { Metadata } from 'next'
import { Inter, Playfair_Display, Poppins } from 'next/font/google'
import './globals.css'
import 'leaflet/dist/leaflet.css'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { EventBanner } from '@/components/EventBanner'
import { AuthProvider as CognitoAuthProvider } from '@/lib/auth'
import { AuthProvider } from '@/contexts/AuthContext'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://doce25.org'),
  title: {
    default: 'Doce25 | Organización Sin Fines de Lucro - Limpieza de Playas Puerto Rico',
    template: '%s | Doce25'
  },
  description: 'Doce25 (Fundación Tortuga Club PR) es una organización 501(c)(3) sin fines de lucro dedicada a la limpieza y conservación de playas en Puerto Rico. Desde 2020 hemos removido más de 69,000 libras de basura de nuestras costas. Únete a nuestros eventos de voluntariado.',
  keywords: [
    'limpieza de playas puerto rico',
    'beach cleanup puerto rico',
    'voluntariado puerto rico',
    'organizaciones sin fines de lucro puerto rico',
    'conservación ambiental',
    'protección de tortugas marinas',
    'tortuga club pr',
    'doce25',
    'nonprofit puerto rico',
    'ocean conservation',
    'volunteer puerto rico',
    'environmental nonprofit',
    '501c3 puerto rico'
  ],
  authors: [{ name: 'Fundación Tortuga Club PR, Inc.' }],
  creator: 'Doce25',
  publisher: 'Fundación Tortuga Club PR, Inc.',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'es_PR',
    url: 'https://doce25.org',
    title: 'Doce25 | Limpieza de Playas y Conservación Marina en Puerto Rico',
    description: 'Organización 501(c)(3) sin fines de lucro dedicada a la limpieza de playas y conservación de océanos en Puerto Rico. Más de 69,000 libras removidas desde 2020. ¡Únete como voluntario!',
    siteName: 'Doce25',
    images: [
      {
        url: '/doce25-logo.png',
        width: 1200,
        height: 630,
        alt: 'Doce25 - Fundación Tortuga Club PR',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Doce25 | Limpieza de Playas Puerto Rico',
    description: 'Organización sin fines de lucro dedicada a la limpieza y conservación de playas. Más de 69,000 libras removidas. ¡Únete!',
    images: ['/doce25-logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Agregar después: google: 'tu-codigo-de-verificacion',
    // Agregar después: yandex: 'tu-codigo-de-verificacion',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NGO',
    name: 'Doce25',
    alternateName: 'Fundación Tortuga Club PR, Inc.',
    url: 'https://doce25.org',
    logo: 'https://doce25.org/doce25-logo.png',
    description: 'Organización 501(c)(3) sin fines de lucro dedicada a la limpieza de playas y conservación marina en Puerto Rico.',
    email: 'info@doce25.org',
    foundingDate: '2020',
    areaServed: {
      '@type': 'Country',
      name: 'Puerto Rico'
    },
    sameAs: [
      'https://www.facebook.com/doce25',
      'https://www.instagram.com/doce25pr/'
    ],
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'PR'
    },
    nonprofitStatus: '501(c)(3)',
    seeks: {
      '@type': 'Thing',
      name: 'Ocean Conservation and Beach Cleanup'
    }
  }

  return (
    <html lang="es" className={`${inter.variable} ${playfair.variable} ${poppins.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-poppins antialiased">
        <CognitoAuthProvider>
          <AuthProvider>
            <Navbar />
            <main className="min-h-screen pt-16 pb-24">
              {children}
            </main>
            <Footer />
            <EventBanner />
          </AuthProvider>
        </CognitoAuthProvider>
      </body>
    </html>
  )
}


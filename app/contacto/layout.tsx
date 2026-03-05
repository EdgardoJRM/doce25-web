import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contacto | Doce25 - Limpieza de Playas Puerto Rico',
  description: 'Contáctanos para organizar limpiezas de playa, solicitar charlas educativas, colaborar con tu empresa u organización, o hacernos preguntas. Estamos aquí para ayudar a proteger las costas de Puerto Rico.',
  keywords: [
    'contacto doce25',
    'organizar limpieza playa',
    'voluntariado puerto rico contacto',
    'educación ambiental puerto rico',
    'colaboración empresarial ong',
    'charlas ambientales',
    'limpieza playas corporativa',
  ],
  openGraph: {
    title: 'Contacta a Doce25 - Limpieza de Playas Puerto Rico',
    description: 'Organiza una limpieza de playa, solicita una charla educativa o colabora con nosotros. ¡Juntos protegemos las costas de Puerto Rico!',
    url: 'https://doce25.precotracks.org/contacto',
    type: 'website',
  },
  alternates: {
    canonical: 'https://doce25.precotracks.org/contacto',
  },
}

export default function ContactoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}


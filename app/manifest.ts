import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Doce25 - Limpieza de Playas Puerto Rico',
    short_name: 'Doce25',
    description: 'Organización sin fines de lucro dedicada a la limpieza y conservación de playas en Puerto Rico',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0ea5e9',
    icons: [
      {
        src: '/doce25-logo.png',
        sizes: 'any',
        type: 'image/png',
      },
    ],
  }
}



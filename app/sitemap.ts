import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dosce25.org'
  
  // Páginas estáticas principales
  const staticPages = [
    '',
    '/nosotros',
    '/eventos',
    '/proyectos/playas-urbanas',
    '/proyectos/playas-remotas',
    '/impacto',
    '/galeria',
    '/auspiciadores',
    '/voluntarios-staff',
    '/contacto',
    '/donar',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // Páginas legales
  const legalPages = [
    '/terminos',
    '/privacidad',
    '/relevo-responsabilidad',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.3,
  }))

  // TODO: Cuando tengamos la API funcionando, agregar eventos dinámicos
  // const events = await getEvents()
  // const eventPages = events.map((event) => ({
  //   url: `${baseUrl}/eventos/${event.slug}`,
  //   lastModified: new Date(event.updatedAt),
  //   changeFrequency: 'daily' as const,
  //   priority: 0.7,
  // }))

  return [...staticPages, ...legalPages]
}


import { MetadataRoute } from 'next'
import { getEvents } from '@/lib/api'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://doce25.org'
  
  // Páginas estáticas principales con prioridades optimizadas
  const staticPages = [
    { route: '', priority: 1.0, changeFrequency: 'daily' as const },
    { route: '/nosotros', priority: 0.9, changeFrequency: 'weekly' as const },
    { route: '/impacto', priority: 0.9, changeFrequency: 'weekly' as const },
    { route: '/eventos', priority: 0.95, changeFrequency: 'daily' as const },
    { route: '/proyectos/playas-urbanas', priority: 0.7, changeFrequency: 'monthly' as const },
    { route: '/proyectos/playas-remotas', priority: 0.7, changeFrequency: 'monthly' as const },
    { route: '/galeria', priority: 0.6, changeFrequency: 'weekly' as const },
    { route: '/auspiciadores', priority: 0.7, changeFrequency: 'monthly' as const },
    { route: '/voluntarios-staff', priority: 0.8, changeFrequency: 'monthly' as const },
    { route: '/contacto', priority: 0.8, changeFrequency: 'monthly' as const },
    { route: '/donar', priority: 0.9, changeFrequency: 'monthly' as const },
  ].map((page) => ({
    url: `${baseUrl}${page.route}`,
    lastModified: new Date(),
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }))

  // Páginas legales (menor prioridad)
  const legalPages = [
    '/terminos',
    '/privacidad',
    '/relevo-responsabilidad',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'yearly' as const,
    priority: 0.3,
  }))

  // Eventos dinámicos (alta prioridad para indexación)
  let eventPages: MetadataRoute.Sitemap = []
  try {
    const eventsData = await getEvents()
    eventPages = eventsData.events
      .filter((event: any) => event.status === 'published')
      .map((event: any) => ({
        url: `${baseUrl}/eventos/${event.slug}`,
        lastModified: new Date(event.updatedAt || event.createdAt),
        changeFrequency: 'daily' as const,
        priority: 0.85,
      }))
  } catch (error) {
    console.error('Error loading events for sitemap:', error)
  }

  return [...staticPages, ...eventPages, ...legalPages]
}

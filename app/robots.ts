import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://doce25.org'
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/perfil/',
          '/perfil/editar',
          '/login',
          '/registro',
          '/checkin/',
        ],
        crawlDelay: 0,
      },
      // Optimización específica para Google
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/admin/', '/api/', '/perfil/', '/login', '/registro', '/checkin/'],
        crawlDelay: 0,
      },
      // Optimización para Bing
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/admin/', '/api/', '/perfil/', '/login', '/registro', '/checkin/'],
        crawlDelay: 0,
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}

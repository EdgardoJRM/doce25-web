import type { Metadata } from 'next'
import { getEventBySlug } from '@/lib/api'

type Props = {
  children: React.ReactNode
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = params.slug

  try {
    const event = await getEventBySlug(slug)
    const title = `${event.name} | Estadísticas en vivo`
    const description =
      event.description?.slice(0, 155) ||
      `Peso recogido, participación y desglose en ${event.name}.`

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: 'website',
        url: `https://doce25.precotracks.org/eventos/${slug}/estadisticas`,
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
      },
      alternates: {
        canonical: `https://doce25.precotracks.org/eventos/${slug}/estadisticas`,
      },
    }
  } catch {
    return {
      title: 'Estadísticas del evento | Doce25',
      description: 'Estadísticas en vivo de limpieza de playa.',
    }
  }
}

export default function EstadisticasLayout({ children }: Props) {
  return children
}

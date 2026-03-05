import { EventLanding } from '@/components/EventLanding'
import { notFound } from 'next/navigation'
import { getEventBySlug } from '@/lib/api'
import type { Metadata } from 'next'

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  
  try {
    const event = await getEventBySlug(slug)
    
    if (!event) {
      return {
        title: 'Evento no encontrado | Doce25',
        description: 'El evento que buscas no existe o ha sido eliminado.',
      }
    }

    const eventDate = new Date(event.dateTime || event.date)
    const formattedDate = eventDate.toLocaleDateString('es-PR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

    return {
      title: `${event.name} | Doce25 - Limpieza de Playas`,
      description: `${event.description?.slice(0, 150) || `Únete a ${event.name}`}. 📅 ${formattedDate}. 📍 ${event.location}. Evento de limpieza de playa organizado por Doce25 en Puerto Rico.`,
      keywords: [
        event.name.toLowerCase(),
        'limpieza playa puerto rico',
        event.location.toLowerCase(),
        'voluntariado ambiental',
        'evento doce25',
        formattedDate,
      ],
      openGraph: {
        title: event.name,
        description: `${event.description?.slice(0, 100) || 'Limpieza de playa'}. ${formattedDate} en ${event.location}`,
        url: `https://doce25.precotracks.org/eventos/${slug}`,
        type: 'website',
        images: [
          {
            url: event.image || event.imageUrl || '/doce25-logo.png',
            width: 1200,
            height: 630,
            alt: event.name,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: event.name,
        description: `${formattedDate} | ${event.location}`,
        images: [event.image || event.imageUrl || '/doce25-logo.png'],
      },
      alternates: {
        canonical: `https://doce25.precotracks.org/eventos/${slug}`,
      },
    }
  } catch (error) {
    return {
      title: 'Evento | Doce25',
      description: 'Evento de limpieza de playa organizado por Doce25 en Puerto Rico.',
    }
  }
}

// Generate JSON-LD structured data for the event
function generateEventJsonLd(event: any) {
  const eventDate = new Date(event.dateTime || event.date)
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.name,
    description: event.description,
    startDate: eventDate.toISOString(),
    endDate: new Date(eventDate.getTime() + 4 * 60 * 60 * 1000).toISOString(), // +4 hours
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: event.location,
      address: {
        '@type': 'PostalAddress',
        addressLocality: event.location,
        addressCountry: 'PR',
      },
    },
    image: event.image || event.imageUrl || 'https://doce25.precotracks.org/doce25-logo.png',
    organizer: {
      '@type': 'Organization',
      name: 'Doce25',
      url: 'https://doce25.precotracks.org',
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: `https://doce25.precotracks.org/eventos/${event.slug}`,
    },
    performer: {
      '@type': 'Organization',
      name: 'Doce25 - Fundación Tortuga Club PR',
    },
  }
}

export default async function EventPage({ params }: PageProps) {
  const { slug } = await params
  
  // Fetch event for JSON-LD
  let event = null
  try {
    event = await getEventBySlug(slug)
  } catch (error) {
    console.error('Error fetching event for JSON-LD:', error)
  }

  return (
    <>
      {/* JSON-LD Structured Data */}
      {event && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateEventJsonLd(event)),
          }}
        />
      )}
      <EventLanding eventSlug={slug} />
    </>
  )
}

import { EventLanding } from '@/components/EventLanding'
import { notFound } from 'next/navigation'

interface PageProps {
  params: {
    slug: string
  }
}

export default async function EventPage({ params }: PageProps) {
  // TODO: Fetch event from DynamoDB or API
  // Por ahora, retornamos el componente con el slug
  return <EventLanding eventSlug={params.slug} />
}


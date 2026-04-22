import type { Metadata } from 'next'
import { Hero } from '@/app/webinar/components/Hero'
import { ParaQuienEs } from '@/app/webinar/components/ParaQuienEs'
import { QueVasAprender } from '@/app/webinar/components/QueVasAprender'
import { PorQueImporta } from '@/app/webinar/components/PorQueImporta'
import { Problema } from '@/app/webinar/components/Problema'
import { Autoridad } from '@/app/webinar/components/Autoridad'
import { Speaker } from '@/app/webinar/components/Speaker'
import { LogosStrip } from '@/app/webinar/components/LogosStrip'
import { Registro } from '@/app/webinar/components/Registro'
import { CtaFinal } from '@/app/webinar/components/CtaFinal'
import { Faq } from '@/app/webinar/components/Faq'
import { webinarContent } from '@/app/webinar/content'
import { getSiteBaseUrl } from '@/lib/webinar-calendar'

const base = getSiteBaseUrl()
const canonical = `${base}${webinarContent.meta.canonicalPath}`

export const metadata: Metadata = {
  title: webinarContent.meta.title,
  description: webinarContent.meta.description,
  alternates: { canonical },
  openGraph: {
    type: 'website',
    locale: 'es_PR',
    url: canonical,
    title: webinarContent.hero.headline,
    description: webinarContent.meta.description,
    siteName: 'Doce25',
    images: [
      {
        url: webinarContent.meta.ogImage,
        width: 1200,
        height: 630,
        alt: 'Doce25 — Webinar experiencias ambientales corporativas',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: webinarContent.hero.headline,
    description: webinarContent.meta.description,
    images: [webinarContent.meta.ogImage],
  },
  robots: { index: true, follow: true },
}

export default function WebinarLandingPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: webinarContent.hero.headline,
    description: webinarContent.hero.subheadline,
    startDate: webinarContent.event.startIso,
    endDate: webinarContent.event.endIso,
    eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    location: {
      '@type': 'VirtualLocation',
      url: canonical,
    },
    organizer: {
      '@type': 'Organization',
      name: 'Doce25',
      url: base,
    },
    offers: {
      '@type': 'Offer',
      price: 0,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: canonical,
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <ParaQuienEs />
      <QueVasAprender />
      <PorQueImporta />
      <Problema />
      <Autoridad />
      <Speaker />
      <LogosStrip />
      <Registro />
      <CtaFinal />
      <Faq />
    </>
  )
}

import type { Metadata } from 'next'
import { JjLimpiezaClient } from './JjLimpiezaClient'
import { jjLimpiezaContent as c } from './content'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://doce25.precotracks.org'
const canonical = `${baseUrl}${c.meta.canonicalPath}`

export const metadata: Metadata = {
  title: c.meta.title,
  description: c.meta.description,
  alternates: { canonical },
  robots: { index: false, follow: false, nocache: true },
  openGraph: {
    type: 'website',
    locale: 'es_PR',
    url: canonical,
    title: c.hero.headline,
    description: c.meta.description,
    siteName: 'Doce25',
  },
}

export default function JjLimpiezaPage() {
  return <JjLimpiezaClient />
}

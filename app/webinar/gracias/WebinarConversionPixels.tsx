'use client'

import { useEffect } from 'react'

type GtagFn = (...args: unknown[]) => void
type FbqFn = (...args: unknown[]) => void

/** Dispara GA4 + Meta Lead una sola vez al llegar desde registro exitoso. */
export function WebinarConversionPixels({ fire }: { fire: boolean }) {
  useEffect(() => {
    if (!fire || typeof window === 'undefined') return

    const w = window as unknown as { gtag?: GtagFn; fbq?: FbqFn }

    try {
      w.gtag?.('event', 'webinar_register_submit', {
        event_category: 'webinar',
        event_label: 'experiencia_ambiental_corporativa',
      })
    } catch {
      /* ignore */
    }

    try {
      w.fbq?.('track', 'Lead', {
        content_name: 'Webinar Doce25 — experiencia ambiental corporativa',
      })
    } catch {
      /* ignore */
    }
  }, [fire])

  return null
}

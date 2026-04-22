'use client'

import { buildGoogleCalendarUrl } from '@/lib/webinar-calendar'

export function AddToCalendar() {
  const googleUrl = buildGoogleCalendarUrl()
  const icsHref = '/webinar/calendar.ics'

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
      <a
        href={googleUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/[0.06] px-5 py-3 text-sm font-semibold text-white transition hover:border-cyan-500/40 hover:bg-white/[0.09]"
      >
        Añadir a Google Calendar
      </a>
      <a
        href={icsHref}
        download
        className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/[0.06] px-5 py-3 text-sm font-semibold text-white transition hover:border-cyan-500/40 hover:bg-white/[0.09]"
      >
        Descargar .ics (Apple / Outlook)
      </a>
    </div>
  )
}

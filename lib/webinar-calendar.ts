import { webinarContent, WEBINAR_SLUG } from '@/app/webinar/content'

/** Formato Google Calendar: yyyymmddThhmmssZ (UTC) */
function toGoogleUtc(d: Date): string {
  return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
}

export function getWebinarCalendarWindow() {
  const start = new Date(webinarContent.event.startIso)
  const end = new Date(webinarContent.event.endIso)
  return { start, end }
}

export function buildGoogleCalendarUrl(): string {
  const { start, end } = getWebinarCalendarWindow()
  const text = webinarContent.hero.headline
  const details = [
    webinarContent.hero.subheadline,
    '',
    `Modalidad: ${webinarContent.event.modality}`,
    webinarContent.event.locationLabel,
    '',
    `Más información: ${getSiteBaseUrl()}${webinarContent.meta.canonicalPath}`,
  ].join('\n')

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text,
    details,
    dates: `${toGoogleUtc(start)}/${toGoogleUtc(end)}`,
    location: webinarContent.event.locationLabel,
  })

  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

export function getSiteBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ||
    'https://doce25.precotracks.org'
  )
}

export function buildIcsFileBody(): string {
  const { start, end } = getWebinarCalendarWindow()
  const dtStart = toGoogleUtc(start)
  const dtEnd = toGoogleUtc(end)
  const uid = `${webinarContent.meta.canonicalPath.replace(/\//g, '-')}-${WEBINAR_SLUG}@doce25.org`
  const dtStamp = toGoogleUtc(new Date())
  const summary = webinarContent.hero.headline
  const description = [
    webinarContent.hero.subheadline,
    '',
    webinarContent.event.locationLabel,
    `${getSiteBaseUrl()}${webinarContent.meta.canonicalPath}`,
  ].join('\\n')

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Doce25//Webinar//ES',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${escapeIcsText(summary)}`,
    `DESCRIPTION:${escapeIcsText(description)}`,
    `LOCATION:${escapeIcsText(webinarContent.event.locationLabel)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
}

function escapeIcsText(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;')
}

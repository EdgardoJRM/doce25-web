import { buildIcsFileBody } from '@/lib/webinar-calendar'

export function GET() {
  const body = buildIcsFileBody()
  return new Response(body, {
    status: 200,
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': 'attachment; filename="doce25-webinar.ics"',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}

# Funnel webinar Doce25 (`/webinar`)

## Rutas

| Ruta | Descripción |
|------|-------------|
| `/webinar` | Landing de registro |
| `/webinar/gracias` | Confirmación (idealmente con `?n=Nombre&registered=1` tras el formulario) |
| `/webinar/calendar.ics` | Archivo iCalendar generado con la fecha de `content.ts` |

## Editar copy y datos

**Todo vive en** [`content.ts`](./content.ts):

- Título, subtítulo, hero, secciones, FAQ, métricas, speaker, logos, thank-you.
- Fechas ISO del evento (`event.startIso`, `event.endIso`) para calendario, JSON-LD y emails.
- `WEBINAR_SLUG`: identificador único en DynamoDB (mismo slug si duplicas la carpeta para otro evento, cámbialo en `content.ts` y en la server action si separas archivos).

## Duplicar para otro webinar

1. Copia la carpeta `app/webinar` → por ejemplo `app/webinar-otro-tema`.
2. Ajusta rutas: en Next.js el segmento de carpeta es la URL (`/webinar-otro-tema`).
3. Edita `content.ts` (copy, fechas, `meta.canonicalPath`, `WEBINAR_SLUG`).
4. Busca/reemplaza rutas internas que apunten a `/webinar` (layout links, `thankYou`, redirects en `actions.ts` si copias también ese archivo).
5. Despliega la tabla DynamoDB (o reutiliza la misma tabla con **otro** `WEBINAR_SLUG` para segmentar filas).

## Formulario y backend

- Server action: [`actions.ts`](./actions.ts) (misma carpeta que esta guía) — validación, `PutCommand` a DynamoDB, dos correos SES (participante + interno).
- Tabla SAM: `Dosce25-WebinarRegistrations` (PK `email`, SK `webinarSlug`). Ver `sam-template.yaml`.
- Variables de entorno: ver [`.env.example`](../../.env.example) — `WEBINAR_REGISTRATIONS_TABLE`, `WEBINAR_INTERNAL_NOTIFICATION_EMAIL`, `SES_FROM_EMAIL`, credenciales AWS que use el hosting (p. ej. rol de Amplify SSR con `dynamodb:PutItem` y `ses:SendEmail` en esa tabla y remitentes verificados en SES).

## OG / imagen social

`meta.ogImage` apunta por defecto a `/doce25-logo.png`. Para LinkedIn/WhatsApp óptimo, añade un PNG 1200×630 en `public/og/` y actualiza `ogImage` en `content.ts`.

## Chrome del sitio

En `/webinar/*` se ocultan Navbar y Footer global; este funnel usa el header/footer propios en `layout.tsx` y `WebinarFooter.tsx`.

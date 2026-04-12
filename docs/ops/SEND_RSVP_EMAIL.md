# Correo RSVP — Limpieza 12 de abril 2026

## Qué hace

1. **Envío** (`scripts/send-rsvp-cleanup-email.js`): consulta registros del evento en DynamoDB, filtra por fecha de alta (`createdAt`), deduplica por email y envía un correo con dos enlaces **Sí asisto** / **No podré asistir**.
2. **Confirmación** (Lambda `confirm-rsvp`, ruta API `GET /rsvp/confirm`): valida un token firmado, guarda en el registro `rsvpCleanup20260412` (`yes` | `no`) y `rsvpCleanup20260412At`, y muestra una página HTML de gracias.
3. **Métricas**: consola `scripts/rsvp-stats.js` o la pantalla admin **Confirmaciones RSVP** en `/admin/eventos/{eventId}/rsvp`.

## Variables de entorno (`.env.local`)

| Variable | Uso |
|----------|-----|
| `NEXT_PUBLIC_API_ENDPOINT` | Base de la API (sin slash final). Los enlaces del correo serán `{API}/rsvp/confirm?...` |
| `JWT_SECRET` o `RSVP_LINK_SECRET` | Debe ser **el mismo** valor que usa la Lambda en AWS (`Globals` en `sam-template.yaml` o override en consola). Si no coinciden, los enlaces fallan con “inválido”. |
| `SES_FROM_EMAIL` | Remitente SES |
| `REGISTRATIONS_TABLE` | Por defecto `Dosce25-Registrations` |
| `AWS_REGION` | p. ej. `us-east-1` |

## Despliegue de la API

Tras añadir la función `ConfirmRsvpFunction` en `sam-template.yaml`, despliega el stack para que exista `GET /rsvp/confirm`:

```bash
sam build && sam deploy
```

Hasta que no esté desplegado, los enlaces del correo devolverán 404.

## Enviar el correo

```bash
# Contar destinatarios (registrados hasta fin del día indicado en PR, por defecto 2026-03-22)
node scripts/send-rsvp-cleanup-email.js <eventId> --dry-run

# Cambiar la fecha de corte
node scripts/send-rsvp-cleanup-email.js <eventId> --before=2026-03-22

# Envío real
node scripts/send-rsvp-cleanup-email.js <eventId>
```

## Estadísticas en consola

```bash
node scripts/rsvp-stats.js <eventId>
node scripts/rsvp-stats.js <eventId> --csv
```

## Admin

En **Gestión del evento** → **Confirmaciones RSVP**, o directamente:

`/admin/eventos/<eventId>/rsvp`

## Prueba manual

1. Envío a un correo de prueba (o tú mismo) con un solo registro en staging.
2. Clic en **Sí** y **No** (solo uno cuenta; el segundo muestra “ya tenemos tu respuesta”).
3. Comprobar en DynamoDB los campos `rsvpCleanup20260412` y `rsvpCleanup20260412At`.

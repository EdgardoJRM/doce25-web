# Encuesta post-evento y reporte PDF

## Resumen

- **Tablas DynamoDB**: `Dosce25-SurveyInvitations`, `Dosce25-SurveyResponses` (ver `sam-template.yaml`).
- **API** (API Gateway):
  - `POST /events/{eventId}/survey/send` — admin Cognito; envía correos SES con enlace `/encuesta/{token}`.
  - `GET /survey/{token}` — público; datos para mostrar el formulario.
  - `POST /survey/{token}` — público; envía respuesta (3 métricas + comentario opcional).
  - `GET /events/{eventId}/survey-stats` — admin; agregados para el reporte.
  - `POST /events/{eventId}/report/pdf` — admin; genera PDF y devuelve URL firmada (S3, ~1 h).
- **Frontend**:
  - Participante: `https://www.doce25.org/encuesta/{token}`.
  - Admin: **Panel → Evento → Reporte y encuesta** (`/admin/eventos/{eventId}/reporte`).

## Deploy backend

Desde la raíz del repo:

```bash
sam build --template-file sam-template.yaml
sam deploy
```

## Enviar encuesta (Piñones u otro evento)

1. Entra al panel admin y abre **Reporte y encuesta** para el evento, o usa el script:
2. `COGNITO_ID_TOKEN`: en el navegador, con sesión admin, el **id token** (no access) — o usa el botón en la UI del reporte.

Script:

```bash
export COGNITO_ID_TOKEN="eyJ..."
export NEXT_PUBLIC_API_ENDPOINT="https://YOUR_API.execute-api.us-east-1.amazonaws.com/prod"
node scripts/send-survey-pinones.mjs
```

## Verificar PDF (ej. Piñones)

1. Espera respuestas de encuesta (opcional; el PDF incluye demografía aunque la encuesta esté vacía).
2. En **Reporte y encuesta**, edita textos opcionales (`reportPresidentMessage`, `reportConclusion`) y pulsa **Generar PDF**.
3. Compara estructura con el reporte de referencia de Guayama (`0-6149040255762447039.pdf` en el repo).

## Evento Piñones (referencia)

- `eventId`: `ea44d757-de19-4a13-aa9f-afbf0da433f2`

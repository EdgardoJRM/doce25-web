# 📋 INFORMACIÓN DEL SISTEMA DOCE25

## 🌐 URLs DEL SISTEMA

### Frontend (Producción):
- **URL Principal:** https://main.d10lzd121ayedb.amplifyapp.com
- **Amplify Console:** https://us-east-1.console.aws.amazon.com/amplify/home?region=us-east-1#/d10lzd121ayedb

### Backend (API):
- **API Endpoint:** https://moo5jpvl56.execute-api.us-east-1.amazonaws.com/prod
- **CloudFormation Stack:** dosce25-api
- **Región:** us-east-1

### Repositorio:
- **GitHub:** https://github.com/EdgardoJRM/doce25-web.git
- **Branch Principal:** main

---

## 🔐 CREDENCIALES ADMIN

### AWS Cognito:
- **User Pool ID:** us-east-1_jK2m3C6w6
- **Client ID:** 39hhotrvehs8rck3sbua8sabab
- **Región:** us-east-1

### Admin Login:
- **URL:** https://main.d10lzd121ayedb.amplifyapp.com/admin/login
- **Email:** admin@dosce25.org
- **Password:** Doce25Admin2024!

---

## 📁 RECURSOS AWS

### DynamoDB Tables:
1. **Doce25-Events**
   - Partition Key: eventId
   - GSI: SlugIndex (slug)

2. **Doce25-Registrations**
   - Partition Key: registrationId
   - GSI: EventIdIndex (eventId)
   - GSI: QRTokenIndex (qrToken)

### S3 Buckets:
- **dosce25-qr-codes**
  - Almacenamiento de códigos QR
  - Acceso público configurado

### SES (Simple Email Service):
- **Verified Email:** noreply@dosce25.org
- **Usado por:**
  - Confirmación de registro
  - Reenvío de QR
  - Formulario de contacto

---

## 🔧 VARIABLES DE ENTORNO

### Frontend (.env.local):
```bash
NEXT_PUBLIC_API_ENDPOINT=https://moo5jpvl56.execute-api.us-east-1.amazonaws.com/prod
NEXT_PUBLIC_COGNITO_USER_POOL_ID=us-east-1_jK2m3C6w6
NEXT_PUBLIC_COGNITO_CLIENT_ID=39hhotrvehs8rck3sbua8sabab
NEXT_PUBLIC_AWS_REGION=us-east-1
```

### Backend (sam-template.yaml):
```yaml
EVENTS_TABLE: Doce25-Events
REGISTRATIONS_TABLE: Doce25-Registrations
S3_BUCKET: dosce25-qr-codes
SES_FROM_EMAIL: noreply@dosce25.org
FRONTEND_URL: https://dosce25.org
```

---

## 📊 ESTRUCTURA DE DATOS

### Evento (Event):
```typescript
{
  eventId: string        // UUID
  name: string
  slug: string          // URL-friendly
  description: string
  date: string         // YYYY-MM-DD
  time: string         // HH:MM
  location: string
  capacity: number
  imageUrl?: string
  status: 'draft' | 'published' | 'cancelled'
  createdAt: string    // ISO timestamp
  updatedAt?: string   // ISO timestamp
}
```

### Registro (Registration):
```typescript
{
  registrationId: string    // UUID
  eventId: string
  name: string
  email: string
  phone?: string
  qrToken: string          // UUID para check-in
  termsAccepted: boolean   // NUEVO
  checkedIn: boolean
  checkedInAt?: string     // ISO timestamp
  createdAt: string        // ISO timestamp
  updatedAt?: string       // ISO timestamp
}
```

---

## 🛣️ RUTAS DE LA APLICACIÓN

### Públicas:
- `/` - Página principal
- `/nosotros` - Sobre la fundación
- `/eventos` - Listado de eventos
- `/eventos/[slug]` - Detalle y registro
- `/galeria` - Galería de fotos
- `/contacto` - Formulario de contacto
- `/donar` - Información de donaciones
- `/terminos` - Términos y condiciones
- `/privacidad` - Política de privacidad
- `/relevo-responsabilidad` - Relevo legal

### Admin (protegidas con Cognito):
- `/admin/login` - Login de administrador
- `/admin/dashboard` - Dashboard con métricas
- `/admin/eventos` - Gestión de eventos
- `/admin/eventos/nuevo` - Crear evento
- `/admin/eventos/[eventId]` - Editar evento
- `/admin/asistentes/[eventId]` - Lista de asistentes
- `/admin/asistentes/[eventId]/editar/[registrationId]` - Editar asistente
- `/admin/scanner` - Escáner de QR

### Check-in:
- `/checkin/[token]` - Página de check-in automático

---

## 🔗 API ENDPOINTS

### Eventos:
- `GET /events` - Listar eventos
- `POST /events` - Crear evento
- `GET /events/{eventId}` - Obtener por ID
- `PUT /events/{eventId}` - Actualizar evento
- `DELETE /events/{eventId}` - Eliminar evento
- `GET /events/slug/{slug}` - Obtener por slug

### Registros:
- `POST /events/{eventId}/register` - Registrarse a evento
- `GET /events/{eventId}/registrations` - Listar registros
- `PUT /registrations/{registrationId}` - Actualizar registro
- `DELETE /registrations/{registrationId}` - Eliminar registro
- `POST /registrations/{registrationId}/resend-qr` - Reenviar QR

### Check-in:
- `POST /checkin/{token}` - Hacer check-in con QR

### Contacto:
- `POST /contact` - Enviar formulario de contacto

---

## 🚀 COMANDOS DE DEPLOYMENT

### Backend:
```bash
# Build
sam build --template-file sam-template.yaml

# Deploy
sam deploy --no-confirm-changeset

# Delete
sam delete
```

### Frontend:
```bash
# Build local
npm run build

# Run local
npm run dev

# Push to GitHub (auto-deploy a Amplify)
git add .
git commit -m "mensaje"
git push origin main
```

---

## 📧 EMAILS DE CONTACTO

- **General:** info@dosce25.org
- **Donaciones:** donaciones@dosce25.org
- **Privacidad:** privacidad@dosce25.org
- **No-Reply (Sistema):** noreply@dosce25.org

---

## 🌟 CARACTERÍSTICAS IMPLEMENTADAS

### Sistema de Eventos:
- ✅ CRUD completo de eventos
- ✅ Registro público con validación
- ✅ Generación automática de QR codes
- ✅ Email de confirmación con QR
- ✅ Check-in con QR (escáner o manual)
- ✅ Gestión de capacidad

### Panel Admin:
- ✅ Dashboard con métricas en tiempo real
- ✅ Gestión completa de eventos
- ✅ Gestión completa de asistentes
- ✅ Reenvío de QR codes
- ✅ Escáner de QR integrado
- ✅ Autenticación con AWS Cognito

### Páginas Institucionales:
- ✅ Sobre Nosotros
- ✅ Galería de fotos (51 imágenes)
- ✅ Contacto con formulario
- ✅ Donaciones
- ✅ Términos legales completos

### Seguridad:
- ✅ CORS configurado
- ✅ Cognito User Pool
- ✅ Relevo de responsabilidad
- ✅ Política de privacidad
- ✅ Términos y condiciones

---

## 📱 REDES SOCIALES

- **Instagram:** https://instagram.com/doce25
- **Facebook:** https://facebook.com/doce25

---

## 🔄 FLUJO DE TRABAJO

### Registro a Evento:
1. Usuario visita `/eventos/[slug]`
2. Llena formulario de registro
3. Acepta términos y condiciones
4. Backend genera QR code único
5. Guarda en DynamoDB
6. Sube QR a S3
7. Envía email con QR
8. Usuario recibe confirmación

### Check-in:
1. Usuario presenta QR code
2. Admin escanea con `/admin/scanner`
3. Sistema valida token
4. Marca check-in en DynamoDB
5. Muestra confirmación
6. Dashboard actualiza estadísticas

### Gestión Admin:
1. Admin login con Cognito
2. Accede a dashboard
3. Ve métricas en tiempo real
4. Crea/edita eventos
5. Gestiona asistentes
6. Reenvía QR si necesario

---

## 📞 SOPORTE TÉCNICO

Para problemas o preguntas técnicas:
- **Desarrollador:** [Tu nombre/email]
- **Documentación:** Ver archivos .md en el repositorio
- **Logs AWS:** CloudWatch Logs por cada Lambda

---

**Sistema Doce25 v1.0**  
*Última actualización: 12 de Febrero de 2026*



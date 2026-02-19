# Doce25 - Fundación Web

Sitio web de la fundación Doce25 con sistema de gestión de eventos, registro de asistentes y generación de códigos QR.

## Stack Tecnológico

- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Backend**: AWS Lambda + API Gateway
- **Autenticación**: AWS Cognito
- **Base de Datos**: Amazon DynamoDB
- **Almacenamiento**: Amazon S3
- **Emails**: Amazon SES
- **Hosting**: AWS Amplify

## Estructura del Proyecto

```
├── app/                    # Next.js App Router
│   ├── (public)/          # Rutas públicas
│   │   ├── page.tsx       # Homepage
│   │   ├── eventos/       # Lista de eventos
│   │   └── eventos/[slug] # Landing de evento específico
│   ├── admin/             # Panel de administración
│   │   ├── login/         # Login admin
│   │   ├── eventos/       # Gestión de eventos
│   │   └── asistentes/    # Lista de asistentes
│   └── api/               # API Routes (proxy a Lambda)
├── components/            # Componentes React reutilizables
├── lib/                   # Utilidades y configuración AWS
│   ├── aws-config.ts     # Configuración Amplify/Cognito
│   ├── dynamodb.ts       # Cliente DynamoDB
│   └── ses.ts            # Cliente SES
├── lambda/                # Funciones Lambda
│   ├── register-event/   # Registro a evento
│   ├── generate-qr/      # Generación de QR
│   └── send-email/       # Envío de emails
└── amplify/               # Configuración AWS Amplify
```

## Configuración Inicial

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar AWS Amplify

1. Instala AWS Amplify CLI:
```bash
npm install -g @aws-amplify/cli
```

2. Configura tus credenciales AWS:
```bash
amplify configure
```

3. Inicializa Amplify en el proyecto:
```bash
amplify init
```

4. Agrega autenticación (Cognito):
```bash
amplify add auth
```

5. Agrega API (API Gateway + Lambda):
```bash
amplify add api
```

6. Agrega almacenamiento (S3):
```bash
amplify add storage
```

### 3. Variables de Entorno

Crea un archivo `.env.local`:

```env
NEXT_PUBLIC_AWS_REGION=us-east-1
NEXT_PUBLIC_COGNITO_USER_POOL_ID=your-pool-id
NEXT_PUBLIC_COGNITO_CLIENT_ID=your-client-id
NEXT_PUBLIC_API_ENDPOINT=https://your-api-id.execute-api.us-east-1.amazonaws.com/prod
```

### 4. Ejecutar en desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Despliegue en AWS Amplify

1. Conecta tu repositorio en AWS Amplify Console
2. Amplify detectará automáticamente Next.js
3. El build se ejecutará automáticamente en cada push

O manualmente:

```bash
amplify publish
```

## Funcionalidades

### Públicas
- ✅ Página principal de la fundación
- ✅ Lista de eventos
- ✅ Landing page de evento con registro
- ✅ Confirmación de registro con QR code por email

### Administración
- ✅ Login seguro con Cognito
- ✅ Gestión de eventos (crear, editar, publicar)
- ✅ Lista de asistentes por evento
- ✅ Exportación de datos
- ✅ Verificación de QR codes en entrada

## Próximos Pasos

1. Configurar DynamoDB tables
2. Implementar Lambda functions
3. Configurar SES para emails
4. Personalizar diseño según identidad de marca



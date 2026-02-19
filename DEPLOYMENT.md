# Guía de Despliegue - Doce25

Esta guía te ayudará a desplegar la aplicación Doce25 en AWS usando Amplify y SAM (Serverless Application Model).

## Prerrequisitos

1. **Cuenta de AWS** con permisos adecuados
2. **AWS CLI** instalado y configurado
3. **Node.js 20.x** o superior
4. **AWS SAM CLI** instalado (para Lambda functions)
5. **AWS Amplify CLI** instalado (opcional, para gestión de recursos)

## Paso 1: Configurar AWS CLI

```bash
aws configure
```

Ingresa tus credenciales de AWS:
- AWS Access Key ID
- AWS Secret Access Key
- Default region (ej: `us-east-1`)
- Default output format (ej: `json`)

## Paso 2: Instalar Dependencias

```bash
npm install
```

## Paso 3: Desplegar Backend (Lambda + DynamoDB + S3 + SES)

### 3.1 Desplegar con AWS SAM

```bash
# Construir y desplegar
sam build
sam deploy --guided
```

Durante el proceso guiado, se te pedirá:
- Stack Name: `dosce25-backend`
- AWS Region: `us-east-1` (o tu región preferida)
- Confirm changes before deploy: `Y`
- Allow SAM CLI IAM role creation: `Y`
- Disable rollback: `N`
- Save arguments to configuration file: `Y`

### 3.2 Guardar Outputs

Después del despliegue, SAM mostrará los outputs. Guarda estos valores:

```
ApiEndpoint: https://xxxxx.execute-api.us-east-1.amazonaws.com/prod
EventsTableName: Doce25-Events
RegistrationsTableName: Doce25-Registrations
QRCodesBucketName: dosce25-qr-codes
```

### 3.3 Configurar SES

1. Ve a AWS SES Console
2. Verifica tu dominio o email desde el cual enviarás emails
3. Solicita salir del "Sandbox" si necesitas enviar a cualquier email
4. Actualiza la variable `SES_FROM_EMAIL` en el template SAM o en las variables de entorno de Lambda

## Paso 4: Configurar Cognito (Autenticación Admin)

### 4.1 Crear User Pool con Amplify CLI

```bash
amplify init
amplify add auth
```

Selecciona:
- Default configuration: `Default configuration with Social Provider`
- Username: `Email`
- Sign in options: `Email`
- Advanced settings: `No`

### 4.2 Crear Usuario Admin

```bash
amplify console auth
```

O manualmente en AWS Console:
1. Ve a Cognito → User Pools
2. Selecciona tu pool
3. Ve a "Users" → "Create user"
4. Ingresa email y contraseña temporal
5. Asigna al usuario al grupo "admin" (crear grupo si no existe)

### 4.3 Obtener IDs de Cognito

En AWS Console → Cognito → User Pools:
- User Pool ID: `us-east-1_xxxxx`
- App Client ID: `xxxxx`

## Paso 5: Configurar Frontend

### 5.1 Crear archivo `.env.local`

```bash
cp .env.example .env.local
```

Edita `.env.local` con tus valores:

```env
NEXT_PUBLIC_AWS_REGION=us-east-1
NEXT_PUBLIC_COGNITO_USER_POOL_ID=us-east-1_xxxxx
NEXT_PUBLIC_COGNITO_CLIENT_ID=xxxxx
NEXT_PUBLIC_API_ENDPOINT=https://xxxxx.execute-api.us-east-1.amazonaws.com/prod
```

### 5.2 Probar localmente

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

## Paso 6: Desplegar Frontend con AWS Amplify

### Opción A: Conectar Repositorio Git

1. Ve a [AWS Amplify Console](https://console.aws.amazon.com/amplify)
2. Click en "New app" → "Host web app"
3. Conecta tu repositorio (GitHub, GitLab, Bitbucket)
4. Amplify detectará automáticamente Next.js
5. Agrega las variables de entorno en "Environment variables"
6. Click "Save and deploy"

### Opción B: Desplegar desde CLI

```bash
amplify add hosting
amplify publish
```

## Paso 7: Configurar S3 Bucket para QR Codes

1. Ve a S3 Console
2. Encuentra el bucket `dosce25-qr-codes` (creado por SAM)
3. Ve a "Permissions" → "Bucket Policy"
4. Agrega política para permitir lectura pública:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::dosce25-qr-codes/*"
    }
  ]
}
```

## Paso 8: Crear Primer Evento (Admin)

1. Inicia sesión en `/admin/login`
2. Ve a `/admin/eventos`
3. Crea un nuevo evento
4. Publica el evento
5. Comparte el link del evento

## Verificación

### Verificar Lambda Functions

```bash
aws lambda list-functions --query "Functions[?contains(FunctionName, 'Doce25')].FunctionName"
```

### Verificar DynamoDB Tables

```bash
aws dynamodb list-tables
```

### Verificar API Gateway

```bash
aws apigateway get-rest-apis --query "items[?contains(name, 'Doce25')]"
```

## Troubleshooting

### Error: "Cognito not configured"
- Verifica que las variables de entorno estén correctas
- Asegúrate de que el User Pool existe y tiene un App Client

### Error: "API endpoint not found"
- Verifica que el API Gateway esté desplegado
- Revisa que la URL en `.env.local` sea correcta

### Error: "SES email not sent"
- Verifica que tu email/dominio esté verificado en SES
- Si estás en Sandbox, solo puedes enviar a emails verificados
- Solicita salir del Sandbox para producción

### Error: "S3 access denied"
- Verifica la política del bucket
- Asegúrate de que los objetos tienen permisos públicos

## Costos Estimados

- **AWS Amplify**: ~$0.15/GB transferido (primeros 5GB gratis)
- **Lambda**: Primeros 1M requests gratis, luego $0.20 por 1M requests
- **DynamoDB**: Primeros 25GB gratis, luego $0.25/GB
- **S3**: Primeros 5GB gratis, luego $0.023/GB
- **SES**: Primeros 62,000 emails gratis/mes
- **API Gateway**: Primeros 1M requests gratis, luego $3.50 por 1M requests

## Próximos Pasos

1. Configurar dominio personalizado en Amplify
2. Habilitar HTTPS/SSL
3. Configurar monitoreo con CloudWatch
4. Implementar CI/CD con GitHub Actions
5. Agregar más funcionalidades al panel admin


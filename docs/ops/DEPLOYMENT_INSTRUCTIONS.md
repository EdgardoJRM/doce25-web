# Instrucciones de Despliegue - Lambdas Nuevas

## Pre-requisitos
1. AWS SAM CLI instalado
2. AWS CLI configurado con credenciales
3. Node.js y npm instalados

## Paso 1: Instalar dependencias de las nuevas lambdas

```bash
# Lambda get-registrations
cd lambda/get-registrations
npm install
cd ../..

# Lambda checkin
cd lambda/checkin
npm install
cd ../..
```

## Paso 2: Construir el proyecto SAM

```bash
sam build
```

## Paso 3: Desplegar

### Opción A: Deployment guiado (primera vez)
```bash
sam deploy --guided
```

### Opción B: Deployment rápido (si ya está configurado)
```bash
sam deploy
```

## Paso 4: Actualizar DynamoDB

**IMPORTANTE**: Las nuevas lambdas requieren un índice GSI adicional en la tabla de Registrations.

Si la tabla ya existe, necesitarás:

1. Ir a AWS Console → DynamoDB → Tablas → Dosce25-Registrations
2. Pestaña "Indexes" → "Create index"
3. Configurar:
   - Partition key: `qrToken` (String)
   - Index name: `QRTokenIndex`
   - Projection: All attributes

**O usando CLI:**

```bash
aws dynamodb update-table \
  --table-name Dosce25-Registrations \
  --attribute-definitions AttributeName=qrToken,AttributeType=S \
  --global-secondary-index-updates \
    "[{\"Create\":{\"IndexName\":\"QRTokenIndex\",\"KeySchema\":[{\"AttributeName\":\"qrToken\",\"KeyType\":\"HASH\"}],\"Projection\":{\"ProjectionType\":\"ALL\"}}}]"
```

## Paso 5: Obtener el endpoint de la API

Después del deployment, obtén el endpoint:

```bash
aws cloudformation describe-stacks \
  --stack-name dosce25-api \
  --query 'Stacks[0].Outputs[?OutputKey==`ApiEndpoint`].OutputValue' \
  --output text
```

## Paso 6: Configurar Frontend

Actualiza el archivo `.env.local` en el proyecto Next.js:

```env
NEXT_PUBLIC_API_ENDPOINT=https://tu-api-id.execute-api.us-east-1.amazonaws.com/prod
```

## Paso 7: Deploy Frontend

```bash
npm run build
npm run start
# O desplegar a Amplify/Vercel según configuración
```

## Nuevos Endpoints Disponibles

Después del despliegue tendrás:

1. **GET** `/events/{eventId}/registrations` - Obtener registros de un evento
2. **POST** `/checkin/{token}` - Realizar check-in con QR token

## Verificación

Prueba los nuevos endpoints:

```bash
# Test get-registrations
curl https://tu-api-endpoint/prod/events/EVENT_ID/registrations

# Test checkin (esto hará el check-in real)
curl -X POST https://tu-api-endpoint/prod/checkin/QR_TOKEN
```

## Troubleshooting

### Error: Table not found
- Verifica que las tablas existan en DynamoDB
- Verifica los nombres en las variables de ambiente

### Error: Index not found  
- Crea el GSI `QRTokenIndex` manualmente (ver Paso 4)

### Error: Access denied
- Verifica los permisos IAM de las lambdas
- Las políticas están definidas en `sam-template.yaml`

### Error: CORS
- Verifica que el frontend use el endpoint correcto
- Los headers CORS están configurados en las lambdas



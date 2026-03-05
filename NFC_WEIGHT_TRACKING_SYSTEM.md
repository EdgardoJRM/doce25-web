# Sistema de Seguimiento NFC + Peso para Doce25

## Descripción General

Sistema completo para vincular tarjetas NFC a participantes, registrar peso de basura recogida, y generar certificados personalizados con perfil del participante.

---

## Flujo Completo del Sistema

### Fase 1: Registro Inicial (En casa, antes del evento)

```
Participante en doce25.org
    ↓
Se registra en el evento (llena formulario)
    ↓
Recibe QR code único (por email)
    ↓
✅ Ya está registrado en la base de datos
```

### Fase 2: Check-in (Llegada al evento)

```
Participante llega a Playa Aviones
    ↓
Staff escanea su QR code con móvil/lector
    ↓
App muestra: "Juan García - Evento: Limpieza Playa"
    ↓
Staff pega NFC card al móvil/lector NFC
    ↓
App vincula: NFC ID ↔ Cuenta de Juan
    ↓
App escribe URL en NFC: https://doce25.org/participante/reg-123
    ↓
✅ Juan tiene su NFC card registrada
```

### Fase 3: Recolección de Basura

```
Juan recoge basura durante el evento
    ↓
Staff pesa la basura
    ↓
Se registra el peso en el sistema
```

### Fase 4: Check-out (Registro de Peso)

```
Juan regresa del evento
    ↓
Staff escanea NFC card de Juan
    ↓
App abre formulario de peso:
   - Peso recogido: [45] kg
   - Tipo de basura: [Plástico ▼]
   - Desglose: Plástico: 30kg, Metal: 15kg
   - Notas: [Mucha basura...]
    ↓
Staff ingresa datos
    ↓
Sistema genera certificado automáticamente
    ↓
✅ Registro completado
```

### Fase 5: Perfil del Participante

```
Juan pega NFC a su teléfono
    ↓
Se abre automáticamente: https://doce25.org/participante/reg-123
    ↓
Juan ve su perfil:
   - Nombre: Juan García
   - Evento: Limpieza Playa Aviones
   - Peso recogido: 45 kg
   - Desglose: Plástico 30kg, Metal 15kg
   - Impacto: "Salvaste 45kg del océano"
    ↓
Opciones:
   - Descargar certificado PDF
   - Compartir en Instagram
   - Compartir en WhatsApp
    ↓
✅ Participante satisfecho
```

---

## Estructura de Base de Datos

### Tabla: Registrations (Actualizada)

```typescript
{
  // Identificadores
  registrationId: "reg-123",           // UUID único
  eventId: "event-789",                // Evento
  userId?: "user-456",                 // Usuario logueado (opcional)
  
  // Información personal
  fullName: "Juan García",
  email: "juan@example.com",
  phone: "+1-787-555-1234",
  organization: "Medlife UPR - Rio Piedras",
  city: "San Juan",
  ageRange: "25-34",
  gender: "M",
  
  // QR Code (existente)
  qrToken: "QR-ABC123",                // Token único para QR
  
  // NFC (NUEVO)
  nfcCardId: "NFC-XYZ789",             // ID de la tarjeta NFC
  nfcUrl: "https://doce25.org/participante/reg-123",  // URL escrita en NFC
  
  // Check-in
  checkedIn: true,
  checkInTime: "2026-03-22T10:15:00",
  
  // Check-out (Peso) - NUEVO
  checkedOut: true,
  checkOutTime: "2026-03-22T12:30:00",
  weightCollected: 45,                 // Peso total en kg
  trashType: "mixed",                  // Tipo principal
  trashBreakdown: {                    // Desglose detallado
    plastic: 30,
    metal: 15,
    glass: 0,
    other: 0
  },
  notes: "Mucha basura en la orilla",
  
  // Certificado - NUEVO
  certificateGenerated: true,
  certificateUrl: "s3://bucket/certificates/cert-123.pdf",
  certificateGeneratedAt: "2026-03-22T12:35:00",
  
  // Timestamps
  createdAt: "2026-03-15T14:30:00",
  updatedAt: "2026-03-22T12:35:00",
  
  // Términos
  termsAccepted: true,
  signatureDate: "2026-03-15"
}
```

---

## Endpoints Necesarios

### 1. Vincular NFC (Check-in)

**POST** `/registrations/{registrationId}/link-nfc`

**Request:**
```json
{
  "nfcCardId": "NFC-XYZ789"
}
```

**Response:**
```json
{
  "success": true,
  "message": "NFC vinculado correctamente",
  "registration": {
    "registrationId": "reg-123",
    "fullName": "Juan García",
    "nfcCardId": "NFC-XYZ789",
    "nfcUrl": "https://doce25.org/participante/reg-123",
    "checkedIn": true,
    "checkInTime": "2026-03-22T10:15:00"
  }
}
```

**Lógica:**
1. Obtener registro por ID
2. Validar que existe y pertenece al evento
3. Generar URL única: `https://doce25.org/participante/{registrationId}`
4. Guardar nfcCardId y nfcUrl
5. Marcar como checkedIn
6. Retornar datos

---

### 2. Registrar Peso (Check-out)

**POST** `/registrations/{registrationId}/register-weight`

**Request:**
```json
{
  "weightCollected": 45,
  "trashType": "mixed",
  "trashBreakdown": {
    "plastic": 30,
    "metal": 15,
    "glass": 0,
    "other": 0
  },
  "notes": "Mucha basura en la orilla"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Peso registrado correctamente",
  "registration": {
    "registrationId": "reg-123",
    "fullName": "Juan García",
    "weightCollected": 45,
    "trashBreakdown": {
      "plastic": 30,
      "metal": 15
    },
    "checkedOut": true,
    "checkOutTime": "2026-03-22T12:30:00",
    "certificateUrl": "s3://bucket/certificates/cert-123.pdf"
  }
}
```

**Lógica:**
1. Obtener registro por ID
2. Validar que está checkedIn
3. Guardar peso y desglose
4. Marcar como checkedOut
5. Llamar a lambda de generar certificado
6. Retornar datos con URL del certificado

---

### 3. Obtener Perfil del Participante

**GET** `/participante/{registrationId}`

**Response:**
```json
{
  "fullName": "Juan García",
  "eventName": "Limpieza Playa Aviones & Pocita de Piñones",
  "eventDate": "2026-03-22",
  "eventLocation": "Playa Aviones, Loíza",
  "organization": "Medlife UPR - Rio Piedras",
  "weightCollected": 45,
  "trashBreakdown": {
    "plastic": 30,
    "metal": 15,
    "glass": 0,
    "other": 0
  },
  "impact": "Salvaste 45kg del océano",
  "certificateUrl": "s3://bucket/certificates/cert-123.pdf",
  "certificateGeneratedAt": "2026-03-22T12:35:00",
  "checkInTime": "2026-03-22T10:15:00",
  "checkOutTime": "2026-03-22T12:30:00",
  "eventImage": "https://..."
}
```

---

### 4. Generar Certificado

**POST** `/registrations/{registrationId}/generate-certificate`

**Response:**
```json
{
  "success": true,
  "certificateUrl": "s3://bucket/certificates/cert-123.pdf",
  "message": "Certificado generado correctamente"
}
```

**Lógica:**
1. Obtener datos del registro
2. Obtener datos del evento
3. Generar PDF con:
   - Nombre del participante
   - Evento
   - Fecha
   - Peso recogido
   - Desglose de basura
   - Impacto ambiental
   - QR code para verificación
4. Subir a S3
5. Guardar URL en DynamoDB
6. Retornar URL

---

## Lambdas a Crear

### 1. `lambda/link-nfc/index.ts`

```typescript
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { DynamoDBDocumentClient, UpdateCommand } from '@aws-sdk/lib-dynamodb'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'

const dynamoClient = DynamoDBDocumentClient.from(new DynamoDBClient({}))

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const { registrationId } = event.pathParameters || {}
    const { nfcCardId } = JSON.parse(event.body || '{}')

    if (!registrationId || !nfcCardId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'registrationId y nfcCardId requeridos' })
      }
    }

    const nfcUrl = `https://doce25.org/participante/${registrationId}`

    await dynamoClient.send(
      new UpdateCommand({
        TableName: 'Dosce25-Registrations',
        Key: { registrationId },
        UpdateExpression: 'SET nfcCardId = :nfc, nfcUrl = :url, checkedIn = :true, checkInTime = :time',
        ExpressionAttributeValues: {
          ':nfc': nfcCardId,
          ':url': nfcUrl,
          ':true': true,
          ':time': new Date().toISOString()
        }
      })
    )

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'NFC vinculado correctamente',
        nfcUrl
      })
    }
  } catch (error) {
    console.error('Error:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error vinculando NFC' })
    }
  }
}
```

### 2. `lambda/register-weight/index.ts`

```typescript
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { DynamoDBDocumentClient, UpdateCommand, GetCommand } from '@aws-sdk/lib-dynamodb'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda'

const dynamoClient = DynamoDBDocumentClient.from(new DynamoDBClient({}))
const lambdaClient = new LambdaClient({})

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const { registrationId } = event.pathParameters || {}
    const { weightCollected, trashType, trashBreakdown, notes } = JSON.parse(event.body || '{}')

    if (!registrationId || !weightCollected) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'registrationId y weightCollected requeridos' })
      }
    }

    // Actualizar registro con peso
    await dynamoClient.send(
      new UpdateCommand({
        TableName: 'Dosce25-Registrations',
        Key: { registrationId },
        UpdateExpression: 'SET weightCollected = :weight, trashType = :type, trashBreakdown = :breakdown, notes = :notes, checkedOut = :true, checkOutTime = :time',
        ExpressionAttributeValues: {
          ':weight': weightCollected,
          ':type': trashType,
          ':breakdown': trashBreakdown,
          ':notes': notes || '',
          ':true': true,
          ':time': new Date().toISOString()
        }
      })
    )

    // Generar certificado
    await lambdaClient.send(
      new InvokeCommand({
        FunctionName: 'dosce25-api-GenerateCertificateFunction',
        Payload: JSON.stringify({ registrationId })
      })
    )

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Peso registrado y certificado generado'
      })
    }
  } catch (error) {
    console.error('Error:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error registrando peso' })
    }
  }
}
```

### 3. `lambda/generate-certificate/index.ts`

```typescript
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { DynamoDBDocumentClient, GetCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'

const dynamoClient = DynamoDBDocumentClient.from(new DynamoDBClient({}))
const s3Client = new S3Client({})

export const handler = async (event: any): Promise<APIGatewayProxyResult> => {
  try {
    const { registrationId } = event.pathParameters ? event.pathParameters : event

    // Obtener registro
    const regResult = await dynamoClient.send(
      new GetCommand({
        TableName: 'Dosce25-Registrations',
        Key: { registrationId }
      })
    )

    const registration = regResult.Item
    if (!registration) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Registro no encontrado' })
      }
    }

    // Crear PDF
    const pdfDoc = await PDFDocument.create()
    const page = pdfDoc.addPage([600, 800])
    const { height } = page.getSize()

    // Título
    page.drawText('🌊 CERTIFICADO 🌊', {
      x: 150,
      y: height - 100,
      size: 32,
      color: rgb(0.1, 0.6, 0.8)
    })

    // Contenido
    page.drawText(`Se certifica que`, {
      x: 200,
      y: height - 200,
      size: 14
    })

    page.drawText(registration.fullName, {
      x: 150,
      y: height - 250,
      size: 24,
      color: rgb(0, 0, 0)
    })

    page.drawText(`Participó en la`, {
      x: 200,
      y: height - 320,
      size: 14
    })

    page.drawText(`"${registration.eventName || 'Evento Doce25'}"`, {
      x: 100,
      y: height - 370,
      size: 16
    })

    page.drawText(`Recogió: ${registration.weightCollected} kg de basura`, {
      x: 150,
      y: height - 450,
      size: 14
    })

    page.drawText(`Impacto: Salvaste ${registration.weightCollected}kg del océano`, {
      x: 100,
      y: height - 500,
      size: 14,
      color: rgb(0.1, 0.6, 0.2)
    })

    page.drawText(`¡Gracias por tu compromiso!`, {
      x: 150,
      y: height - 600,
      size: 16
    })

    // Guardar PDF
    const pdfBytes = await pdfDoc.save()
    const certificateKey = `certificates/${registrationId}.pdf`

    await s3Client.send(
      new PutObjectCommand({
        Bucket: 'dosce25-qr-codes',
        Key: certificateKey,
        Body: pdfBytes,
        ContentType: 'application/pdf'
      })
    )

    const certificateUrl = `https://dosce25-qr-codes.s3.amazonaws.com/${certificateKey}`

    // Actualizar registro
    await dynamoClient.send(
      new UpdateCommand({
        TableName: 'Dosce25-Registrations',
        Key: { registrationId },
        UpdateExpression: 'SET certificateUrl = :url, certificateGeneratedAt = :time',
        ExpressionAttributeValues: {
          ':url': certificateUrl,
          ':time': new Date().toISOString()
        }
      })
    )

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        certificateUrl
      })
    }
  } catch (error) {
    console.error('Error:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error generando certificado' })
    }
  }
}
```

---

## Páginas Frontend a Crear

### 1. Página de Perfil del Participante

**Ruta:** `app/participante/[registrationId]/page.tsx`

```typescript
import { getRegistration } from '@/lib/api'
import CertificateDisplay from '@/components/CertificateDisplay'
import ShareButtons from '@/components/ShareButtons'

export default async function ParticipantProfile({ params }) {
  const { registrationId } = params
  const registration = await getRegistration(registrationId)

  if (!registration) {
    return <div>Registro no encontrado</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-teal-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Perfil */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900">{registration.fullName}</h1>
          <p className="text-gray-600">{registration.organization}</p>
          
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Evento</p>
              <p className="text-lg font-semibold">{registration.eventName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Fecha</p>
              <p className="text-lg font-semibold">{new Date(registration.eventDate).toLocaleDateString('es-PR')}</p>
            </div>
          </div>
        </div>

        {/* Peso Recogido */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">📊 Peso Recogido</h2>
          <p className="text-4xl font-bold text-teal-600">{registration.weightCollected} kg</p>
          
          {registration.trashBreakdown && (
            <div className="mt-4 space-y-2">
              {Object.entries(registration.trashBreakdown).map(([type, weight]) => (
                <div key={type} className="flex justify-between">
                  <span className="capitalize">{type}:</span>
                  <span className="font-semibold">{weight} kg</span>
                </div>
              ))}
            </div>
          )}
          
          <p className="mt-4 text-lg text-teal-700 font-semibold">
            🌊 ¡Salvaste {registration.weightCollected}kg del océano!
          </p>
        </div>

        {/* Certificado */}
        {registration.certificateUrl && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">🏆 Certificado</h2>
            <CertificateDisplay url={registration.certificateUrl} />
            <a
              href={registration.certificateUrl}
              download
              className="mt-4 inline-block bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700"
            >
              Descargar PDF
            </a>
          </div>
        )}

        {/* Compartir */}
        <ShareButtons registration={registration} />
      </div>
    </div>
  )
}
```

### 2. Página de Staff (Check-in/Check-out)

**Ruta:** `app/admin/staff-checkin/page.tsx`

```typescript
'use client'

import { useState } from 'react'
import QRScanner from '@/components/QRScanner'
import NFCScanner from '@/components/NFCScanner'
import WeightForm from '@/components/WeightForm'

export default function StaffCheckIn() {
  const [step, setStep] = useState<'qr' | 'nfc' | 'weight'>('qr')
  const [registration, setRegistration] = useState(null)

  const handleQRScanned = async (qrToken: string) => {
    // Obtener registro por QR
    const res = await fetch(`/api/registrations/by-qr/${qrToken}`)
    const data = await res.json()
    setRegistration(data)
    setStep('nfc')
  }

  const handleNFCScanned = async (nfcId: string) => {
    // Vincular NFC
    await fetch(`/api/registrations/${registration.registrationId}/link-nfc`, {
      method: 'POST',
      body: JSON.stringify({ nfcCardId: nfcId })
    })
    setStep('weight')
  }

  const handleWeightSubmitted = async (weight: number, trashType: string, breakdown: any) => {
    // Registrar peso
    await fetch(`/api/registrations/${registration.registrationId}/register-weight`, {
      method: 'POST',
      body: JSON.stringify({ weightCollected: weight, trashType, trashBreakdown: breakdown })
    })
    setStep('qr')
    setRegistration(null)
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">📱 Check-in/Check-out</h1>

        {step === 'qr' && <QRScanner onScanned={handleQRScanned} />}
        {step === 'nfc' && registration && (
          <NFCScanner registration={registration} onScanned={handleNFCScanned} />
        )}
        {step === 'weight' && registration && (
          <WeightForm registration={registration} onSubmitted={handleWeightSubmitted} />
        )}
      </div>
    </div>
  )
}
```

---

## Componentes a Crear

### 1. `components/QRScanner.tsx`
- Escanear QR code del participante
- Mostrar datos del participante

### 2. `components/NFCScanner.tsx`
- Leer NFC card
- Vincular a cuenta

### 3. `components/WeightForm.tsx`
- Formulario para ingresar peso
- Desglose de basura
- Notas

### 4. `components/CertificateDisplay.tsx`
- Mostrar certificado PDF
- Botón de descarga

### 5. `components/ShareButtons.tsx`
- Compartir en Instagram
- Compartir en WhatsApp
- Copiar enlace

---

## Actualizar SAM Template

Agregar a `sam-template.yaml`:

```yaml
LinkNFCFunction:
  Type: AWS::Serverless::Function
  Properties:
    CodeUri: lambda/link-nfc/
    Handler: index.handler
    Events:
      LinkNFC:
        Type: Api
        Properties:
          RestApiId: !Ref ApiGateway
          Path: /registrations/{registrationId}/link-nfc
          Method: post

RegisterWeightFunction:
  Type: AWS::Serverless::Function
  Properties:
    CodeUri: lambda/register-weight/
    Handler: index.handler
    Events:
      RegisterWeight:
        Type: Api
        Properties:
          RestApiId: !Ref ApiGateway
          Path: /registrations/{registrationId}/register-weight
          Method: post

GenerateCertificateFunction:
  Type: AWS::Serverless::Function
  Properties:
    CodeUri: lambda/generate-certificate/
    Handler: index.handler
    Timeout: 60
    MemorySize: 512
    Events:
      GenerateCertificate:
        Type: Api
        Properties:
          RestApiId: !Ref ApiGateway
          Path: /registrations/{registrationId}/generate-certificate
          Method: post
```

---

## Costo Estimado

| Concepto | Costo |
|----------|-------|
| Lambdas (3 nuevas) | Gratis (free tier) |
| DynamoDB (campos nuevos) | Gratis (free tier) |
| S3 (certificados PDF) | ~$0.01/mes |
| Amplify (página nueva) | Gratis |
| **Total adicional** | **~$0.01/mes** |

---

## Pasos de Implementación

1. ✅ Crear 3 lambdas (link-nfc, register-weight, generate-certificate)
2. ✅ Actualizar SAM template
3. ✅ Crear páginas frontend (participante, staff-checkin)
4. ✅ Crear componentes (QRScanner, NFCScanner, WeightForm, etc.)
5. ✅ Actualizar DynamoDB schema
6. ✅ Hacer deploy
7. ✅ Probar flujo completo

---

## Notas Importantes

- **NFC Writing**: Necesitas escribir la URL en la tarjeta NFC durante el check-in
- **Web NFC API**: Funciona en Chrome/Edge, limitado en Safari
- **Alternativa**: Usar lector NFC dedicado para mayor compatibilidad
- **Certificados**: Se generan automáticamente al registrar peso
- **Seguridad**: Validar que el registrationId pertenece al evento correcto

---

## Futuras Mejoras

- [ ] Leaderboard de participantes por peso recogido
- [ ] Gamificación (badges, puntos)
- [ ] Integración con redes sociales
- [ ] Estadísticas en tiempo real
- [ ] Notificaciones push cuando se genera certificado
- [ ] Exportar datos a Excel
- [ ] Análisis de impacto ambiental


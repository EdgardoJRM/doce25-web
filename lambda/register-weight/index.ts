import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, PutCommand, GetCommand } from '@aws-sdk/lib-dynamodb'
import { v4 as uuidv4 } from 'uuid'

const dynamoClient = DynamoDBDocumentClient.from(new DynamoDBClient({}))

const TABLES = {
  REGISTRATIONS: process.env.REGISTRATIONS_TABLE || 'Dosce25-Registrations',
  WEIGHT_RECORDS: process.env.WEIGHT_RECORDS_TABLE || 'Dosce25-WeightRecords',
}

interface TrashBreakdown {
  plastic?: number
  metal?: number
  glass?: number
  organic?: number
  other?: number
}

interface RegisterWeightBody {
  weightCollected: number
  trashType: 'plastic' | 'metal' | 'glass' | 'organic' | 'mixed' | 'other'
  trashBreakdown?: TrashBreakdown
  notes?: string
  registeredBy?: string
}

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  }

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    }
  }

  try {
    const { registrationId } = event.pathParameters || {}
    
    if (!registrationId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'registrationId es requerido' }),
      }
    }

    const body: RegisterWeightBody = JSON.parse(event.body || '{}')
    const { weightCollected, trashType, trashBreakdown, notes, registeredBy } = body

    // Validaciones
    if (weightCollected === undefined || weightCollected === null) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'weightCollected es requerido' }),
      }
    }

    if (weightCollected <= 0 || weightCollected > 500) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'El peso debe estar entre 0.1 y 500 kg' }),
      }
    }

    if (!trashType) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'trashType es requerido' }),
      }
    }

    // Validar suma de desglose si se proporciona
    if (trashBreakdown) {
      const breakdownSum = Object.values(trashBreakdown).reduce((sum, val) => sum + (val || 0), 0)
      const maxAllowed = weightCollected * 1.1 // 10% de margen de error
      
      if (breakdownSum > maxAllowed) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ 
            error: 'La suma del desglose no puede exceder el peso total + 10%',
            breakdownSum,
            maxAllowed 
          }),
        }
      }
    }

    // Verificar que el registro existe
    const getResult = await dynamoClient.send(
      new GetCommand({
        TableName: TABLES.REGISTRATIONS,
        Key: { registrationId },
      })
    )

    if (!getResult.Item) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'Registro no encontrado' }),
      }
    }

    // Verificar que está checked in
    if (!getResult.Item.checkedIn) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'El participante debe hacer check-in primero' }),
      }
    }

    const registration = getResult.Item
    const isGroupParticipant = !!registration.groupId
    const registeredByName = registration.fullName || registration.name

    // Crear registro en WeightRecords
    const weightRecordId = uuidv4()
    const timestamp = new Date().toISOString()

    const weightRecord = {
      weightRecordId,
      registrationId: isGroupParticipant ? null : registrationId,
      groupId: registration.groupId || null,
      eventId: registration.eventId,
      weightCollected,
      trashType,
      trashBreakdown: trashBreakdown || {},
      timestamp,
      registeredBy: registrationId,
      registeredByName,
      notes: notes || '',
    }

    await dynamoClient.send(
      new PutCommand({
        TableName: TABLES.WEIGHT_RECORDS,
        Item: weightRecord,
      })
    )

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Peso registrado correctamente',
        weightRecord,
        isGroupWeight: isGroupParticipant,
      }),
    }
  } catch (error: any) {
    console.error('Error registrando peso:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Error interno del servidor',
        message: error.message,
      }),
    }
  }
}

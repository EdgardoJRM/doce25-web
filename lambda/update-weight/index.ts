import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, UpdateCommand, GetCommand } from '@aws-sdk/lib-dynamodb'

const dynamoClient = DynamoDBDocumentClient.from(new DynamoDBClient({}))

const TABLES = {
  REGISTRATIONS: 'Dosce25-Registrations',
}

interface TrashBreakdown {
  plastic?: number
  metal?: number
  glass?: number
  organic?: number
  other?: number
}

interface UpdateWeightBody {
  weightCollected: number
  trashType: 'plastic' | 'metal' | 'glass' | 'organic' | 'mixed' | 'other'
  trashBreakdown?: TrashBreakdown
  notes?: string
}

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    'Access-Control-Allow-Methods': 'PUT, OPTIONS',
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
    // TODO: Validar que el usuario es admin usando el token JWT
    // const authHeader = event.headers.Authorization || event.headers.authorization
    // if (!authHeader) {
    //   return { statusCode: 401, headers, body: JSON.stringify({ error: 'No autorizado' }) }
    // }

    const { registrationId } = event.pathParameters || {}
    
    if (!registrationId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'registrationId es requerido' }),
      }
    }

    const body: UpdateWeightBody = JSON.parse(event.body || '{}')
    const { weightCollected, trashType, trashBreakdown, notes } = body

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

    // Actualizar registro
    const updateResult = await dynamoClient.send(
      new UpdateCommand({
        TableName: TABLES.REGISTRATIONS,
        Key: { registrationId },
        UpdateExpression:
          'SET weightCollected = :weight, trashType = :type, trashBreakdown = :breakdown, notes = :notes, updatedAt = :updated',
        ExpressionAttributeValues: {
          ':weight': weightCollected,
          ':type': trashType,
          ':breakdown': trashBreakdown || {},
          ':notes': notes || '',
          ':updated': new Date().toISOString(),
        },
        ReturnValues: 'ALL_NEW',
      })
    )

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Peso actualizado correctamente',
        registration: updateResult.Attributes,
      }),
    }
  } catch (error: any) {
    console.error('Error actualizando peso:', error)
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

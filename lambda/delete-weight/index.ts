import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, UpdateCommand, GetCommand } from '@aws-sdk/lib-dynamodb'

const dynamoClient = DynamoDBDocumentClient.from(new DynamoDBClient({}))

const TABLES = {
  REGISTRATIONS: 'Dosce25-Registrations',
}

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    'Access-Control-Allow-Methods': 'DELETE, OPTIONS',
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

    if (!getResult.Item.weightCollected) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Este registro no tiene peso registrado' }),
      }
    }

    // "Eliminar" el peso (lo marcamos como null/undefined)
    const updateResult = await dynamoClient.send(
      new UpdateCommand({
        TableName: TABLES.REGISTRATIONS,
        Key: { registrationId },
        UpdateExpression:
          'REMOVE weightCollected, trashType, trashBreakdown, notes, registeredBy SET checkedOut = :false, checkOutTime = :null, updatedAt = :updated',
        ExpressionAttributeValues: {
          ':false': false,
          ':null': null,
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
        message: 'Registro de peso eliminado correctamente',
        registration: updateResult.Attributes,
      }),
    }
  } catch (error: any) {
    console.error('Error eliminando peso:', error)
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

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb'
import * as jwt from 'jsonwebtoken'

const dynamoClient = DynamoDBDocumentClient.from(new DynamoDBClient({}))
const REGISTRATIONS_TABLE = process.env.REGISTRATIONS_TABLE || 'Dosce25-Registrations'
const JWT_SECRET = process.env.JWT_SECRET || 'secret'

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
  'Access-Control-Allow-Methods': 'GET,OPTIONS',
  'Content-Type': 'application/json',
}

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' }
  }

  try {
    // Verificar token JWT
    const authHeader = event.headers.Authorization || event.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ message: 'Token no proporcionado' }),
      }
    }

    const token = authHeader.substring(7)
    let decoded: any

    try {
      decoded = jwt.verify(token, JWT_SECRET)
    } catch (err) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ message: 'Token inválido o expirado' }),
      }
    }

    const userId = event.pathParameters?.userId || decoded.userId

    // Verificar que el usuario solo pueda ver sus propios registros (a menos que sea admin)
    if (userId !== decoded.userId) {
      // TODO: Verificar si es admin con Cognito
      return {
        statusCode: 403,
        headers,
        body: JSON.stringify({ message: 'No tienes permiso para ver estos registros' }),
      }
    }

    // Obtener registros del usuario
    // Nota: Necesitamos crear un GSI en Registrations con userId
    // Por ahora hacemos un scan con filtro (no óptimo para producción)
    const result = await dynamoClient.send(
      new QueryCommand({
        TableName: REGISTRATIONS_TABLE,
        IndexName: 'UserIdIndex', // Crearemos este índice
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId,
        },
      })
    )

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        registrations: result.Items || [],
      }),
    }
  } catch (error: any) {
    console.error('Error:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        message: 'Error al obtener registros',
        error: error.message,
      }),
    }
  }
}


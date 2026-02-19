import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, GetCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb'
import * as jwt from 'jsonwebtoken'

const dynamoClient = DynamoDBDocumentClient.from(new DynamoDBClient({}))
const USERS_TABLE = process.env.USERS_TABLE || 'Dosce25-Users'
const JWT_SECRET = process.env.JWT_SECRET || 'secret'

const headers = {
  'Access-Control-Allow-Origin': 'https://doce25.precotracks.org',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
  'Access-Control-Allow-Methods': 'PUT,OPTIONS',
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

    const body = JSON.parse(event.body || '{}')
    const { fullName, phone, ageRange, gender, city, organization } = body

    // Verificar que el usuario existe
    const existingUser = await dynamoClient.send(
      new GetCommand({
        TableName: USERS_TABLE,
        Key: { userId: decoded.userId },
      })
    )

    if (!existingUser.Item) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ message: 'Usuario no encontrado' }),
      }
    }

    // Construir expresión de actualización
    const updateExpressions: string[] = []
    const expressionAttributeValues: any = {
      ':updatedAt': new Date().toISOString(),
    }
    const expressionAttributeNames: any = {}

    if (fullName !== undefined) {
      updateExpressions.push('fullName = :fullName')
      expressionAttributeValues[':fullName'] = fullName
    }
    if (phone !== undefined) {
      updateExpressions.push('phone = :phone')
      expressionAttributeValues[':phone'] = phone
    }
    if (ageRange !== undefined) {
      updateExpressions.push('ageRange = :ageRange')
      expressionAttributeValues[':ageRange'] = ageRange
    }
    if (gender !== undefined) {
      updateExpressions.push('gender = :gender')
      expressionAttributeValues[':gender'] = gender
    }
    if (city !== undefined) {
      updateExpressions.push('city = :city')
      expressionAttributeValues[':city'] = city
    }
    if (organization !== undefined) {
      updateExpressions.push('organization = :organization')
      expressionAttributeValues[':organization'] = organization
    }

    updateExpressions.push('updatedAt = :updatedAt')

    // Actualizar usuario
    const result = await dynamoClient.send(
      new UpdateCommand({
        TableName: USERS_TABLE,
        Key: { userId: decoded.userId },
        UpdateExpression: `SET ${updateExpressions.join(', ')}`,
        ExpressionAttributeValues: expressionAttributeValues,
        ...(Object.keys(expressionAttributeNames).length > 0 && { ExpressionAttributeNames: expressionAttributeNames }),
        ReturnValues: 'ALL_NEW',
      })
    )

    // No devolver password
    const { password, ...userWithoutPassword } = result.Attributes || {}

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: 'Perfil actualizado exitosamente',
        user: userWithoutPassword,
      }),
    }
  } catch (error: any) {
    console.error('Error:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        message: 'Error al actualizar perfil',
        error: error.message,
      }),
    }
  }
}


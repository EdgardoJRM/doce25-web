import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, QueryCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb'
import * as bcrypt from 'bcryptjs'
import * as jwt from 'jsonwebtoken'

const dynamoClient = DynamoDBDocumentClient.from(new DynamoDBClient({}))
const USERS_TABLE = process.env.USERS_TABLE || 'Dosce25-Users'
const JWT_SECRET = process.env.JWT_SECRET || 'secret'

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
  'Access-Control-Allow-Methods': 'POST,OPTIONS',
  'Content-Type': 'application/json',
}

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' }
  }

  try {
    const body = JSON.parse(event.body || '{}')
    const { email, password } = body

    if (!email || !password) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: 'Email y contraseña son requeridos' }),
      }
    }

    // Buscar usuario por email
    const result = await dynamoClient.send(
      new QueryCommand({
        TableName: USERS_TABLE,
        IndexName: 'EmailIndex',
        KeyConditionExpression: 'email = :email',
        ExpressionAttributeValues: {
          ':email': email.toLowerCase(),
        },
      })
    )

    if (!result.Items || result.Items.length === 0) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ message: 'Email o contraseña incorrectos' }),
      }
    }

    const user = result.Items[0]

    // Verificar contraseña
    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ message: 'Email o contraseña incorrectos' }),
      }
    }

    // Verificar status
    if (user.status !== 'active') {
      return {
        statusCode: 403,
        headers,
        body: JSON.stringify({ message: 'Tu cuenta está inactiva. Contacta a soporte.' }),
      }
    }

    // Actualizar lastLogin
    await dynamoClient.send(
      new UpdateCommand({
        TableName: USERS_TABLE,
        Key: { userId: user.userId },
        UpdateExpression: 'SET lastLogin = :now',
        ExpressionAttributeValues: {
          ':now': new Date().toISOString(),
        },
      })
    )

    // Generar JWT token
    const token = jwt.sign(
      { userId: user.userId, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    // No devolver password
    const { password: _, ...userWithoutPassword } = user

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: 'Login exitoso',
        user: userWithoutPassword,
        token,
      }),
    }
  } catch (error: any) {
    console.error('Error:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        message: 'Error al iniciar sesión',
        error: error.message,
      }),
    }
  }
}


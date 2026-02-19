import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb'
import * as bcrypt from 'bcryptjs'
import * as jwt from 'jsonwebtoken'
import { randomUUID } from 'crypto'

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
    const { email, password, fullName, phone, ageRange, gender, city, organization } = body

    // Validaciones
    if (!email || !password || !fullName) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: 'Email, password y nombre son requeridos' }),
      }
    }

    if (password.length < 8) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: 'La contraseña debe tener al menos 8 caracteres' }),
      }
    }

    // Verificar si el email ya existe
    const existingUser = await dynamoClient.send(
      new QueryCommand({
        TableName: USERS_TABLE,
        IndexName: 'EmailIndex',
        KeyConditionExpression: 'email = :email',
        ExpressionAttributeValues: {
          ':email': email.toLowerCase(),
        },
      })
    )

    if (existingUser.Items && existingUser.Items.length > 0) {
      return {
        statusCode: 409,
        headers,
        body: JSON.stringify({ message: 'Este email ya está registrado' }),
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Crear usuario
    const userId = randomUUID()
    const now = new Date().toISOString()

    const user = {
      userId,
      email: email.toLowerCase(),
      password: hashedPassword,
      fullName,
      phone: phone || '',
      ageRange: ageRange || '',
      gender: gender || '',
      city: city || '',
      organization: organization || '',
      createdAt: now,
      updatedAt: now,
      lastLogin: now,
      status: 'active',
    }

    await dynamoClient.send(
      new PutCommand({
        TableName: USERS_TABLE,
        Item: user,
      })
    )

    // Generar JWT token
    const token = jwt.sign(
      { userId, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    // No devolver password
    const { password: _, ...userWithoutPassword } = user

    return {
      statusCode: 201,
      headers,
      body: JSON.stringify({
        message: 'Usuario registrado exitosamente',
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
        message: 'Error al registrar usuario',
        error: error.message,
      }),
    }
  }
}


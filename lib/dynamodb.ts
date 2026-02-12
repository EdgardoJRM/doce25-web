import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'

// Cliente DynamoDB para uso en Lambda functions
// No usar directamente en el frontend por seguridad

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
})

export const dynamoClient = DynamoDBDocumentClient.from(client)

// Nombres de tablas
export const TABLES = {
  EVENTS: 'Dosce25-Events',
  REGISTRATIONS: 'Dosce25-Registrations',
}


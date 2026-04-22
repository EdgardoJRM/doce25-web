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
  /** Webinar / lead capture (PK email, SK webinarSlug). Override con WEBINAR_REGISTRATIONS_TABLE en env. */
  WEBINAR_REGISTRATIONS:
    process.env.WEBINAR_REGISTRATIONS_TABLE || 'Dosce25-WebinarRegistrations',
}



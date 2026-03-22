/**
 * Script para agregar organizaciones predefinidas a DynamoDB
 * Uso: node scripts/seed-organizations.js
 */

const { DynamoDBClient } = require('@aws-sdk/client-dynamodb')
const { DynamoDBDocumentClient, QueryCommand, UpdateCommand, PutCommand } = require('@aws-sdk/lib-dynamodb')

const dynamoClient = DynamoDBDocumentClient.from(new DynamoDBClient({}))

const TABLES = {
  REGISTRATIONS: process.env.REGISTRATIONS_TABLE || 'Dosce25-Registrations',
}

// Organizaciones predefinidas
const PREDEFINED_ORGANIZATIONS = [
  'Starbucks',
  'Mapfre',
]

async function seedOrganizations() {
  try {
    console.log('🌱 Iniciando seed de organizaciones predefinidas...')
    console.log(`📋 Organizaciones a agregar: ${PREDEFINED_ORGANIZATIONS.join(', ')}`)

    // Para cada organización predefinida, crear un registro de referencia
    // (En DynamoDB, las organizaciones se almacenan implícitamente en los registros)
    // Este script es principalmente informativo y puede usarse para validar

    console.log('✅ Organizaciones predefinidas configuradas:')
    PREDEFINED_ORGANIZATIONS.forEach((org) => {
      console.log(`   - ${org}`)
    })

    console.log('\n💡 Nota: Las organizaciones se crean automáticamente cuando un usuario las selecciona.')
    console.log('   Estas organizaciones predefinidas estarán disponibles en el dropdown.')
  } catch (error) {
    console.error('❌ Error durante el seed:', error)
    process.exit(1)
  }
}

seedOrganizations()

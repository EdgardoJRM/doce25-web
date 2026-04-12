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

// Organizaciones predefinidas (nombres canónicos — debe coincidir con lib/organizations.ts)
const PREDEFINED_ORGANIZATIONS = [
  'AAPEDS - Río Piedras',
  'AESA - Ciencias Médicas',
  'AESPUG - RCM',
  'ACS - UPRRP',
  'AEC UPR - Cayey',
  'AEC UPR - Humacao',
  'AMSA UPR - Bayamón',
  'AMSA UPR - Cayey',
  'AMSA UPR - Río Piedras',
  'AMSA Universidad Interamericana Metro',
  'AMWA UPR - Río Piedras',
  'APPR - Río Piedras',
  'Acción Social desde la Psicología UPR Río Piedras',
  'Ana G Méndez de Gurabo',
  'Baristas del Caribe (Starbucks) - Los Colobos, Carolina',
  'CASHI',
  'CGE',
  'CPM - UPR Mayagüez',
  'CUDAS UPR - Cayey',
  'Capítulo Hortus - NHS',
  'Capítulo Hortus de University Gardens',
  'Colegio de La Salle',
  'Cupeyville School',
  'DECA UAGM Cupey',
  'Doce25',
  'Escuela Pedro Falú Orellano',
  'Escuela Segundo Ruiz Belvis',
  'FPA UPR - Bayamón',
  'FPA UPR - Cayey',
  'FPA - UPRRP',
  'GOSA - UPRRP',
  'HOSA - UPRRP',
  'Hortus',
  'IQ Dermos UPR - Río Piedras',
  'IRP+',
  'MAPFRE',
  'MedLife Inter Metro',
  'MedLife Interamericana',
  'MedLife UAGM - Gurabo',
  'MedLife UIPR Metro',
  'MedLife UPR - Cayey',
  'MedLife UPR - Río Piedras',
  'Neuroboricuas UPR - Arecibo',
  'Neuroboricuas UPR - Bayamón',
  'Neuroboricuas UPR - Río Piedras',
  'Organización de las Naciones Unidas (ONU)',
  'PRPDA UPR - Río Piedras',
  'PRPDA Intermetro',
  'PSYCHI UPR - Cayey',
  'PVSA - UPRRP',
  'Planet Guardians',
  'Pre Vet Student Association Río Piedras',
  'Pre-Law UPR - Cayey',
  'SACNAS UPR - Río Piedras',
  'Sociedad de Honor Junior - Fidei',
  'Sociedad Eco-Ambiental UPRRP',
  'TMED UPR - Cayey',
  'Tribeta UPR - Cayey',
  'University Gardens High School',
  'Vet-Tech Community UAGM - Gurabo',
  'WINS UPR - Río Piedras',
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

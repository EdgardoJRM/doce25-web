import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb'

const dynamoClient = DynamoDBDocumentClient.from(new DynamoDBClient({}))
const EVENTS_TABLE = process.env.EVENTS_TABLE || 'Dosce25-Events'

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const headers = {
    'Access-Control-Allow-Origin': 'https://doce25.precotracks.org',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
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
    console.log('Getting events from table:', EVENTS_TABLE)
    
    // Obtener solo eventos publicados
    const result = await dynamoClient.send(
      new ScanCommand({
        TableName: EVENTS_TABLE,
        FilterExpression: '#status = :status',
        ExpressionAttributeNames: {
          '#status': 'status',
        },
        ExpressionAttributeValues: {
          ':status': 'published',
        },
      })
    )

    console.log('Events retrieved:', result.Items?.length || 0)

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        events: result.Items || [],
      }),
    }
  } catch (error: any) {
    console.error('Error getting events:', error)
    console.error('Error stack:', error.stack)
    
    // Asegurar que siempre devolvemos headers CORS incluso en errores
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        message: 'Internal server error',
        error: error.message || 'Unknown error',
      }),
    }
  }
}

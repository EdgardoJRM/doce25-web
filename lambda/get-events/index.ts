import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb'

const dynamoClient = DynamoDBDocumentClient.from(new DynamoDBClient({}))
const EVENTS_TABLE = process.env.EVENTS_TABLE || 'Dosce25-Events'

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
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

    const includeUnlisted =
      event.queryStringParameters?.includeUnlisted === '1' ||
      event.queryStringParameters?.includeUnlisted === 'true'

    // Publicados; unlisted solo si includeUnlisted (admin)
    const filterExpression = includeUnlisted
      ? '#status = :status'
      : '#status = :status AND (attribute_not_exists(visibility) OR visibility = :public)'

    const expressionAttributeValues: Record<string, string> = {
      ':status': 'published',
    }
    if (!includeUnlisted) {
      expressionAttributeValues[':public'] = 'public'
    }

    const result = await dynamoClient.send(
      new ScanCommand({
        TableName: EVENTS_TABLE,
        FilterExpression: filterExpression,
        ExpressionAttributeNames: {
          '#status': 'status',
        },
        ExpressionAttributeValues: expressionAttributeValues,
      })
    )

    console.log('Events retrieved:', result.Items?.length || 0, { includeUnlisted })

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

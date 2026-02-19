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
    const shortCode = event.pathParameters?.shortCode
    if (!shortCode) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: 'Short code is required' }),
      }
    }

    const result = await dynamoClient.send(
      new ScanCommand({
        TableName: EVENTS_TABLE,
        FilterExpression: 'shortCode = :shortCode AND #status = :status',
        ExpressionAttributeNames: {
          '#status': 'status',
        },
        ExpressionAttributeValues: {
          ':shortCode': shortCode,
          ':status': 'published',
        },
      })
    )

    if (!result.Items || result.Items.length === 0) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ message: 'Event not found' }),
      }
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        event: result.Items[0],
      }),
    }
  } catch (error: any) {
    console.error('Error:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        message: 'Internal server error',
        error: error.message,
      }),
    }
  }
}


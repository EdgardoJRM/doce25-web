import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb'

const dynamoClient = DynamoDBDocumentClient.from(new DynamoDBClient({}))
const TABLES = {
  WEIGHT_RECORDS: process.env.WEIGHT_RECORDS_TABLE || 'Dosce25-WeightRecords',
}

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
    return { statusCode: 200, headers, body: '' }
  }

  try {
    const registrationId = event.pathParameters?.registrationId
    const groupId = event.pathParameters?.groupId

    if (!registrationId && !groupId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: 'registrationId or groupId is required' }),
      }
    }

    let queryResult

    if (groupId) {
      // Query by groupId
      queryResult = await dynamoClient.send(
        new QueryCommand({
          TableName: TABLES.WEIGHT_RECORDS,
          IndexName: 'GroupIndex',
          KeyConditionExpression: 'groupId = :groupId',
          ExpressionAttributeValues: {
            ':groupId': groupId,
          },
          ScanIndexForward: false,
        })
      )
    } else {
      // Query by registrationId
      queryResult = await dynamoClient.send(
        new QueryCommand({
          TableName: TABLES.WEIGHT_RECORDS,
          IndexName: 'RegistrationIndex',
          KeyConditionExpression: 'registrationId = :registrationId',
          ExpressionAttributeValues: {
            ':registrationId': registrationId!,
          },
          ScanIndexForward: false,
        })
      )
    }

    const records = queryResult.Items || []
    const totalWeight = records.reduce((sum, record) => sum + (record.weightCollected || 0), 0)

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        records,
        totalWeight,
        tripCount: records.length,
        summary: {
          byType: records.reduce((acc: any, record) => {
            const type = record.trashType || 'mixed'
            acc[type] = (acc[type] || 0) + (record.weightCollected || 0)
            return acc
          }, {}),
        },
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

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const USERS_TABLE = process.env.USERS_TABLE || '';

export const handler = async (event: any) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
    'Access-Control-Allow-Methods': 'GET,OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    // Scan all users (for admin panel)
    const command = new ScanCommand({
      TableName: USERS_TABLE,
      ProjectionExpression: 'userId, email, fullName, phone, ageRange, gender, city, organization, createdAt, lastLogin, #status',
      ExpressionAttributeNames: {
        '#status': 'status',
      },
    });

    const result = await docClient.send(command);

    // Sort by createdAt (newest first)
    const users = (result.Items || []).sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        users,
        count: users.length,
      }),
    };
  } catch (error: any) {
    console.error('Error fetching users:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        message: 'Error al obtener usuarios',
        error: error.message,
      }),
    };
  }
};


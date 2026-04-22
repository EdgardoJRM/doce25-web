/**
 * Admin-only: Cognito ID token with admin group or ADMIN_EMAILS.
 * Duplicado en cada Lambda que lo usa (SAM solo empaqueta CodeUri).
 */
import { CognitoJwtVerifier } from 'aws-jwt-verify'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

const COGNITO_USER_POOL_ID = process.env.COGNITO_USER_POOL_ID || ''
const COGNITO_CLIENT_ID = process.env.COGNITO_CLIENT_ID || ''
const COGNITO_ADMIN_GROUP = process.env.COGNITO_ADMIN_GROUP || ''
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || '')
  .split(',')
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean)

let cognitoVerifier: ReturnType<typeof CognitoJwtVerifier.create> | null = null

function getCognitoVerifier() {
  if (!COGNITO_USER_POOL_ID || !COGNITO_CLIENT_ID) return null
  if (!cognitoVerifier) {
    cognitoVerifier = CognitoJwtVerifier.create({
      userPoolId: COGNITO_USER_POOL_ID,
      tokenUse: 'id',
      clientId: COGNITO_CLIENT_ID,
    })
  }
  return cognitoVerifier
}

function cognitoPayloadIsAdmin(payload: { email?: string; 'cognito:groups'?: string[] }) {
  if (ADMIN_EMAILS.length > 0) {
    const email = (payload.email || '').toLowerCase()
    if (ADMIN_EMAILS.includes(email)) return true
  }
  if (COGNITO_ADMIN_GROUP) {
    const groups = payload['cognito:groups']
    if (Array.isArray(groups) && groups.includes(COGNITO_ADMIN_GROUP)) return true
  }
  return false
}

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,OPTIONS',
  'Content-Type': 'application/json',
}

export async function requireCognitoAdmin(
  event: APIGatewayProxyEvent
): Promise<{ ok: true } | { ok: false; response: APIGatewayProxyResult }> {
  const authHeader = event.headers.Authorization || event.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return {
      ok: false,
      response: {
        statusCode: 401,
        headers: corsHeaders,
        body: JSON.stringify({ message: 'Token no proporcionado' }),
      },
    }
  }
  const verifier = getCognitoVerifier()
  if (!verifier) {
    return {
      ok: false,
      response: {
        statusCode: 500,
        headers: corsHeaders,
        body: JSON.stringify({
          message:
            'API sin COGNITO_USER_POOL_ID / COGNITO_CLIENT_ID; no se puede verificar admin.',
        }),
      },
    }
  }
  try {
    const token = authHeader.substring(7)
    const payload = await verifier.verify(token)
    if (!cognitoPayloadIsAdmin(payload)) {
      return {
        ok: false,
        response: {
          statusCode: 403,
          headers: corsHeaders,
          body: JSON.stringify({
            message:
              'No tienes permiso de administrador. Usa una cuenta del grupo Cognito admin o ADMIN_EMAILS.',
          }),
        },
      }
    }
    return { ok: true }
  } catch {
    return {
      ok: false,
      response: {
        statusCode: 401,
        headers: corsHeaders,
        body: JSON.stringify({ message: 'Token inválido o expirado' }),
      },
    }
  }
}

import { Amplify } from 'aws-amplify'

// Configuración de AWS Amplify
// Estas variables se configurarán automáticamente cuando despliegues con Amplify
// O puedes configurarlas manualmente en .env.local

const awsConfig = {
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID || '',
      userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID || '',
      region: process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-1',
    },
  },
  API: {
    REST: {
      api: {
        endpoint: process.env.NEXT_PUBLIC_API_ENDPOINT || '',
        region: process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-1',
      },
    },
  },
}

// Solo inicializar Amplify en el cliente
if (typeof window !== 'undefined') {
  Amplify.configure(awsConfig)
}

export default awsConfig


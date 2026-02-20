'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { Amplify } from 'aws-amplify'
import { signIn as amplifySignIn, signOut as amplifySignOut, getCurrentUser, fetchAuthSession } from 'aws-amplify/auth'

// Configurar Amplify en el cliente
if (typeof window !== 'undefined') {
  Amplify.configure({
    Auth: {
      Cognito: {
        userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID || '',
        userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID || '',
      },
    },
  }, { ssr: true })
}

interface User {
  username: string
  email?: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  loading: true,
  signIn: async () => {},
  signOut: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const currentUser = await getCurrentUser()
      setUser({
        username: currentUser.username,
        email: currentUser.signInDetails?.loginId,
      })
      
      // Obtener el token de la sesión
      const session = await fetchAuthSession()
      const idToken = session.tokens?.idToken?.toString()
      setToken(idToken || null)
    } catch (error) {
      setUser(null)
      setToken(null)
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    await amplifySignIn({ username: email, password })
    await checkUser()
  }

  const signOut = async () => {
    await amplifySignOut()
    setUser(null)
    setToken(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}


import { NextAuthOptions } from 'next-auth'
import { JWT } from 'next-auth/jwt'
import CredentialsProvider from 'next-auth/providers/credentials'
import Github from 'next-auth/providers/github'

// Types for our authentication
interface User {
  id: string
  email: string
  name: string
  role: string
}

// Server-side GraphQL request function (works in NextAuth authorize)
async function serverGraphqlRequest(query: string, variables: any): Promise<any> {
  const endpoint = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'http://localhost:4000/graphql'
  
  console.log('🔍 GraphQL Debug - Endpoint:', endpoint)
  console.log('🔍 GraphQL Debug - Variables:', variables)
  
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  })

  console.log('🔍 Response status:', response.status)
  
  if (!response.ok) {
    const errorText = await response.text()
    console.log('🔍 Error response:', errorText)
    throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`)
  }

  const result = await response.json()
  console.log('🔍 GraphQL result:', result)
  
  if (result.errors) {
    throw new Error(result.errors[0]?.message || 'GraphQL Error')
  }
  
  return result.data
}
// TODO: Can't we use the same mutations from the graphql folder?
// GraphQL mutations for authentication
const LOGIN_MUTATION = `
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      user {
        id
        email
        name
        role
      }
      accessToken
    }
  }
`

const REGISTER_MUTATION = `
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      user {
        id
        email
        name
        role
      }
      accessToken
    }
  }
`

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        name: { label: 'Name', type: 'text' }, // For registration
        action: { label: 'Action', type: 'text' }, // 'login' or 'register'
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required')
        }

        try {
          let data: any
          let accessToken: string
          
          if (credentials.action === 'register') {
            if (!credentials.name) {
              throw new Error('Name is required for registration')
            }
            const result = await serverGraphqlRequest(REGISTER_MUTATION, {
              input: {
                email: credentials.email,
                password: credentials.password,
                name: credentials.name,
                role: 'casual',
              },
            })
            data = result.register.user
            accessToken = result.register.accessToken
          } else {
            const result = await serverGraphqlRequest(LOGIN_MUTATION, {
              input: {
                email: credentials.email,
                password: credentials.password,
              },
            })
            data = result.login.user
            accessToken = result.login.accessToken
          }
          
          if (data && accessToken) {
            return {
              id: data.id,
              email: data.email,
              name: data.name,
              role: data.role,
              accessToken: accessToken,
            }
          }
          
          return null
        } catch (error) {
          console.error('Authentication error:', error)
          throw new Error(error instanceof Error ? error.message : 'Authentication failed')
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  jwt: {
    maxAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: any }) {
      // Initial sign in
      if (user) {
        token.accessToken = user.accessToken
        token.role = user.role
        token.id = user.id
      }
      return token
    },
    async session({ session, token }: { session: any; token: JWT }) {
      // Send properties to the client
      if (token) {
        session.accessToken = token.accessToken
        session.user.id = token.id
        session.user.role = token.role
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
    error: '/login', // Redirect to login on error
  },
  secret: process.env.NEXTAUTH_SECRET,
}

import { NextAuthOptions } from 'next-auth'
import { JWT } from 'next-auth/jwt'
import CredentialsProvider from 'next-auth/providers/credentials'
import { graphqlRequest } from '../utils/useGraphQL'

// Types for our authentication
interface User {
  id: string
  email: string
  name: string
  role: string
}

interface LoginResponse {
  user: User
  token: string
}

// GraphQL mutations for authentication
const LOGIN_MUTATION = `
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      user {
        id
        email
        name
        role
      }
      token
    }
  }
`

const REGISTER_MUTATION = `
  mutation Register($email: String!, $password: String!, $name: String!) {
    register(email: $email, password: $password, name: $name) {
      user {
        id
        email
        name
        role
      }
      token
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
          
          if (credentials.action === 'register') {
            if (!credentials.name) {
              throw new Error('Name is required for registration')
            }
            data = await graphqlRequest(REGISTER_MUTATION, {
              email: credentials.email,
              password: credentials.password,
              name: credentials.name,
            })
            data = data.register
          } else {
            data = await graphqlRequest(LOGIN_MUTATION, {
              email: credentials.email,
              password: credentials.password,
            })
            data = data.login
          }

          if (data?.user && data?.token) {
            return {
              id: data.user.id,
              email: data.user.email,
              name: data.user.name,
              role: data.user.role,
              accessToken: data.token,
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

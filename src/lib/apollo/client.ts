import { ApolloClient, InMemoryCache, from, ApolloLink, Observable } from '@apollo/client'
import { HttpLink } from '@apollo/client/link/http'
import { ErrorLink } from '@apollo/client/link/error'
import { RetryLink } from '@apollo/client/link/retry'
import { getSession, signOut } from 'next-auth/react'

// --- HTTP link ---
const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'http://localhost:4000/graphql',
})

// --- Auth link (NextAuth session-based) ---
const authLink = new ApolloLink((operation, forward) => {
  return new Observable(observer => {
    // Get token from NextAuth session instead of localStorage
    getSession().then((session: any) => {
      const token = session?.accessToken

      operation.setContext(({ headers = {} }: { headers?: Record<string, string> }) => ({
        headers: {
          ...headers,
          authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      }))
      
      // Subscribe to the forward operation and pass results
      const subscription = forward(operation).subscribe({
        next: observer.next.bind(observer),
        error: observer.error.bind(observer),
        complete: observer.complete.bind(observer),
      })

      return () => {
        subscription.unsubscribe()
      }
    }).catch(() => {
      // If session fails, continue without token
      operation.setContext(({ headers = {} }: { headers?: Record<string, string> }) => ({
        headers: {
          ...headers,
          'Content-Type': 'application/json',
        },
      }))
      
      // Subscribe to the forward operation and pass results
      const subscription = forward(operation).subscribe({
        next: observer.next.bind(observer),
        error: observer.error.bind(observer),
        complete: observer.complete.bind(observer),
      })

      return () => {
        subscription.unsubscribe()
      }
    })
  })
})

// --- Error link (NextAuth-based logout) ---
const errorLink = new ErrorLink(({ graphQLErrors, networkError }: any) => {
  if (graphQLErrors?.length) {
    for (const { message, locations, path, extensions } of graphQLErrors) {
      console.error(
        `[GraphQL error] Message: ${message}, Location: ${JSON.stringify(
          locations
        )}, Path: ${path}`
      )
      if (
        message.includes('Authentication required') ||
        message.includes('Token expired') ||
        extensions?.code === 'UNAUTHENTICATED'
      ) {
        if (typeof window !== 'undefined') {
          // Use NextAuth signOut instead of localStorage manipulation
          signOut({ callbackUrl: '/login' })
        }
      }
    }
  }

  if (networkError) {
    console.error(`[Network error]: ${networkError}`)
    if ((networkError as any)?.message?.includes?.('Failed to fetch')) {
      console.error('Backend appears offline')
    }
  }
})

// Retry Link - retries failed requests
const retryLink = new RetryLink({
  delay: {
    initial: 300,
    max: Infinity,
    jitter: true
  },
  attempts: {
    max: 3,
    retryIf: (error, _operation) => {
      // Retry on network errors but not on GraphQL errors
      return !!error && !error.message.includes('GraphQL error')
    }
  }
})

// Apollo Client instance
export const apolloClient = new ApolloClient({
  link: from([
    errorLink,
    retryLink,
    authLink,
    httpLink
  ]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          // Cache policies for pagination
          users: {
            keyArgs: false,
            merge(existing = [], incoming) {
              return [...existing, ...incoming]
            }
          },
          agents: {
            keyArgs: false,
            merge(existing = [], incoming) {
              return [...existing, ...incoming]
            }
          },
          conversations: {
            keyArgs: false,
            merge(existing = [], incoming) {
              return [...existing, ...incoming]
            }
          }
        }
      }
    }
  }),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
      notifyOnNetworkStatusChange: true
    },
    query: {
      errorPolicy: 'all'
    }
  }
})

// Helper function to check if Apollo Client is ready
export const isApolloClientReady = () => {
  return apolloClient !== null
}

// Helper function to clear Apollo cache
export const clearApolloCache = () => {
  return apolloClient.clearStore()
}

'use client'
import { useApolloClient } from '@apollo/client/react';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { gql } from '@apollo/client';

// Apollo Client Utilities Hook
export const useApolloUtils = () => {
  const client = useApolloClient()
  
  const clearCache = () => {
    return client.clearStore()
  }
  
  const refetchQueries = (queries: string[]) => {
    return client.refetchQueries({
      include: queries
    })
  }

  return { clearCache, refetchQueries }
}

// Connection Status Hook - Updated for NextAuth
export const useConnectionStatus = () => {
  const [isOnline, setIsOnline] = useState(true)
  const [connectionError, setConnectionError] = useState<Error | null>(null)
  const { data: session, status } = useSession()
  const client = useApolloClient()

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Test connection by making a simple query
  useEffect(() => {
    const testConnection = async () => {
      if (status === 'loading') return

      try {
        // Simple query to test connection
        await client.query({
          query: gql`{ __typename }`,
          fetchPolicy: 'network-only'
        })
        setConnectionError(null)
      } catch (error) {
        console.error('Connection test failed:', error)
        setConnectionError(error as Error)
      }
    }

    testConnection()
  }, [client, status])

  // Connection is good if we're online, authenticated (or not required), and no errors
  const isConnected = isOnline && status !== 'loading' && !connectionError

  return {
    isOnline,
    isConnected,
    connectionError,
    isAuthenticated: !!session?.user
  }
}

// Server-side GraphQL request function (works in NextAuth authorize)
export const serverGraphqlRequest = async (query: string, variables: any): Promise<any> => {
  const endpoint = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'http://localhost:4000/graphql'
  
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

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const result = await response.json()
  
  if (result.errors) {
    throw new Error(result.errors[0]?.message || 'GraphQL Error')
  }
  
  return result.data
}
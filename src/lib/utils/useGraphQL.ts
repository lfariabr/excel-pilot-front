'use client'
import { useApolloClient } from '@apollo/client/react';
import { useState } from 'react';
import { useCurrentUser } from '../hooks/users/useUsers';

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

// Connection Status Hook
export const useConnectionStatus = () => {
  const [isOnline, setIsOnline] = useState(true)
  const { data, loading, error } = useCurrentUser()
  
  // Simple connection check based on current user query
  const isConnected = !loading && !error && data
  
  return {
    isOnline,
    isConnected,
    connectionError: error
  }
}

export const graphqlRequest = async (query: string, variables: any): Promise<any> => {
  const response = await fetch(process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'http://localhost:4000/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  })

  const result = await response.json()
  
  if (result.errors) {
    throw new Error(result.errors[0]?.message || 'GraphQL Error')
  }
  
  return result.data
}

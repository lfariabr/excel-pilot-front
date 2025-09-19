import { useApolloClient } from '@apollo/client/react';
import { useState } from 'react';
import { useCurrentUser } from './useUsers';

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

'use client'

import { ApolloProvider } from '@apollo/client/react'
import { apolloClient } from './client'

interface ApolloProviderProps {
  children: React.ReactNode
}

export function ApolloProviderWrapper({ children }: ApolloProviderProps) {
  return (
    <ApolloProvider client={apolloClient}>
      {children}
    </ApolloProvider>
  )
}

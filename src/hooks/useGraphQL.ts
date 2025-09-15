import { useQuery, useMutation, useApolloClient } from '@apollo/client/react';
import { useState } from 'react';
import { 
  GET_USERS, 
  GET_USER_BY_ID, 
  GET_CURRENT_USER,
  GET_CHAT_MESSAGES,
  LOGIN_USER,
  REGISTER_USER,
  SEND_CHAT_MESSAGE
} from '@/lib/apollo/queries';

// User Hooks
export const useUsers = () => {
  return useQuery(GET_USERS, {
    // variables: { limit, offset },
    errorPolicy: 'all'
  })
}

export const useUser = (id: string) => {
  return useQuery(GET_USER_BY_ID, {
    variables: { id },
    skip: !id,
    errorPolicy: 'all'
  })
}

export const useCurrentUser = () => {
  return useQuery(GET_CURRENT_USER, {
    errorPolicy: 'all'
  })
}

// Agent Hooks
// export const useAgents = (limit = 10, offset = 0) => {
//   return useQuery(GET_AGENTS, {
//     variables: { limit, offset },
//     errorPolicy: 'all'
//   })
// }

// export const useAgent = (id: string) => {
//   return useQuery(GET_AGENT_BY_ID, {
//     variables: { id },
//     skip: !id,
//     errorPolicy: 'all'
//   })
// }

// Chat Message Hooks
export const useChatMessages = (agentId: string, limit = 50, offset = 0) => {
  return useQuery(GET_CHAT_MESSAGES, {
    variables: { agentId, limit, offset },
    skip: !agentId,
    errorPolicy: 'all',
    pollInterval: 5000 // Poll every 5 seconds for new messages
  })
}

// Authentication Hooks
export const useLogin = () => {
  const [loginMutation, { loading, error }] = useMutation(LOGIN_USER)
  
  const login = async (email: string, password: string) => {
    try {
      const result = await loginMutation({
        variables: { email, password }
      })
      
      const loginData = result.data as any
      if (loginData?.login?.token) {
        // Store token in localStorage
        localStorage.setItem('excel-pilot-token', loginData.login.token)
        return loginData.login
      }
      
      throw new Error('Login failed - no token received')
    } catch (err) {
      console.error('Login error:', err)
      throw err
    }
  }

  return { login, loading, error }
}

export const useRegister = () => {
  const [registerMutation, { loading, error }] = useMutation(REGISTER_USER)
  
  const register = async (email: string, password: string, role = 'USER') => {
    try {
      const result = await registerMutation({
        variables: { email, password, role }
      })
      
      const registerData = result.data as any
      if (registerData?.register?.token) {
        // Store token in localStorage
        localStorage.setItem('excel-pilot-token', registerData.register.token)
        return registerData.register
      }
      
      throw new Error('Registration failed - no token received')
    } catch (err) {
      console.error('Registration error:', err)
      throw err
    }
  }

  return { register, loading, error }
}

// Chat Message Hooks
export const useSendMessage = () => {
  const [sendMessageMutation, { loading, error }] = useMutation(SEND_CHAT_MESSAGE)
  
  const sendMessage = async (input: {
    content: string
    agentId: string
    role?: string
  }) => {
    try {
      const result = await sendMessageMutation({
        variables: { input },
        refetchQueries: [{ 
          query: GET_CHAT_MESSAGES, 
          variables: { agentId: input.agentId } 
        }]
      })
      
      const messageData = result.data as any
      return messageData?.sendChatMessage
    } catch (err) {
      console.error('Send message error:', err)
      throw err
    }
  }

  return { sendMessage, loading, error }
}

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

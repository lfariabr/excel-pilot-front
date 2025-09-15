// User Types
export interface User {
  id: string
  email: string
  role: 'ADMIN' | 'USER' | 'CONCIERGE' | 'MANAGER'
  createdAt: string
  updatedAt: string
}

export interface AuthResponse {
  token: string
  user: User
}

// Agent Types
export interface Agent {
  id: string
  name: string
  description?: string
  systemPrompt?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  user: User
}

export interface CreateAgentInput {
  name: string
  description?: string
  systemPrompt?: string
  isActive?: boolean
}

export interface UpdateAgentInput {
  name?: string
  description?: string
  systemPrompt?: string
  isActive?: boolean
}

// Chat Message Types
export interface ChatMessage {
  id: string
  content: string
  role: 'USER' | 'ASSISTANT' | 'SYSTEM'
  createdAt: string
  agent: Agent
  user: User
}

export interface SendChatMessageInput {
  content: string
  agentId: string
  role?: 'USER' | 'ASSISTANT' | 'SYSTEM'
}

// Response Types (OpenAI Integration)
export interface Response {
  id: string
  title?: string
  summary?: string
  content: string
  tokensUsed: number
  createdAt: string
  user: User
}

export interface CreateResponseInput {
  title?: string
  summary?: string
  content: string
  tokensUsed?: number
}

// Pagination Types
export interface PageInfo {
  hasNextPage: boolean
  hasPreviousPage: boolean
  startCursor?: string
  endCursor?: string
}

export interface Edge<T> {
  node: T
  cursor: string
}

export interface Connection<T> {
  edges: Edge<T>[]
  pageInfo: PageInfo
}

// Query Variables Types
export interface PaginationVariables {
  limit?: number
  offset?: number
}

export interface CursorPaginationVariables {
  limit?: number
  cursor?: string
}

// Mutation Response Types
export interface MutationResponse {
  success: boolean
  message: string
}

// Error Types
export interface GraphQLError {
  message: string
  locations?: Array<{
    line: number
    column: number
  }>
  path?: string[]
  extensions?: {
    code?: string
    [key: string]: any
  }
}

// Apollo Client Types
export interface ApolloError {
  graphQLErrors: GraphQLError[]
  networkError?: Error | null
  message: string
}

// Hook Return Types
export interface QueryResult<T> {
  data?: T
  loading: boolean
  error?: ApolloError
  refetch: () => void
}

export interface MutationResult<T> {
  data?: T
  loading: boolean
  error?: ApolloError
}

// Component Props Types
export interface UserListProps {
  users: User[]
  loading: boolean
  error?: ApolloError
}

export interface AgentListProps {
  agents: Agent[]
  loading: boolean
  error?: ApolloError
  onCreateAgent: (input: CreateAgentInput) => Promise<void>
  onUpdateAgent: (id: string, input: UpdateAgentInput) => Promise<void>
  onDeleteAgent: (id: string) => Promise<void>
}

export interface ChatProps {
  agentId: string
  messages: ChatMessage[]
  loading: boolean
  error?: ApolloError
  onSendMessage: (content: string) => Promise<void>
}

// Form Types
export interface LoginFormData {
  email: string
  password: string
}

export interface RegisterFormData {
  email: string
  password: string
  confirmPassword: string
  role?: string
}

export interface AgentFormData {
  name: string
  description: string
  systemPrompt: string
  isActive: boolean
}

// Environment Variables
export interface EnvironmentConfig {
  NEXT_PUBLIC_GRAPHQL_ENDPOINT: string
  NEXT_PUBLIC_APP_ENV: 'development' | 'staging' | 'production'
}

// Apollo Client Configuration
export interface ApolloClientConfig {
  uri: string
  headers?: Record<string, string>
  credentials?: 'include' | 'omit' | 'same-origin'
}

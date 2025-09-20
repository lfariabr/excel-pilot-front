'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loading } from '@/components/ui/loading'
import { 
//   useAgents, 
//   useCreateAgent,
  useConnectionStatus, 
  useApolloUtils 
} from '@/lib/utils/useGraphQL'
import { 
  Database, 
  Users, 
  RefreshCw, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  Wifi, 
  WifiOff,
  MessageSquare
} from 'lucide-react'

// Users
import { useUsers } from '@/lib/hooks/users/useUsers'

// Messages
import { useMessages } from '@/lib/hooks/message/useMessages'
import { Message } from '@/lib/graphql/types/messageTypes'

// Conversations
import { useConversations } from '@/lib/hooks/conversation/useConversations'
import type { Conversation } from '@/lib/graphql/types/conversationTypes'

export function GraphQLDemo() {
  
  // Connection status
  const { isConnected, connectionError } = useConnectionStatus()
  
  // Data queries with type assertions
  const { data: usersData, loading: usersLoading, error: usersError, refetch: refetchUsers } = useUsers()
  const { data: messagesData, loading: messagesLoading, error: messagesError, refetch: refetchMessages } = useMessages({ 
    conversationId: "68bf5caac27ae372eb51be0b" // Valid ObjectId format
  })
  const { data: conversationsData, loading: conversationsLoading, error: conversationsError, refetch: refetchConversations } = useConversations()
  
  // Type assertions for GraphQL data
  const users = (usersData as any)?.users || []
  const messages = (messagesData as any)?.messages?.edges?.map((edge: any) => edge.node) || []
  const conversations = (conversationsData as any)?.conversations || []
  
  // Apollo utilities
  const { clearCache } = useApolloUtils()

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            GraphQL Connection Status
          </CardTitle>
          <CardDescription>
            Real-time connection to ExcelPilot backend
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            {isConnected ? (
              <>
                <Wifi className="h-5 w-5 text-green-600" />
                <Badge variant="success">Connected</Badge>
                <span className="text-sm text-muted-foreground">
                  Backend: {process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'http://localhost:4000/graphql'}
                </span>
              </>
            ) : (
              <>
                <WifiOff className="h-5 w-5 text-red-600" />
                <Badge variant="destructive">Disconnected</Badge>
                {connectionError && (
                  <span className="text-sm text-red-600">
                    {connectionError.message}
                  </span>
                )}
              </>
            )}
          </div>
          
          <div className="mt-4 flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                refetchUsers()
                // refetchAgents()
              }}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Data
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={clearCache}
            >
              Clear Cache
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Users Query Demo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Users Query Demo
          </CardTitle>
          <CardDescription>
            Fetching users from GraphQL backend
          </CardDescription>
        </CardHeader>
        <CardContent>
          {usersLoading ? (
            <div className="flex items-center gap-2">
              <Loading variant="spinner" size="sm" />
              <span className="text-sm text-muted-foreground">Loading users...</span>
            </div>
          ) : usersError ? (
            <div className="text-sm text-red-600">
              Error: {usersError.message}
            </div>
          ) : users.length > 0 ? (
            <div className="space-y-2">
              {users.map((user: any) => (
                <div key={user.id} className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <span className="font-medium">{user.email}</span>
                    <Badge variant="outline" className="ml-2">
                      {user.role}
                    </Badge>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">
              No users found or backend not connected
            </div>
          )}
        </CardContent>
      </Card>

      {/* Messages Query Demo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Messages Query Demo
          </CardTitle>
          <CardDescription>
            Fetching messages from GraphQL backend
          </CardDescription>
        </CardHeader>
        <CardContent>
          {messagesLoading ? (
            <div className="flex items-center gap-2">
              <Loading variant="spinner" size="sm" />
              <span className="text-sm text-muted-foreground">Loading messages...</span>
            </div>
          ) : messagesError ? (
            <div className="text-sm text-red-600">
              Error: {messagesError.message}
            </div>
          ) : messages.length > 0 ? (
            <div className="space-y-2">
              {messages.map((message: any) => (
                <div key={message.id} className="flex items-center justify-between p-2 border rounded">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{message.content}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      ID: {message.id}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">
                      Created: {new Date(message.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">
                No messages found for conversation "507f1f77bcf86cd799439011"
              </div>
              <div className="text-xs text-muted-foreground">
                This could mean the backend is not connected, the conversation doesn't exist, or there are no messages yet.
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Conversations Query Demo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Conversations Query Demo
          </CardTitle>
          <CardDescription>
            Fetching conversations from GraphQL backend
          </CardDescription>
        </CardHeader>
        <CardContent>
          {conversationsLoading ? (
            <div className="flex items-center gap-2">
              <Loading variant="spinner" size="sm" />
              <span className="text-sm text-muted-foreground">Loading conversations...</span>
            </div>
          ) : conversationsError ? (
            <div className="space-y-2">
              <div className="text-sm text-red-600">
                Error: {conversationsError.message}
              </div>
              <div className="text-xs text-muted-foreground">
                {conversationsError.message.includes('sub') || conversationsError.message.includes('UNAUTHENTICATED') ? (
                  <>This endpoint requires authentication. Please log in or disable authentication on the backend for testing.</>
                ) : (
                  <>This is expected if the backend is not running or doesn't have conversation endpoints configured.</>
                )}
              </div>
            </div>
          ) : conversations.length > 0 ? (
            <div className="space-y-2">
              {conversations.map((conversation: any) => (
                <div key={conversation.id} className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <div className="font-medium text-sm">{conversation.title}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      ID: {conversation.id}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">
                      Created: {new Date(conversation.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">
                No conversations found
              </div>
              <div className="text-xs text-muted-foreground">
                This could mean the backend is not connected or there are no conversations yet.
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* GraphQL Features */}
      <Card>
        <CardHeader>
          <CardTitle>GraphQL Features Implemented</CardTitle>
          <CardDescription>
            v0.0.3 Apollo Client integration complete
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">✅ Completed Features</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Apollo Client configuration</li>
                <li>• Authentication link (JWT ready)</li>
                <li>• Error handling & retry logic</li>
                <li>• Custom hooks for queries/mutations</li>
                <li>• TypeScript type definitions</li>
                <li>• Connection status monitoring</li>
                <li>• Cache management</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">🔄 Available Operations</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• User management (CRUD)</li>
                <li>• Agent management (CRUD)</li>
                <li>• Chat messages (send/receive)</li>
                <li>• Authentication (login/register)</li>
                <li>• OpenAI responses</li>
                <li>• Pagination support</li>
                <li>• Real-time polling</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

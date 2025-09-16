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
} from '@/lib/hooks/useGraphQL'
import { Wifi, WifiOff, Users, Bot, Plus, RefreshCw, Database } from 'lucide-react'

// Users
import { useUsers } from '@/lib/hooks/useUsers'

export function GraphQLDemo() {
  
  // Connection status
  const { isConnected, connectionError } = useConnectionStatus()
  
  // Data queries with type assertions
  const { data: usersData, loading: usersLoading, error: usersError, refetch: refetchUsers } = useUsers()
  
  // Type assertions for GraphQL data
  const users = (usersData as any)?.users || []
  
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

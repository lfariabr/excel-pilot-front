import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Loading, SkeletonCard } from "@/components/ui/loading"
import { Badge } from "@/components/ui/badge"
import { BarChart3, Users, Clock, TrendingUp, Search, Plus } from "lucide-react"
import { UI_DOCS } from "@/components/ui/uiDocs"
import Chat from "@/app/chat/page"
import { GraphQLDemo } from "@/components/demo/GraphQLDemo"
import Task from "./task/page"


export default function Home() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="space-y-8">
        {/* Header */}
        {/* <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome to ExcelPilot v0.0.5
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </div> */}

        {/* AI Assistant */}
        <Chat />
        
      </div>
    </main>
  )
}

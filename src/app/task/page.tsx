"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"

// {/* Recent Tasks */}

export default function Task() {
return (
<Card>
<CardHeader>
  <CardTitle>Recent Tasks</CardTitle>
  <CardDescription>
    Latest concierge tasks and their status
  </CardDescription>
</CardHeader>
<CardContent className="space-y-4">
  <div className="flex items-center justify-between p-3 border rounded-lg">
    <div className="space-y-1">
      <p className="text-sm font-medium">Customer inquiry - Room booking</p>
      <p className="text-xs text-muted-foreground">2 minutes ago</p>
    </div>
    <Badge variant="success">Completed</Badge>
  </div>
  
  <div className="flex items-center justify-between p-3 border rounded-lg">
    <div className="space-y-1">
      <p className="text-sm font-medium">Event planning assistance</p>
      <p className="text-xs text-muted-foreground">15 minutes ago</p>
    </div>
    <Badge variant="warning">In Progress</Badge>
  </div>
  
  <div className="flex items-center justify-between p-3 border rounded-lg">
    <div className="space-y-1">
      <p className="text-sm font-medium">Restaurant recommendation</p>
      <p className="text-xs text-muted-foreground">1 hour ago</p>
    </div>
    <Badge>Pending</Badge>
  </div>
</CardContent>
</Card> 
)
}

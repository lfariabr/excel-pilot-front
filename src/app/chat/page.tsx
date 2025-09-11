"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import React, { useState } from "react";

export default function Chat() {
  const [prompt, setPrompt] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!prompt.trim()) return;

    console.log("User asked:", prompt)
    // TODO: Integrate later (Apollo). For now it just clears...
    setPrompt("");
  }

  return (
    <div className="space-y-8">
      {/* AI Assistant */}
        <Card>
          <CardHeader>
            <CardTitle>Concierge's Assistant</CardTitle>
            <CardDescription>
              Quick actions and intelligent suggestions
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <form onSubmit={onSubmit} className="space-y-2">
              <div className="grid gap-1">
                <Label htmlFor="ask-ai" className="sr-only">
                  How can I assist you?
                </Label>
                <Input 
                  id="ask-ai"
                  placeholder="How can I assist you?" 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
                <div className="flex gap-2">
                  <Button type="submit" variant="outline" size="sm">
                    Start New Chat
                  </Button>
                  <Button type="button" variant="outline" size="sm">
                    See Previous Chats
                  </Button>
                  <Button type="button" variant="outline" size="sm">
                    FAQ
                  </Button>
                </div>
              </div>
            </form>
            
            <div className="border-t pt-4">
              <h4 className="text-sm font-medium mb-2">Quick Suggestions</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• How does the lift reservation policy works?</p>
                <p>• What are the rules for visitor's car park?</p>
                <p>• What are the useful building contacts?</p>
                <p>• Who are the Committee Members?</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
  )
}

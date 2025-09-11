"use client"
import React, { useState } from "react";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { ChatMessages } from "@/components/chat/ChatMessages";
import { ChatInput } from "@/components/chat/ChatInput";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export default function Chat() {
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: '1',
      title: 'Loading Dock Help',
      messages: [
        {
          id: '1',
          content: 'What are the specs of the loading dock?',
          role: 'user',
          timestamp: new Date('2024-01-15T10:30:00')
        },
        {
          id: '2',
          content: 'The loading dock has a height of 3,5m and a width of 2,5m. It is possible to book it for moving in/out of the building.:\n\nHere\'s a step-by-step guide:\n1. Go to Building Link tab Reservations\n2. Click on New Reservation\n3. Fill in the form with the following information:\n4. Wait for Building Management confirmation\n\nYou can always contact the Concierge for more information. 😄',
          role: 'assistant',
          timestamp: new Date('2024-01-15T10:30:15')
        }
      ],
      createdAt: new Date('2024-01-15T10:30:00'),
      updatedAt: new Date('2024-01-15T10:30:15')
    }
  ]);
  
  const [currentConversationId, setCurrentConversationId] = useState<string>('1');
  const [prompt, setPrompt] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const currentConversation = conversations.find(c => c.id === currentConversationId);

  const handleNewChat = () => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setConversations(prev => [newConversation, ...prev]);
    setCurrentConversationId(newConversation.id);
    setIsSidebarOpen(false); // Close sidebar on mobile after creating new chat
  };

  const handleSendMessage = (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: content.trim(),
      role: 'user',
      timestamp: new Date()
    };

    // Update conversation with user message
    setConversations(prev => prev.map(conv => {
      if (conv.id === currentConversationId) {
        const updatedMessages = [...conv.messages, userMessage];
        return {
          ...conv,
          messages: updatedMessages,
          title: conv.messages.length === 0 ? content.slice(0, 50) + (content.length > 50 ? '...' : '') : conv.title,
          updatedAt: new Date()
        };
      }
      return conv;
    }));

    // Simulate AI response (replace with actual API call later)
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `I understand you're asking about: "${content}". This is a simulated response. In the future, this will connect to your Excel AI assistant.`,
        role: 'assistant',
        timestamp: new Date()
      };

      setConversations(prev => prev.map(conv => {
        if (conv.id === currentConversationId) {
          return {
            ...conv,
            messages: [...conv.messages, assistantMessage],
            updatedAt: new Date()
          };
        }
        return conv;
      }));
    }, 1000);

    setPrompt("");
  };

  const handleSelectConversation = (conversationId: string) => {
    setCurrentConversationId(conversationId);
    setIsSidebarOpen(false); // Close sidebar on mobile after selecting conversation
  };

  const handleDeleteConversation = (conversationId: string) => {
    setConversations(prev => prev.filter(c => c.id !== conversationId));
    
    // If we deleted the current conversation, select the first available one
    if (conversationId === currentConversationId) {
      const remaining = conversations.filter(c => c.id !== conversationId);
      if (remaining.length > 0) {
        setCurrentConversationId(remaining[0].id);
      } else {
        handleNewChat();
      }
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 relative">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:relative inset-y-0 left-0 z-50 lg:z-auto
        transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0 transition-transform duration-300 ease-in-out
      `}>
        <ChatSidebar
          conversations={conversations}
          currentConversationId={currentConversationId}
          onNewChat={handleNewChat}
          onSelectConversation={handleSelectConversation}
          onDeleteConversation={handleDeleteConversation}
        />
      </div>
      
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Chat Header */}
        <div className="border-b bg-white dark:bg-gray-800 px-4 lg:px-6 py-4 flex items-center gap-3">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </Button>
          
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
              {currentConversation?.title || 'Excel Pilot Assistant'}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Your AI-powered Concierge Assistant
            </p>
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-hidden">
          <ChatMessages 
            messages={currentConversation?.messages || []}
            isLoading={false}
          />
        </div>

        {/* Chat Input */}
        <ChatInput
          value={prompt}
          onChange={setPrompt}
          onSend={handleSendMessage}
          disabled={false}
        />
      </div>
    </div>
  );
}

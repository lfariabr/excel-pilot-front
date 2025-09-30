"use client"
import React, { useState } from "react";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { ChatMessages } from "@/components/chat/ChatMessages";
import { ChatInput } from "@/components/chat/ChatInput";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useChat } from "@/lib/hooks/chat";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Chat() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  // All hooks MUST come before any conditional returns
  const [prompt, setPrompt] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const {
    conversations,
    messages,
    currentConversationId,
    isLoading,
    isSendingMessage,
    isStartingConversation,
    error,
    createNewConversation,
    sendChatMessage,
    switchConversation,
    startNewChatWithMessage,
    refetchConversations,
  } = useChat();

  const currentConversation = conversations.find(c => c.id === currentConversationId);

  // NOW you can do conditional checks and early returns
  // Check authentication status
  if (status === 'loading') {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }

  const handleNewChat = async () => {
    try {
      await createNewConversation("New Chat");
      setIsSidebarOpen(false);
    } catch (error) {
      console.error('Failed to create new chat:', error);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    try {
      if (currentConversationId) {
        await sendChatMessage(content.trim());
      } else {
        await startNewChatWithMessage(content.trim());
      }
      setPrompt("");
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleSelectConversation = (conversationId: string) => {
    switchConversation(conversationId);
    setIsSidebarOpen(false);
  };

  const handleDeleteConversation = async (conversationId: string) => {
    // TODO: Implement delete conversation mutation
    if (conversationId === currentConversationId && conversations.length > 1) {
      const otherConversation = conversations.find(c => c.id !== conversationId);
      if (otherConversation) {
        switchConversation(otherConversation.id);
      }
    }
  };

  // Show loading state
  if (isLoading && conversations.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading conversations...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading chat: {error.message}</p>
          <Button onClick={() => refetchConversations()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

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
          isCreatingChat={isStartingConversation}
        />
      </div>
      
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-0">
        {/* Chat Header */}
        <div className="border-b bg-white dark:bg-gray-800 px-4 lg:px-6 py-4 flex items-center gap-3 flex-shrink-0">
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

          {/* Connection Status */}
          {error && (
            <div className="text-red-500 text-sm">
              Connection Error
            </div>
          )}
        </div>

        {/* Messages Container */}
        <div className="flex-1 min-h-0 overflow-hidden">
          {currentConversationId ? (
            <ChatMessages 
              messages={messages}
              isLoading={isLoading}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center max-w-md">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Welcome to Excel Pilot
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Start a new conversation or select an existing one from the sidebar to begin chatting with your AI assistant.
                </p>
                <Button onClick={handleNewChat} disabled={isStartingConversation}>
                  {isStartingConversation ? 'Creating...' : 'Start New Chat'}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Chat Input */}
        <div className="flex-shrink-0">
          <ChatInput
            value={prompt}
            onChange={setPrompt}
            onSend={handleSendMessage}
            disabled={isSendingMessage || isStartingConversation}
            placeholder={
              currentConversationId 
                ? "Type your message..." 
                : "Start a new conversation..."
            }
          />
        </div>
      </div>
    </div>
  );
}

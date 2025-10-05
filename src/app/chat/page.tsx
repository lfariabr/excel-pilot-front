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
import { stripMarkdown } from '@/lib/utils/chatUtils';

export default function Chat() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [prompt, setPrompt] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  
  const {
    conversations,
    messages,
    currentConversationId,
    isLoading,
    isSendingMessage,
    isStartingConversation,
    isAssistantTyping,
    isRateLimited,
    rateLimitSecondsLeft,
    isTokenLimited,
    tokenLimitSecondsLeft,
    tokenRemaining,
    error,
    createNewConversation,
    sendChatMessage,
    switchConversation,
    startNewChatWithMessage,
    refetchConversations,
    applyRateLimit,
  } = useChat();

  const currentConversation = conversations.find(c => c.id === currentConversationId);

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
    } catch (error: any) {
      const msg = typeof error?.message === 'string' ? error.message : '';
      const isRateMsg = /rate limit/i.test(msg) || isRateLimited;

      if (isRateMsg) {
        let secs = rateLimitSecondsLeft || 0;
        try {
          const gqlErrors = error?.graphQLErrors || error?.clientErrors || [];
          for (const ge of gqlErrors) {
            const code = ge?.extensions?.code;
            if (code && /RATE_LIMITED|TOKEN_BUDGET_EXCEEDED/i.test(code)) {
              let reset = ge?.extensions?.resetTime as any;
              if (typeof reset === 'number' && Number.isFinite(reset)) {
                if (reset < 1e12) reset = reset * 1000;
                const ms = reset - Date.now();
                secs = Math.max(1, Math.ceil(ms / 1000));
                break;
              }
            }
          }
          if (!secs || secs < 1) {
            const m = msg.match(/try again in\s+(\d+)\s*seconds?/i);
            if (m) secs = parseInt(m[1], 10);
          }
        } catch {}
        if (!secs || secs < 1) secs = 1;
        applyRateLimit(secs);
      }

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

  // Show error state (ignore rate-limit and token-limit which we handle inline, and avoid initial flash)
  const isRateLimitMessage = !!error?.message && /rate limit/i.test(error.message);
  const isTokenLimitMessage = !!error?.message && /token budget|token limit|daily token/i.test(error.message);
  const isUnauthError = !!error?.message && /unauth/i.test(error.message);
  if (error && !isRateLimited && !isTokenLimited && !isRateLimitMessage && !isTokenLimitMessage) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading chat: {error.message}</p>
          <Button onClick={() => isUnauthError ? router.push('/login') : refetchConversations()}>
            {isUnauthError ? 'Try again' : 'Retry'}
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
              {stripMarkdown(currentConversation?.title || 'Excel Pilot Assistant')}
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
              isLoading={isAssistantTyping}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center max-w-md">
                <div className="mb-4 flex items-center justify-center">
                  <img src="/Atlas.png" alt="Atlas" className="w-48 h-48"/>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Hi, my name is <span className="text-blue-600"> Atlas</span>!
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  I will be happy to assist you. You can start a new conversation or select an existing one from the sidebar.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Near-input rate-limit notice */}
        {isRateLimited && (
          <div className="px-4 lg:px-6 py-2 bg-amber-50 text-amber-700 border-b border-amber-200 text-sm">
            Rate limit exceeded. Try again in {rateLimitSecondsLeft}s.
          </div>
        )}
        {isTokenLimited && (
          <div className="px-4 lg:px-6 py-2 bg-rose-50 text-rose-700 border-b border-rose-200 text-sm">
            Daily token budget exceeded{typeof tokenRemaining === 'number' ? ` · Remaining: ${tokenRemaining} tokens` : ''}. Resets in {Math.max(1, Math.ceil(tokenLimitSecondsLeft/3600))}h.
          </div>
        )}

        {/* Inline transient notice above input */}
        {notice && (
          <div className="px-4 lg:px-6 py-2 text-xs text-amber-800 bg-amber-50 border-t border-amber-200">
            {notice}
          </div>
        )}

        {/* Chat Input */}
        <div className="flex-shrink-0">
          <ChatInput
            value={prompt}
            onChange={setPrompt}
            onSend={handleSendMessage}
            disabled={Boolean(isSendingMessage || isStartingConversation || isRateLimited)}
            placeholder={
              currentConversationId 
                ? "Type your message..." 
                : "Start new conversation..."
            }
            cooldownSeconds={rateLimitSecondsLeft}
          />
        </div>
      </div>
    </div>
  );
}

import React, { useEffect, useRef } from 'react';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Bot, 
  User, 
  Copy, 
  ThumbsUp, 
  ThumbsDown,
  MoreHorizontal 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Message } from '@/app/chat/page';

interface ChatMessagesProps {
  messages: Message[];
  isLoading?: boolean;
}

export function ChatMessages({ messages, isLoading = false }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (messages.length === 0 && !isLoading) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bot className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Welcome to Excel Pilot
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Your AI-powered Concierge assistant is ready to help. Ask me anything about the building, 
            regulations or contacts.
          </p>
          <div className="space-y-2 text-sm">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-left">
              <p className="font-medium text-gray-900 dark:text-white mb-1">Try asking:</p>
              <ul className="text-gray-600 dark:text-gray-300 space-y-1">
                <li>• "How does the lift reservation policy works?"</li>
                <li>• "What are the rules for visitor's car park?"</li>
                <li>• "What are the useful building contacts?"</li>
                <li>• "Who are the Committee Members?"</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        
        {isLoading && (
          <div className="flex items-start gap-4">
            <Avatar className="w-8 h-8 flex-shrink-0">
              <div className="w-full h-full bg-blue-600 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
            </Avatar>
            <div className="flex-1">
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}

interface MessageBubbleProps {
  message: Message;
}

function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const [showActions, setShowActions] = React.useState(false);

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // TODO: Add toast notification
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div 
      className={`flex items-start gap-4 group ${isUser ? 'flex-row-reverse' : ''}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Avatar */}
      <Avatar className="w-8 h-8 flex-shrink-0">
        <div className={`w-full h-full flex items-center justify-center ${
          isUser 
            ? 'bg-gray-600' 
            : 'bg-blue-600'
        }`}>
          {isUser ? (
            <User className="w-4 h-4 text-white" />
          ) : (
            <Bot className="w-4 h-4 text-white" />
          )}
        </div>
      </Avatar>

      {/* Message Content */}
      <div className={`flex-1 max-w-3xl ${isUser ? 'text-right' : ''}`}>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {isUser ? 'You' : 'Excel Pilot'}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {formatTime(message.timestamp)}
          </span>
          {!isUser && (
            <Badge variant="secondary" className="text-xs">
              AI
            </Badge>
          )}
        </div>
        
        <div className={`rounded-lg p-4 ${
          isUser 
            ? 'bg-blue-600 text-white ml-12' 
            : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white mr-12'
        }`}>
          <div className="whitespace-pre-wrap text-sm leading-relaxed">
            {message.content}
          </div>
        </div>

        {/* Message Actions */}
        {showActions && !isUser && (
          <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-gray-500 hover:text-gray-700"
              onClick={() => copyToClipboard(message.content)}
            >
              <Copy className="w-3 h-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-gray-500 hover:text-green-600"
            >
              <ThumbsUp className="w-3 h-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-gray-500 hover:text-red-600"
            >
              <ThumbsDown className="w-3 h-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-gray-500 hover:text-gray-700"
            >
              <MoreHorizontal className="w-3 h-3" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

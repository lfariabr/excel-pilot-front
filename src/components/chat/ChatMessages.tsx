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
import { Message } from '@/lib/graphql/types/messageTypes';

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
    // Small delay to ensure DOM is updated before scrolling
    const timer = setTimeout(() => {
      scrollToBottom();
    }, 100);
    
    return () => clearTimeout(timer);
  }, [messages]);

  if (messages.length === 0 && !isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <Bot className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Ready to help!
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Ask me anything about Excel, building management, or general questions. I'm here to assist you!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-4 space-y-4">
      {messages.map((message, index) => (
        <MessageBubble 
          key={message.id || index} 
          message={message}
        />
      ))}
      
      {isLoading && (
        <div className="flex justify-start">
          <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-3 max-w-xs">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-300">AI is thinking...</span>
          </div>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
}

interface MessageBubbleProps {
  message: Message;
}

function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const [showActions, setShowActions] = React.useState(false);

  const formatTime = (timestampString: string) => {
    // Handle different date formats
    const timestamp = new Date(timestampString);
    
    // Check if date is valid
    if (isNaN(timestamp.getTime())) {
        return 'Now'; // Fallback for invalid dates
    }
    
    return timestamp.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
};

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div 
      className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {!isUser && (
        <Avatar className="w-8 h-8 flex-shrink-0">
          <div className="w-full h-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
            <Bot className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
        </Avatar>
      )}
      
      <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[70%]`}>
        <div
          className={`rounded-lg p-3 ${
            isUser
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
          }`}
        >
          <div className="text-sm whitespace-pre-wrap break-words">
            {message.content}
          </div>
        </div>
        
        <div className={`flex items-center gap-2 mt-1 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {formatTime(message.createdAt)}
          </span>
          
          {showActions && !isUser && (
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                onClick={() => copyToClipboard(message.content)}
              >
                <Copy className="w-3 h-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
              >
                <ThumbsUp className="w-3 h-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
              >
                <ThumbsDown className="w-3 h-3" />
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {isUser && (
        <Avatar className="w-8 h-8 flex-shrink-0">
          <div className="w-full h-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
            <User className="w-4 h-4 text-green-600 dark:text-green-400" />
          </div>
        </Avatar>
      )}
    </div>
  );
}

// /src/components/chat/TypingIndicator.tsx
import React from 'react';
import { Avatar } from '@/components/ui/avatar';
import { Bot } from 'lucide-react';

export function TypingIndicator() {
    return (
      <div className="flex gap-3 justify-start">
        <Avatar className="w-8 h-8 flex-shrink-0">
          <div className="w-full h-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
            <Bot className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
        </Avatar>
        
        <div className="flex flex-col items-start max-w-[70%]">
          <div className="rounded-lg p-3 bg-gray-100 dark:bg-gray-700">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" />
              <div 
                className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" 
                style={{ animationDelay: '0.2s' }} 
              />
              <div 
                className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" 
                style={{ animationDelay: '0.4s' }} 
              />
            </div>
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Atlas is typing...
          </span>
        </div>
      </div>
    );
  }
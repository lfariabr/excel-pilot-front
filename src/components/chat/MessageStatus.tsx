// /src/components/chat/MessageStatus.tsx
import React from 'react';
import { Check, CheckCheck, Clock, AlertCircle } from 'lucide-react';
import { MessageStatus as Status } from '@/lib/graphql/types/messageTypes';

interface MessageStatusProps {
  status?: Status;
  timestamp: string;
}

export function MessageStatus({ status = 'sent', timestamp }: MessageStatusProps) {
  const formatTime = (timestampString: string) => {
    const timestamp = new Date(timestampString);
    if (isNaN(timestamp.getTime())) return 'Now';
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'sending':
        return <Clock className="w-3 h-3 text-gray-400 animate-pulse" />;
      case 'sent':
        return <Check className="w-3 h-3 text-gray-400" />;
      case 'delivered':
        return <CheckCheck className="w-3 h-3 text-blue-500" />;
      case 'error':
        return <AlertCircle className="w-3 h-3 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center gap-1">
      <span className="text-xs text-gray-500 dark:text-gray-400">
        {formatTime(timestamp)}
      </span>
      {getStatusIcon()}
    </div>
  );
}
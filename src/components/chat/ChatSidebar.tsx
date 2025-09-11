import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  MessageSquare, 
  MoreHorizontal, 
  Trash2, 
  Edit3,
  User,
  Settings,
  LogOut
} from 'lucide-react';
import { Conversation } from '@/app/chat/page';

interface ChatSidebarProps {
  conversations: Conversation[];
  currentConversationId: string;
  onNewChat: () => void;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
}

export function ChatSidebar({
  conversations,
  currentConversationId,
  onNewChat,
  onSelectConversation,
  onDeleteConversation
}: ChatSidebarProps) {
  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  const groupConversationsByDate = (conversations: Conversation[]) => {
    const groups: { [key: string]: Conversation[] } = {};
    
    conversations.forEach(conv => {
      const dateKey = formatDate(conv.updatedAt);
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(conv);
    });
    
    return groups;
  };

  const conversationGroups = groupConversationsByDate(conversations);

  return (
    <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col h-full">
      {/* Header with New Chat Button */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <Button 
          onClick={onNewChat}
          className="w-full justify-start gap-2 bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="w-4 h-4" />
          New Chat
        </Button>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {Object.entries(conversationGroups).map(([dateGroup, groupConversations]) => (
          <div key={dateGroup} className="p-2">
            <div className="px-2 py-1 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {dateGroup}
            </div>
            <div className="space-y-1">
              {groupConversations.map((conversation) => (
                <ConversationItem
                  key={conversation.id}
                  conversation={conversation}
                  isActive={conversation.id === currentConversationId}
                  onSelect={() => onSelectConversation(conversation.id)}
                  onDelete={() => onDeleteConversation(conversation.id)}
                />
              ))}
            </div>
          </div>
        ))}
        
        {conversations.length === 0 && (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No conversations yet</p>
            <p className="text-xs">Start a new chat to begin</p>
          </div>
        )}
      </div>

      {/* User Profile Section */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <Avatar className="w-8 h-8">
            <div className="w-full h-full bg-blue-600 flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              Excel User
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Free Plan
            </p>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
              <Settings className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
  onSelect: () => void;
  onDelete: () => void;
}

function ConversationItem({ conversation, isActive, onSelect, onDelete }: ConversationItemProps) {
  const [showActions, setShowActions] = React.useState(false);

  return (
    <div
      className={`group relative rounded-lg p-3 cursor-pointer transition-colors ${
        isActive 
          ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800' 
          : 'hover:bg-gray-50 dark:hover:bg-gray-700'
      }`}
      onClick={onSelect}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className={`text-sm font-medium truncate ${
            isActive ? 'text-blue-900 dark:text-blue-100' : 'text-gray-900 dark:text-white'
          }`}>
            {conversation.title}
          </h3>
          {conversation.messages.length > 0 && (
            <p className={`text-xs mt-1 truncate ${
              isActive ? 'text-blue-700 dark:text-blue-300' : 'text-gray-500 dark:text-gray-400'
            }`}>
              {conversation.messages[conversation.messages.length - 1].content}
            </p>
          )}
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="secondary" className="text-xs">
              {conversation.messages.length} messages
            </Badge>
          </div>
        </div>
        
        {showActions && (
          <div className="flex gap-1 ml-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-6 h-6 p-0 opacity-0 group-hover:opacity-100"
              onClick={(e) => {
                e.stopPropagation();
                // TODO: Implement edit functionality
              }}
            >
              <Edit3 className="w-3 h-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-6 h-6 p-0 opacity-0 group-hover:opacity-100 text-red-600 hover:text-red-700"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

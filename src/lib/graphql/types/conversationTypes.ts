// TypeScript interfaces for Conversation data
import { Message } from './messageTypes';

export interface Conversation {
    id: string;
    title: string;
    summary?: string;
    createdAt: string;
    updatedAt?: string;
    lastMessageAt?: string;
}

export interface ConversationsResponse {
    conversations: Conversation[];
}

export interface ConversationsData {
    conversations: Conversation[];
}

// Mutation Response Types - Backend returns AI Message, not Conversation
export interface StartConversationResponse {
    startConversation: Message;
}
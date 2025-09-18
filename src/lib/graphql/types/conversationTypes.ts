// TypeScript interfaces for Conversation data

export interface Conversation {
    id: string;
    title: string;
    summary?: string;
    createdAt: string;
    updatedAt: string;
    lastMessageAt?: string;
}

export interface ConversationsResponse {
    conversations: Conversation[];
}

export interface ConversationsData {
    conversations: Conversation[];
}
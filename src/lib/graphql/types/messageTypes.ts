// TypeScript interfaces for Message data

export interface Message {
    id: string;
    content: string;
    role?: 'user' | 'assistant' | 'system';
    createdAt: string;
    // conversationId?: string;
}

export interface MessageEdge {
    node: Message;
    cursor: string;
}

export interface PageInfo {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor?: string;
    endCursor?: string;
}

export interface MessageConnection {
    edges: MessageEdge[];
    pageInfo: PageInfo;
}

export interface MessagesResponse {
    messages: MessageConnection;
}

export interface MessagesData {
    messages: MessageConnection;
}

// Mutation Response Types
export interface SendMessageResponse {
    sendMessage: Message;
}
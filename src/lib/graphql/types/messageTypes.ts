// TypeScript interfaces for Message data

export interface Message {
    id: string;
    content: string;
    createdAt: string;
}

export interface MessageEdge {
    node: Message;
}

export interface MessageConnection {
    edges: MessageEdge[];
}

export interface MessagesResponse {
    messages: MessageConnection;
}

export interface MessagesData {
    messages: MessageConnection;
}
import { useQuery } from "@apollo/client/react";
import { GET_MESSAGES } from "../graphql/message/queries";
import { MessagesData } from "../graphql/types/messageTypes";

interface UseMessagesOptions {
    conversationId?: string;
}

export const useMessages = (options: UseMessagesOptions = {}) => {
    const { conversationId } = options;
    
    return useQuery(GET_MESSAGES, {
        variables: { conversationId: conversationId || "507f1f77bcf86cd799439011" }, // Valid ObjectId format
        skip: !conversationId, // Skip query if no conversationId provided
        errorPolicy: "all"
    });
};
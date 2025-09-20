import { useQuery } from "@apollo/client/react";
import { GET_MESSAGES } from "../../graphql/message/queries";
import { MessagesData } from "../../graphql/types/messageTypes";

interface UseMessagesOptions {
    conversationId?: string;
}

export const useMessages = (options: UseMessagesOptions = {}) => {
    const { conversationId } = options;
    
    return useQuery(GET_MESSAGES, {
        variables: { conversationId: conversationId || "68bf5caac27ae372eb51be0b" }, // Valid ObjectId format
        skip: !conversationId, // Skip query if no conversationId provided
        errorPolicy: "all"
    });
};
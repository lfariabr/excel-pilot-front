import { useQuery } from "@apollo/client/react";
import { GET_CONVERSATIONS } from "../../graphql/conversation/queries";
import type { ConversationsData } from "../../graphql/types/conversationTypes";

export const useConversations = () => {
    return useQuery(GET_CONVERSATIONS, {
        errorPolicy: 'all' as const
    });
};
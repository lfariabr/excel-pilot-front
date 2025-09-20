import { useQuery } from "@apollo/client/react";
import { GET_CONVERSATIONS } from "../../graphql/conversation/queries";
import type { ConversationsResponse } from "../../graphql/types/conversationTypes";

export const useConversations = () => {
    const { data, loading, error, refetch } = useQuery<ConversationsResponse>(GET_CONVERSATIONS, {
        errorPolicy: 'all' as const
    });

    return {
        conversations: data?.conversations || [],
        loading,
        error,
        refetch
    };
};
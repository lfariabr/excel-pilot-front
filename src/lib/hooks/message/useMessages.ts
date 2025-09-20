import { useQuery } from "@apollo/client/react";
import { GET_MESSAGES } from "../../graphql/message/queries";
import { MessagesResponse } from "../../graphql/types/messageTypes";

interface UseMessagesOptions {
    first?: number;
    after?: string;
    before?: string;
    last?: number;
}

export const useMessages = (conversationId?: string, options: UseMessagesOptions = {}) => {
    const { first = 20, after, before, last } = options;
    
    const { data, loading, error, refetch, fetchMore } = useQuery<MessagesResponse>(GET_MESSAGES, {
        variables: { conversationId, first, after, before, last },
        skip: !conversationId, // Skip query if no conversationId provided
        errorPolicy: "all"
    });

    const loadMore = () => {
        if (data?.messages.pageInfo.hasNextPage) {
            return fetchMore({
                variables: {
                    after: data.messages.pageInfo.endCursor
                }
            });
        }
    };

    return {
        messages: data?.messages?.edges?.map(edge => edge.node) || [],
        connection: data?.messages,
        pageInfo: data?.messages?.pageInfo,
        loading,
        error,
        refetch,
        loadMore,
        hasMore: data?.messages?.pageInfo?.hasNextPage || false
    };
};
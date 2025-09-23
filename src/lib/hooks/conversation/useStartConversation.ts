import { useMutation, useApolloClient } from "@apollo/client/react";
import { CREATE_CONVERSATION } from "../../graphql/conversation/mutations";
import { GET_CONVERSATIONS } from "../../graphql/conversation/queries";
import { StartConversationResponse, Conversation } from "../../graphql/types/conversationTypes";

export const useStartConversation = () => {
    const client = useApolloClient();
    const [startConversationMutation, { loading, error }] = useMutation<StartConversationResponse>(CREATE_CONVERSATION);

    const startConversation = async (content: string): Promise<Conversation> => {
        try {
            const { data } = await startConversationMutation({
                variables: { content }
            });

            if (data?.startConversation) {
                // Wait a moment for backend to finish, then refetch conversations
                await new Promise(resolve => setTimeout(resolve, 500));
                
                // Refetch conversations to get the real conversation created by backend
                await client.refetchQueries({
                    include: [GET_CONVERSATIONS]
                });
                
                // Get the updated conversations from cache
                const conversationsResult = client.readQuery({
                    query: GET_CONVERSATIONS
                });
                
                const conversations = (conversationsResult as any)?.conversations || [];
                const latestConversation = conversations[0]; // Backend sorts by newest first
                
                if (latestConversation) {
                    return {
                        id: latestConversation.id,
                        title: latestConversation.title || content.slice(0, 50) + (content.length > 50 ? '...' : ''),
                        createdAt: latestConversation.createdAt,
                        lastMessageAt: latestConversation.lastMessageAt
                    };
                }
            }

            throw new Error('No conversation returned from server');
        } catch (err) {
            console.error('Start conversation error:', err);
            throw err;
        }
    };

    return {
        startConversation,
        loading,
        error
    };
};
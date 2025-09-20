import { useMutation, useApolloClient } from "@apollo/client/react";
import { CREATE_CONVERSATION } from "../../graphql/conversation/mutations";
import { GET_CONVERSATIONS } from "../../graphql/conversation/queries";
import { GET_MESSAGES } from "../../graphql/message/queries";
import { StartConversationResponse, Conversation } from "../../graphql/types/conversationTypes";
import { Message } from "../../graphql/types/messageTypes";

// Start Conversation hook
export const useStartConversation = () => {
    const client = useApolloClient();
    const [startConversationMutation, { loading, error }] = useMutation<StartConversationResponse>(CREATE_CONVERSATION);

    const startConversation = async (content: string): Promise<Conversation> => {
        try {
            const { data } = await startConversationMutation({
                variables: { content },
                // Update both conversations and messages cache
                update: (cache, { data }) => {
                    if (data?.startConversation) {
                        const aiMessage = data.startConversation;
                        
                        // Extract conversationId from the AI message
                        // Your backend should include conversationId in the response
                        const conversationId = aiMessage.id.split('-')[0] || aiMessage.id; // Fallback logic
                        
                        // Create synthetic Conversation object for cache
                        const newConversation: Conversation = {
                            id: conversationId,
                            title: content.slice(0, 50) + (content.length > 50 ? '...' : ''),
                            createdAt: aiMessage.createdAt,
                            lastMessageAt: aiMessage.createdAt
                        };

                        // Update conversations cache
                        const existingConversations = cache.readQuery({
                            query: GET_CONVERSATIONS
                        });

                        if (existingConversations) {
                            cache.writeQuery({
                                query: GET_CONVERSATIONS,
                                data: {
                                    conversations: [newConversation, ...(existingConversations as any).conversations]
                                }
                            });
                        }

                        // Create user message for cache (since backend doesn't return it)
                        const userMessage: Message = {
                            id: `user-${Date.now()}`,
                            content,
                            role: 'user',
                            createdAt: new Date().toISOString(),
                            conversationId
                        };

                        // Add both user and AI messages to messages cache
                        const userEdge = {
                            node: userMessage,
                            cursor: `user-cursor-${Date.now()}`,
                            __typename: 'MessageEdge'
                        };

                        const aiEdge = {
                            node: aiMessage,
                            cursor: `ai-cursor-${Date.now()}`,
                            __typename: 'MessageEdge'
                        };

                        // Initialize messages cache for this conversation
                        cache.writeQuery({
                            query: GET_MESSAGES,
                            variables: { conversationId, first: 20 },
                            data: {
                                messages: {
                                    edges: [userEdge, aiEdge],
                                    pageInfo: {
                                        hasNextPage: false,
                                        hasPreviousPage: false,
                                        startCursor: userEdge.cursor,
                                        endCursor: aiEdge.cursor,
                                        __typename: 'PageInfo'
                                    },
                                    __typename: 'MessageConnection'
                                }
                            }
                        });
                    }
                }
            });

            if (data?.startConversation) {
                const aiMessage = data.startConversation;
                const conversationId = aiMessage.id.split('-')[0] || aiMessage.id;
                
                // Return synthetic Conversation object
                return {
                    id: conversationId,
                    title: content.slice(0, 50) + (content.length > 50 ? '...' : ''),
                    createdAt: aiMessage.createdAt,
                    lastMessageAt: aiMessage.createdAt
                };
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

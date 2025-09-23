import { useState } from 'react';
import { useStartConversation } from '../conversation/useStartConversation';
import { useSendMessage } from '../message/useSendMessage';
import { useConversations } from '../conversation/useConversations';
import { useMessages } from '../message/useMessages';

// Combined chat hook for easy chat functionality
export const useChat = (conversationId?: string) => {
    const [currentConversationId, setCurrentConversationId] = useState<string | undefined>(conversationId);
    
    // Conversation hooks
    const { conversations, loading: conversationsLoading, error: conversationsError, refetch: refetchConversations } = useConversations();
    const { startConversation, loading: startingConversation, error: startConversationError } = useStartConversation();
    
    // Message hooks
    const { messages, loading: messagesLoading, error: messagesError, refetch: refetchMessages } = useMessages(currentConversationId);
    const { sendMessage, loading: sendingMessage, error: sendMessageError } = useSendMessage();

    // Start a new conversation
    const createNewConversation = async (title?: string, initialMessage?: string) => {
        try {
            setCurrentConversationId(undefined);
            return null;
        } catch (err) {
            console.error('Failed to create conversation:', err);
            throw err;
        }
    };

    // Send a message in the current conversation
    const sendChatMessage = async (content: string, role: 'user' | 'assistant' = 'user') => {
        if (!currentConversationId) {
            throw new Error('No conversation selected');
        }

        try {
            const newMessage = await sendMessage(currentConversationId, content);

            // refetch messages after a delay to get the updated messages
            setTimeout(() => {
                refetchMessages();
            }, 2000);
            
            return newMessage;
        } catch (err) {
            console.error('Failed to send message:', err);
            throw err;
        }
    };

    // Start a new conversation with a message
    const startNewChatWithMessage = async (message: string) => {
        try {
            // Create conversation with the message as content
            const conversation = await startConversation(message);
            
            if (conversation) {
                setCurrentConversationId(conversation.id);

                // refetch conversation after a delay to get the updated title
                setTimeout(async () => {
                    console.log('Refetching conversations for title update...');
                    // Force a network-only refetch to bypass cache
                    const result = await refetchConversations({ 
                        fetchPolicy: 'network-only' 
                    });
                    console.log('After refetch - conversations:', result.data?.conversations);
                }, 2000);

                return conversation;
            }
        } catch (err) {
            console.error('Failed to start new chat:', err);
            throw err;
        }
    };

    // Switch to a different conversation
    const switchConversation = (conversationId: string) => {
        setCurrentConversationId(conversationId);
    };

    return {
        // State
        currentConversationId,
        conversations,
        messages,
        
        // Loading states
        isLoading: conversationsLoading || messagesLoading,
        isStartingConversation: startingConversation,
        isSendingMessage: sendingMessage,
        
        // Error states
        error: conversationsError || messagesError || startConversationError || sendMessageError,
        
        // Actions
        createNewConversation,
        sendChatMessage,
        switchConversation,
        startNewChatWithMessage,
        refetchConversations,
        refetchMessages
    };
};

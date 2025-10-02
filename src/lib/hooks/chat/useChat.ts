import { useEffect, useMemo, useRef, useState } from 'react';
import { useStartConversation } from '../conversation/useStartConversation';
import { useSendMessage } from '../message/useSendMessage';
import { useConversations } from '../conversation/useConversations';
import { useMessages } from '../message/useMessages';
import { parseRateLimit } from '../../utils/chatUtils';
import { useLimits } from '../limit/useLimits';

export const useChat = (conversationId?: string) => {
    const [currentConversationId, setCurrentConversationId] = useState<string | undefined>(conversationId);
    const [isAssistantTyping, setIsAssistantTyping] = useState(false);
    const lastUserSendAtRef = useRef<number | null>(null);

    const { conversations, loading: conversationsLoading, error: conversationsError, refetch: refetchConversations } = useConversations();
    const { startConversation, loading: startingConversation, error: startConversationError } = useStartConversation();

    const { messages, loading: messagesLoading, error: messagesError, refetch: refetchMessages } = useMessages(currentConversationId);
    const { sendMessage, loading: sendingMessage, error: sendMessageError } = useSendMessage();

    const {
        isRateLimited,
        isTokenLimited,
        rateLimitSecondsLeft,
        tokenLimitSecondsLeft,
        tokenRemaining,
        applyRateLimit,
        setRateLimitResetAt,
        setTokenLimitResetAt,
        setTokenRemaining,
        applyLimitsFromError
      } = useLimits([
        conversationsError,
        messagesError,
        startConversationError,
        sendMessageError
      ]);

    const createNewConversation = async (title?: string, initialMessage?: string) => {
        try {
            setCurrentConversationId(undefined);
            return null;
        } catch (err) {
            throw err;
        }
    };

    const sendChatMessage = async (content: string, role: 'user' | 'assistant' = 'user') => {
        if (!currentConversationId) {
            throw new Error('No conversation selected');
        }
        if (isRateLimited) {
            throw new Error('Rate limited');
        }
        if (isTokenLimited) {
            throw new Error('Token limited');
        }
        try {
            lastUserSendAtRef.current = Date.now();
            setIsAssistantTyping(true);
            const newMessage = await sendMessage(currentConversationId, content);
            setTimeout(() => {
                refetchMessages();
                setIsAssistantTyping(false);
            }, 2000);
            return newMessage;
        } catch (err) {
            applyLimitsFromError(err);
            setIsAssistantTyping(false);
            throw err;
        }
    };

    const startNewChatWithMessage = async (message: string) => {
        if (isRateLimited) {
            throw new Error('Rate limited');
        }
        if (isTokenLimited) {
            throw new Error('Token limited');
        }
        try {
            lastUserSendAtRef.current = Date.now();
            setIsAssistantTyping(true);
            const conversation = await startConversation(message);
            if (conversation) {
                setCurrentConversationId(conversation.id);
                setTimeout(async () => {
                    await refetchConversations({ fetchPolicy: 'network-only' });
                    setIsAssistantTyping(false);
                }, 2000);
                return conversation;
            }
        } catch (err) {
            const resetAt = parseRateLimit(err);
            if (resetAt) setRateLimitResetAt(resetAt);
            setIsAssistantTyping(false);
            throw err;
        }
    };

    const switchConversation = (conversationId: string) => {
        setCurrentConversationId(conversationId);
    };

    // Clear typing indicator only when a new assistant message arrives after the last user send
    useEffect(() => {
        if (!messages || messages.length === 0) return;
        const last = messages[messages.length - 1] as any;
        if (last?.role === 'assistant') {
            const lastAssistantAt = new Date(last?.createdAt ?? Date.now()).getTime();
            const lastUserAt = lastUserSendAtRef.current ?? 0;
            if (lastAssistantAt >= lastUserAt && lastUserAt !== 0) {
                setIsAssistantTyping(false);
            }
        }
    }, [messages]);

    return {
        currentConversationId,
        conversations,
        messages,
        isLoading: conversationsLoading || messagesLoading,
        isStartingConversation: startingConversation,
        isSendingMessage: sendingMessage,
        isAssistantTyping,
        isRateLimited,
        rateLimitSecondsLeft,
        isTokenLimited,
        tokenLimitSecondsLeft,
        tokenRemaining,
        error: conversationsError || messagesError || startConversationError || sendMessageError,
        createNewConversation,
        sendChatMessage,
        switchConversation,
        startNewChatWithMessage,
        refetchConversations,
        refetchMessages,
        applyRateLimit
    };
};

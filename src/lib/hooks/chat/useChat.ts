import { useEffect, useMemo, useRef, useState } from 'react';
import { useStartConversation } from '../conversation/useStartConversation';
import { useSendMessage } from '../message/useSendMessage';
import { useConversations } from '../conversation/useConversations';
import { useMessages } from '../message/useMessages';
import { parseRateLimit } from '../../utils/chatUtils';

export const useChat = (conversationId?: string) => {
    const [currentConversationId, setCurrentConversationId] = useState<string | undefined>(conversationId);
    const [isAssistantTyping, setIsAssistantTyping] = useState(false);
    const [rateLimitResetAt, setRateLimitResetAt] = useState<number | null>(null);
    const [now, setNow] = useState<number>(Date.now());
    const lastUserSendAtRef = useRef<number | null>(null);

    const { conversations, loading: conversationsLoading, error: conversationsError, refetch: refetchConversations } = useConversations();
    const { startConversation, loading: startingConversation, error: startConversationError } = useStartConversation();

    const { messages, loading: messagesLoading, error: messagesError, refetch: refetchMessages } = useMessages(currentConversationId);
    const { sendMessage, loading: sendingMessage, error: sendMessageError } = useSendMessage();

    const isRateLimited = useMemo(() => {
        if (!rateLimitResetAt) return false;
        return Date.now() < rateLimitResetAt;
    }, [rateLimitResetAt]);

    const rateLimitSecondsLeft = useMemo(() => {
        if (!rateLimitResetAt) return 0;
        const ms = rateLimitResetAt - now;
        if (ms <= 0) return 0;
        return Math.max(1, Math.ceil(ms / 1000));
    }, [rateLimitResetAt, now]);

    useEffect(() => {
        if (!rateLimitResetAt) return;
        const id = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(id);
    }, [rateLimitResetAt]);

    useEffect(() => {
        if (rateLimitResetAt && Date.now() >= rateLimitResetAt) {
            setRateLimitResetAt(null);
        }
    }, [now, rateLimitResetAt]);

    useEffect(() => {
        const candidates = [conversationsError, messagesError, startConversationError, sendMessageError].filter(Boolean);
        for (const err of candidates as any[]) {
            const resetAt = parseRateLimit(err);
            if (resetAt) {
                setRateLimitResetAt(prev => {
                    const minFuture = Date.now() + 1500;
                    const next = Math.max(resetAt, minFuture);
                    return prev ? Math.max(prev, next) : next;
                });
                break;
            }
        }
    }, [conversationsError, messagesError, startConversationError, sendMessageError]);

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
            const resetAt = parseRateLimit(err);
            if (resetAt) setRateLimitResetAt(resetAt);
            setIsAssistantTyping(false);
            throw err;
        }
    };

    const startNewChatWithMessage = async (message: string) => {
        if (isRateLimited) {
            throw new Error('Rate limited');
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

    const applyRateLimit = (seconds: number) => {
        if (!Number.isFinite(seconds) || seconds <= 0) return;
        const next = Date.now() + seconds * 1000;
        setRateLimitResetAt(prev => (prev ? Math.max(prev, next) : next));
    };

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

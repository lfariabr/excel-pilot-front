import { useMutation, useApolloClient } from "@apollo/client/react";
import { CREATE_MESSAGE } from "../../graphql/message/mutations";
import { GET_MESSAGES } from "../../graphql/message/queries";
import { SendMessageResponse } from "../../graphql/types/messageTypes";

export const useSendMessage = () => {
    const client = useApolloClient();
    const [sendMessageMutation, { loading, error }] = useMutation<SendMessageResponse>(CREATE_MESSAGE);

    const sendMessage = async (conversationId: string, content: string) => {
        try {
            const { data } = await sendMessageMutation({
                variables: { conversationId, content }
            });

            // Refetch messages to get both user and AI messages from backend
            setTimeout(() => {
                client.refetchQueries({
                    include: [GET_MESSAGES]
                });
            }, 100);

            return data?.sendMessage;
        } catch (err) {
            console.error('Send message error:', err);
            throw err;
        }
    };

    return {
        sendMessage,
        loading,
        error
    };
};
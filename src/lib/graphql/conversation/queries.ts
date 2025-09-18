import { gql } from "@apollo/client";

export const CONVERSATION_FRAGMENT = gql`
    fragment ConversationFields on Conversation {
        id
        title
        summary
        createdAt
        updatedAt
        lastMessageAt
    }
`;

export const GET_CONVERSATIONS = gql`
    query GetConversations {
        conversations {
            ...ConversationFields
        }
    }
    ${CONVERSATION_FRAGMENT}
`;
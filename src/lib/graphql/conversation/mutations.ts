import { gql } from "@apollo/client";

// Conversation Mutations
export const CREATE_CONVERSATION = gql`
    mutation startConversation($content: String!) {
        startConversation(content: $content) {
            id
            content
            role
            conversationId
            createdAt
        }
    }
`;

// Delete
// ...

// Update
// ...
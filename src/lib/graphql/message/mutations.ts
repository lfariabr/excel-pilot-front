import { gql } from "@apollo/client";

// Message Mutations
export const CREATE_MESSAGE = gql`
    mutation sendMessage($conversationId: ID!, $content: String!) {
        sendMessage(conversationId: $conversationId, content: $content) {
            id
            content
            createdAt
        }
    }
`;

// Delete
// ... 

// Update
// ...

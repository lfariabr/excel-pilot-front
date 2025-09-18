import { gql } from "@apollo/client";

export const MESSAGE_FRAGMENT = gql`
  fragment MessageFields on Message {
    id
    content
    createdAt
  }
`;

// Message Queries
export const GET_MESSAGES = gql`
  query GetMessages($conversationId: ID!) {
    messages(conversationId: $conversationId) {
      edges {
        node {
          ...MessageFields
        }
      }
    }
  }
  ${MESSAGE_FRAGMENT}
`;
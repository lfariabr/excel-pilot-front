import { gql } from "@apollo/client";

export const MESSAGE_FRAGMENT = gql`
  fragment MessageFields on Message {
    id
    content
    role
    createdAt
  }
`;

// Message Queries
export const GET_MESSAGES = gql`
  query GetMessages($conversationId: ID!, $first: Int = 20, $after: String, $before: String, $last: Int) {
    messages(conversationId: $conversationId, first: $first, after: $after, before: $before, last: $last) {
      edges {
        node {
          ...MessageFields
        }
        cursor
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
  ${MESSAGE_FRAGMENT}
`;
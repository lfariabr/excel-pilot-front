import { gql } from "@apollo/client";

// Auth Queries
export const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    me {
      id
      email
      name
      role
      createdAt
    }
  }
`;

export const VERIFY_TOKEN = gql`
  query VerifyToken {
    verifyToken {
      valid
      user {
        id
        email
        name
        role
      }
    }
  }
`;

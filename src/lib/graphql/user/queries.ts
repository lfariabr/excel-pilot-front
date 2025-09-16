import { gql } from '@apollo/client';

// Fragment for consistent user data shape
export const USER_FRAGMENT = gql`
  fragment UserFields on User {
    id
    email
    role
    createdAt
    updatedAt
  }
`;

// User Queries - WORKING ✅✅✅
export const GET_USERS = gql`
  query GetUsers {
    users {
      ...UserFields
    }
  }
  ${USER_FRAGMENT}
`;

// Todo...

export const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    getCurrentUser {
      ...UserFields
    }
  }
  ${USER_FRAGMENT}
`;


export const GET_USER_BY_ID = gql`
  query GetUserById($id: ID!) {
    user(id: $id) {
      ...UserFields
    }
  }
  ${USER_FRAGMENT}
`;

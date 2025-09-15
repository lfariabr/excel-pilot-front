import { gql } from '@apollo/client'

// User Queries - WORKING ✅✅✅
export const GET_USERS = gql`
  query GetUsers {
    users {
      id
      email
      role
      createdAt
      updatedAt
    }
  }
`;

// PENDING
export const GET_USER_BY_ID = gql`
  query GetUserById($id: ID!) {
    user(id: $id) {
      id
      email
      role
      createdAt
      updatedAt
    }
  }
`

// PENDING
export const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    me {
      id
      email
      role
      createdAt
      updatedAt
    }
  }
`

// PENDING
// Chat Message Queries
export const GET_CHAT_MESSAGES = gql`
  query GetChatMessages($agentId: ID!, $limit: Int, $offset: Int) {
    chatMessages(agentId: $agentId, limit: $limit, offset: $offset) {
      id
      content
      role
      createdAt
      agent {
        id
        name
      }
      user {
        id
        email
      }
    }
  }
`

// PENDING
// Authentication Mutations
export const LOGIN_USER = gql`
  mutation LoginUser($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        email
        role
      }
    }
  }
`

// PENDING
export const REGISTER_USER = gql`
  mutation RegisterUser($email: String!, $password: String!, $role: String) {
    register(email: $email, password: $password, role: $role) {
      token
      user {
        id
        email
        role
      }
    }
  }
`

// PENDING
export const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {
    updateUser(id: $id, input: $input) {
      id
      email
      role
      updatedAt
    }
  }
`

export const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id) {
      success
      message
    }
  }
`

// PENDING
// Chat Message Mutations
export const SEND_CHAT_MESSAGE = gql`
  mutation SendChatMessage($input: SendChatMessageInput!) {
    sendChatMessage(input: $input) {
      id
      content
      role
      createdAt
      agent {
        id
        name
      }
      user {
        id
        email
      }
    }
  }
`

// PENDING
// Response Queries (for OpenAI integration)
export const GET_RESPONSES = gql`
  query GetResponses($limit: Int, $offset: Int, $cursor: String) {
    responses(limit: $limit, offset: $offset, cursor: $cursor) {
      edges {
        node {
          id
          title
          summary
          content
          tokensUsed
          createdAt
          user {
            id
            email
          }
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
`

// Response Mutations
export const CREATE_RESPONSE = gql`
  mutation CreateResponse($input: CreateResponseInput!) {
    createResponse(input: $input) {
      id
      title
      summary
      content
      tokensUsed
      createdAt
      user {
        id
        email
      }
    }
  }
`

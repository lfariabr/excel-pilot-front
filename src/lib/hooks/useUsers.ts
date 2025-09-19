import { useQuery } from "@apollo/client/react";
import { GET_USERS, GET_CURRENT_USER, GET_USER_BY_ID } from "../graphql/user/queries";
import { User, UsersResponse, UserResponse, CurrentUserResponse, UsersData } from "../graphql/types/userTypes";
import { getToken } from "../utils/tokenUtils";

/**
 * Hook for fetching all users
 * Intended for admin or testing only
 */
export const useUsers = () => {
    return useQuery(GET_USERS, {
      errorPolicy: 'all'
    })
}

/**
 * Hook for fetching a specific user by ID
 */
export const useUser = (id: string) => {
  return useQuery(GET_USER_BY_ID, {
    variables: { id },
    skip: !id,
    errorPolicy: 'all'
  })
}

/**
 * Hook for fetching the current authenticated user
 */
export const useCurrentUser = () => {
  return useQuery(GET_CURRENT_USER, {
    skip: !getToken(), // Skip if no token
    errorPolicy: 'all'
  })
}

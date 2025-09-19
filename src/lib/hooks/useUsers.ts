import { useQuery } from "@apollo/client/react";
import { GET_USERS, GET_CURRENT_USER, GET_USER_BY_ID } from "../graphql/user/queries";
import { User, UsersResponse, UserResponse, CurrentUserResponse } from "../graphql/types/userTypes";
import { UsersData } from "../graphql/types/userTypes";

/**
 * Hook for fetching all users
 * Intended for admin or testing only
 */

export const useUsers = () => {
    return useQuery(GET_USERS, {
      // variables: { limit, offset },
      errorPolicy: 'all'
    })
}

export const useUser = (id: string) => {
  return useQuery(GET_USER_BY_ID, {
    variables: { id },
    skip: !id,
    errorPolicy: 'all'
  })
}

export const useCurrentUser = () => {
  return useQuery(GET_CURRENT_USER, {
    errorPolicy: 'all'
  })
}

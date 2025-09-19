
import { useQuery } from "@apollo/client/react";
import { CurrentUserResponse } from "../../graphql/types/authTypes";
import { GET_CURRENT_USER } from "../../graphql/auth/queries";
import { getToken } from "../../utils/tokenUtils";

// Current user hook
export const useCurrentUser = () => {
    const { data, loading, error, refetch } = useQuery<CurrentUserResponse>(GET_CURRENT_USER, {
      skip: !getToken(), // Skip if no token
      errorPolicy: 'all'
    });
  
    return {
      user: data?.me,
      loading,
      error,
      refetch
    };
  };
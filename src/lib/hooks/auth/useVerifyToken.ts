
import { useQuery } from "@apollo/client/react";
import { VerifyTokenResponse } from "../../graphql/types/authTypes";
import { VERIFY_TOKEN } from "../../graphql/auth/queries";
import { getToken } from "../../utils/tokenUtils";

// Token verification hook
export const useVerifyToken = () => {
    const { data, loading, error } = useQuery<VerifyTokenResponse>(VERIFY_TOKEN, {
      skip: !getToken(),
      errorPolicy: 'all'
    });
  
    return {
      isValid: data?.verifyToken.valid || false,
      user: data?.verifyToken.user,
      loading,
      error
    };
  };
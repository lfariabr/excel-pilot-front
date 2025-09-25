import { useMutation, useApolloClient } from "@apollo/client/react";
import { LogoutResponse } from "../../graphql/types/authTypes";
import { LOGOUT_MUTATION } from "../../graphql/auth/mutations";
import { removeToken } from "../../utils/tokenUtils";
import { signOut } from "next-auth/react";

// Logout hook
export const useLogout = () => {
    const client = useApolloClient();
    const [logoutMutation, { loading }] = useMutation<LogoutResponse>(LOGOUT_MUTATION);
  
    const logout = async () => {
      try {
        await logoutMutation();
        removeToken();
        
        // Clear Apollo cache to remove all cached data
        await client.clearStore();
        
        // Redirect to login
        if (typeof window !== 'undefined') {
          signOut();
        }
      } catch (err) {
        // Even if server logout fails, clear local token and cache
        removeToken();
        await client.clearStore();
        signOut();
      }
    };
  
    return {
      logout,
      loading
    };
};
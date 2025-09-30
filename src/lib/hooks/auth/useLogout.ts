import { useMutation, useApolloClient } from "@apollo/client/react";
import { LogoutResponse } from "../../graphql/types/authTypes";
import { LOGOUT_MUTATION } from "../../graphql/auth/mutations";
import { signOut } from "next-auth/react";

// Logout hook
export const useLogout = () => {
    const client = useApolloClient();
    const [logoutMutation, { loading }] = useMutation<LogoutResponse>(LOGOUT_MUTATION);
  
    const logout = async () => {
      try {
        await logoutMutation();
        
        // Clear Apollo cache to remove all cached data
        await client.clearStore();
        
        await signOut({ callbackUrl: "/login" });
      } catch (err) {
        // Even if server logout fails, ensure client-side cleanup
        await client.clearStore();
        await signOut({ callbackUrl: "/login" });
      }
    };
  
    return {
      logout,
      loading
    };
};
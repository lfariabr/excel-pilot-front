
import { useRouter } from "next/navigation";
import { useMutation } from "@apollo/client/react";
import { LogoutResponse } from "../../graphql/types/authTypes";
import { LOGOUT_MUTATION } from "../../graphql/auth/queries";
import { removeToken } from "../../utils/tokenUtils";

// Logout hook
export const useLogout = () => {
    const router = useRouter();
    const [logoutMutation, { loading }] = useMutation<LogoutResponse>(LOGOUT_MUTATION);
  
    const logout = async () => {
      try {
        await logoutMutation();
        removeToken();
        // Clear Apollo cache to remove user data
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      } catch (err) {
        // Even if server logout fails, clear local token
        removeToken();
        router.push('/login');
      }
    };
  
    return {
      logout,
      loading
    };
  };
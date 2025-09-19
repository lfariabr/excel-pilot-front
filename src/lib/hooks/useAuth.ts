import { useCurrentUser } from "./auth/useCurrentUser";

import { getToken, setToken, removeToken } from "../utils/tokenUtils";

// Auth status hook
export const useAuthStatus = () => {
  const { user, loading } = useCurrentUser();
  const token = getToken();

  return {
    isAuthenticated: !!token && !!user,
    isLoading: loading,
    user,
    token
  };
};
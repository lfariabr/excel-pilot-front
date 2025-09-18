import { useMutation, useQuery } from "@apollo/client/react";
import { useRouter } from "next/navigation";
import { 
  LOGIN_MUTATION, 
  REGISTER_MUTATION, 
  LOGOUT_MUTATION, 
  GET_CURRENT_USER,
  VERIFY_TOKEN 
} from "../graphql/auth/queries";
import type { 
  LoginInput, 
  RegisterInput, 
  LoginResponse, 
  RegisterResponse, 
  LogoutResponse,
  CurrentUserResponse,
  VerifyTokenResponse 
} from "../graphql/types/authTypes";

// Token management utilities
const TOKEN_KEY = 'excel-pilot-token';

export const getToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token: string) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeToken = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
};

// Login hook
export const useLogin = () => {
  const router = useRouter();
  const [loginMutation, { loading, error }] = useMutation<LoginResponse>(LOGIN_MUTATION);

  const login = async (input: LoginInput) => {
    try {
      const { data } = await loginMutation({
        variables: { input }
      });

      if (data?.login.accessToken) {
        setToken(data.login.accessToken);
        // Redirect to dashboard or intended page
        const redirectTo = (typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('redirect')) || '/';
        router.push(redirectTo);
        return data.login;
      }
    } catch (err) {
      console.error('Login error:', err);
      throw err;
    }
  };

  return {
    login,
    loading,
    error
  };
};

// Register hook
export const useRegister = () => {
  const router = useRouter();
  const [registerMutation, { loading, error }] = useMutation<RegisterResponse>(REGISTER_MUTATION);

  const register = async (input: RegisterInput) => {
    try {
      const { data } = await registerMutation({
        variables: { input }
      });

      if (data?.register.accessToken) {
        setToken(data.register.accessToken);
        // Redirect to dashboard after successful registration
        router.push('/');
        return data.register;
      }
    } catch (err) {
      console.error('Register error:', err);
      throw err;
    }
  };

  return {
    register,
    loading,
    error
  };
};

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

'use client';

import { useRouter } from "next/navigation";
import { useMutation } from "@apollo/client/react";
import { LoginResponse } from "../../graphql/types/authTypes";
import { LOGIN_MUTATION } from "../../graphql/auth/queries";
import { LoginInput } from "../../graphql/types/authTypes";
import { setToken } from "../../utils/tokenUtils";

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
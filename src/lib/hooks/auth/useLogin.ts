'use client';

import { useRouter } from "next/navigation";
import { useApolloClient } from "@apollo/client/react";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { LoginInput } from "../../graphql/types/authTypes";

// Login hook - Updated to use NextAuth
export const useLogin = () => {
    const router = useRouter();
    const client = useApolloClient();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
  
    const login = async (input: LoginInput) => {
      setLoading(true);
      setError(null);
      
      try {
        // Use NextAuth signIn instead of direct GraphQL mutation
        const result = await signIn('credentials', {
          email: input.email,
          password: input.password,
          action: 'login',
          redirect: false,
        });

        if (result?.error) {
          throw new Error(result.error);
        }

        if (result?.ok) {
          // Clear Apollo cache to ensure fresh data with new session
          await client.clearStore();
          
          // Redirect to dashboard or intended page
          const redirectTo = (typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('redirect')) || '/chat';
          router.push(redirectTo);
          
          return { success: true };
        }
        
        throw new Error('Login failed');
      } catch (err) {
        console.error('Login error:', err);
        const errorMessage = err instanceof Error ? err.message : 'Login failed';
        setError(new Error(errorMessage));
        throw err;
      } finally {
        setLoading(false);
      }
    };
  
    return {
      login,
      loading,
      error
    };
};
'use client';

import { useRouter } from "next/navigation";
import { useApolloClient } from "@apollo/client/react";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { RegisterInput } from "../../graphql/types/authTypes";

// Register hook - Updated to use NextAuth
export const useRegister = () => {
    const router = useRouter();
    const client = useApolloClient();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
  
    const register = async (input: RegisterInput) => {
      setLoading(true);
      setError(null);
      
      try {
        // Use NextAuth signIn with register action
        const result = await signIn('credentials', {
          email: input.email,
          password: input.password,
          name: input.name,
          action: 'register',
          redirect: false,
        });

        if (result?.error) {
          throw new Error(result.error);
        }

        if (result?.ok) {
          // Clear Apollo cache to ensure fresh data with new session
          await client.clearStore();
          
          // Redirect to dashboard after successful registration
          router.push('/');
          
          return { success: true };
        }
        
        throw new Error('Registration failed');
      } catch (err) {
        console.error('Register error:', err);
        const errorMessage = err instanceof Error ? err.message : 'Registration failed';
        setError(new Error(errorMessage));
        throw err;
      } finally {
        setLoading(false);
      }
    };
  
    return {
      register,
      loading,
      error
    };
};
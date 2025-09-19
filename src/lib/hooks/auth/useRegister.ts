import { useRouter } from "next/navigation";
import { useMutation, useApolloClient } from "@apollo/client/react";
import { RegisterResponse } from "../../graphql/types/authTypes";
import { REGISTER_MUTATION } from "../../graphql/auth/queries";
import { GET_CURRENT_USER } from "../../graphql/auth/queries";
import { RegisterInput } from "../../graphql/types/authTypes";
import { setToken } from "../../utils/tokenUtils";

// Register hook
export const useRegister = () => {
    const router = useRouter();
    const client = useApolloClient();
    const [registerMutation, { loading, error }] = useMutation<RegisterResponse>(REGISTER_MUTATION);
  
    const register = async (input: RegisterInput) => {
      try {
        const { data } = await registerMutation({
          variables: { input }
        });
  
        if (data?.register.accessToken) {
          setToken(data.register.accessToken);
          
          // Clear any stale cache and refetch current user
          await client.clearStore();
          
          // Prefetch the current user data with the new token
          await client.query({
            query: GET_CURRENT_USER,
            fetchPolicy: 'network-only' // Force fresh fetch
          });
          
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
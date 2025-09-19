
import { useRouter } from "next/navigation";
import { useMutation } from "@apollo/client/react";
import { RegisterResponse } from "../../graphql/types/authTypes";
import { REGISTER_MUTATION } from "../../graphql/auth/queries";
import { RegisterInput } from "../../graphql/types/authTypes";
import { setToken } from "../../utils/tokenUtils";

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
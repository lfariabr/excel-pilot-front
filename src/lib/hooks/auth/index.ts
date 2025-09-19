// Auth hooks index - exports all auth-related hooks
export { useLogin } from './useLogin';
export { useRegister } from './useRegister';
export { useLogout } from './useLogout';
export { useAuthStatus } from './useAuthStatus';
export { useCurrentUser } from './useCurrentUser';
export { useVerifyToken } from './useVerifyToken';

// Re-export token utilities from the existing utils file
export { getToken, setToken, removeToken } from '../../utils/tokenUtils';

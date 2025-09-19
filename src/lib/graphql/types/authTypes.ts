// TypeScript interfaces for Authentication data

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt?: string;
}

export interface AuthPayload {
  user: User;
  accessToken: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  name: string;
  role: string;
}

export interface LoginResponse {
  login: AuthPayload;
}

export interface RegisterResponse {
  register: AuthPayload;
}

export interface LogoutResponse {
  logout: {
    success: boolean;
    message: string;
  };
}

export interface CurrentUserResponse {
  me: User;
}

export interface VerifyTokenResponse {
  verifyToken: {
    valid: boolean;
    user?: User;
  };
}

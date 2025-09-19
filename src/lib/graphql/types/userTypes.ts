// TypeScript interfaces for User data

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UsersResponse {
  users: User[];
}

export interface UsersData {
    users: User[];
}

export interface UserResponse {
  user: User;
}

export interface CurrentUserResponse {
  me: User;
}

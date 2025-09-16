// TypeScript interfaces for User data

export interface User {
  id: string;
  email: string;
  role: string;
}

export interface UsersResponse {
  users: User[];
}

// Working ✅✅✅
export interface UsersData {
    users: User[];
}

export interface UserResponse {
  user: User;
}

export interface CurrentUserResponse {
  getCurrentUser: User;
}

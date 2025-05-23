// src/types/auth.ts
export interface User {
  id: number;
  username: string;
  email: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}
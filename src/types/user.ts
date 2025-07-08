// src/types/user.ts
// 👥 SOLO tipos relacionados con GESTIÓN DE USUARIOS

export interface CreateUserRequest {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: UserRole | number; // Supports both string and int for backend compatibility
  photo?: File;   // Matches backend field name
}

export interface CreateUserResponse {
  user: User;
  message: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole; // Matches backend field name
  photo?: string; // Matches backend field name
  created_at: string;
  updated_at: string;
}

export interface RoleType {
  id: number;
  name: string;
}

export type UserRole = "user" | "admin";

export const USER_ROLES: { value: UserRole; label: string }[] = [
  { value: "user", label: "Usuario" },
  { value: "admin", label: "Administrador" },
];

// Additional user-related interfaces
export interface UserListItem {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  photoUrl?: string;
  isActive: boolean;
  lastLogin?: string;
}

export interface UserFilters {
  role?: UserRole;
  searchTerm?: string;
  isActive?: boolean;
  sortBy?: 'username' | 'email' | 'createdAt' | 'lastLogin';
  sortOrder?: 'asc' | 'desc';
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  userCount: number;
  adminCount: number;
}
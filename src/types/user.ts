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
  role?: number; // For backward compatibility  
  role_id?: number; // Backend sends role ID as number
  role_name?: string; // Backend now includes role name
  photo?: string; // Matches backend field name
  created_at: string;
  updated_at: string;
}

export interface RoleType {
  id: number;
  name: string;
}

export type UserRole = "colaborador" | "admin" | "superadmin";

export const USER_ROLES: { value: UserRole; label: string }[] = [
  { value: "colaborador", label: "Colaborador" },
  { value: "admin", label: "Administrador" },
  { value: "superadmin", label: "Superadministrador" },
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
  colaboradorCount: number;
  adminCount: number;
  superadminCount: number;
}
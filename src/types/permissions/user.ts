// src/types/permissions.ts
// 🔐 ONLY types related to PERMISSIONS MANAGEMENT

export interface User {
  id: number;
  name: string;
  email: string;
  status: UserStatus;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type UserStatus = "active" | "inactive" | "no_project";

export interface UsersListResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  status: UserStatus;
}

export interface UserFilters {
  status?: UserStatus;
  searchTerm?: string;
  isActive?: boolean;
  sortBy?: "name" | "email" | "status" | "createdAt";
  sortOrder?: "asc" | "desc";
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  usersWithFullPermissions: number;
}

export const USER_STATUS_LABELS: Record<UserStatus, string> = {
  active: "Activo",
  inactive: "Inactivo",
  no_project: "Sin Proyecto",
};

export const USER_STATUS_COLORS: Record<UserStatus, string> = {
  active: "text-green-500",
  inactive: "text-gray-500",
  no_project: "text-red-500",
};

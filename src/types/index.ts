// src/types/index.ts
// 📋 EXPORTS de todos los tipos de la aplicación

// Tipos de autenticación
export type {
  AuthUser,
  LoginCredentials,
  LoginResponse,
  AuthState,
} from "./auth";

// Tipos de gestión de usuarios
export type {
  CreateUserRequest,
  CreateUserResponse,
  User,
  UserRole,
} from "./user";

// Tipos de permisos y backend
export type {
  UserPermissionResponse,
  PermissionRequest,
  BulkPermissionRequest,
  PermissionCheckResponse,
} from "./permissions/backend";

// Constantes y utilidades de permisos
export { PERMISSIONS, CONTENT_TYPES } from "../utils/permissions/constants";
export { hasPermission } from "../utils/permissions/hasPermission";



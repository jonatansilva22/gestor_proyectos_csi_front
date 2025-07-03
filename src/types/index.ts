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

// Tipos de permisos y estudiantes
export type {
  Student,
  StudentStatus,
  StudentPermissions,
  StudentsListResponse,
  UpdateStudentPermissionsRequest,
  CreateStudentRequest,
  StudentFilters,
  StudentStats,
} from "./permissions";



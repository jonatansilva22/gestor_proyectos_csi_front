// src/types/index.ts
// 📋 EXPORTS de todos los tipos de la aplicación

// Tipos de autenticación
export type {
  AuthUser,
  LoginCredentials,
  LoginResponse,
  AuthState
} from './auth';

// Tipos de gestión de usuarios
export type {
  CreateUserRequest,
  CreateUserResponse,
  User,
  UserRole
} from './user';

// Futuros exports de tipos:
// export type { Project, Task, Comment } from './project';
// export type { Notification, NotificationType } from './notification';

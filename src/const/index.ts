// src/const/index.ts
// 📋 CONSTANTES de la aplicación

// URLs de la API
export const API_ENDPOINTS = {
  AUTH: '/auth',
  USERS: '/users',
  PERMISSIONS: '/permissions',
  PROJECTS: '/projects',
} as const;

// Configuración de la aplicación
export const APP_CONFIG = {
  NAME: 'CSI PRO',
  VERSION: '1.0.0',
  DESCRIPTION: 'Sistema de Gestión de tareas',
} as const;

// Roles de usuario
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  GUEST: 'guest',
} as const;

// Estados de estudiantes
export const STUDENT_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending',
} as const;
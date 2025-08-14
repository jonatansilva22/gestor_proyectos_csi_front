// src/const/index.ts
// 📋 CONSTANTES de la aplicación

// URLs de la API
export const API_ENDPOINTS = {
  AUTH: '/auth',
  USERS: '/users',
  PROJECTS: '/projects',
} as const;

// Configuración de la aplicación
export const APP_CONFIG = {
  NAME: 'CSI PRO',
  VERSION: '1.0.0',
  DESCRIPTION: 'Sistema de Gestión de tareas',
} as const;

// Roles de usuario (mapping to backend IDs)
export const USER_ROLES = {
  ADMIN: 1,        // ID 1 = Admin
  SUPERADMIN: 2,   // ID 2 = SuperAdmin  
  COLABORADOR: 3,  // ID 3 = Colaborador
} as const;

// Mapeo de nombres de roles
export const ROLE_NAMES = {
  1: 'Admin',
  2: 'SuperAdmin', 
  3: 'Colaborador'
} as const;

// Mapeo de roles para formularios (string a number)
export const ROLE_MAPPING = {
  "admin": 1,
  "superadmin": 2, 
  "colaborador": 3
} as const;
// src/types/auth.ts
// 🔐 TIPOS RELACIONADOS CON AUTENTICACIÓN Y PERMISOS
// Define las interfaces para usuarios autenticados y sistema de permisos

/**
 * Usuario autenticado en el sistema
 * Contiene información básica del usuario y sus permisos opcionales
 */
export interface AuthUser {
  id: number;                         // ID único del usuario
  username: string;                   // Nombre de usuario para login
  name?: string;                      // Nombre completo (opcional)
  email: string;                      // Correo electrónico
  role?: string;                      // Rol del usuario (opcional)
  permissions?: UserPermissions;      // Permisos del usuario (opcional)
}

/**
 * Permisos de usuario compatibles con el sistema de permisos del backend
 * Combina permisos granulares y permisos simples para compatibilidad
 */
export interface UserPermissions {
  // Permisos a nivel de modelo (granulares)
  modelPermissions: ModelPermission[];      // Permisos sobre tipos de entidades
  // Permisos a nivel de objeto (granulares)  
  objectPermissions: ObjectPermission[];    // Permisos sobre objetos específicos
  // Permisos simples para compatibilidad con versiones anteriores
  canRead: boolean;                         // Puede leer información
  canWrite: boolean;                        // Puede crear y editar
  canDelete: boolean;                       // Puede eliminar
  canManageProjects: boolean;               // Puede gestionar proyectos
  canManageUsers: boolean;                  // Puede gestionar usuarios
  canViewReports: boolean;                  // Puede ver reportes
  canExport: boolean;                       // Puede exportar datos
  canManagePermissions: boolean;            // Puede gestionar permisos
}

/**
 * Permiso a nivel de modelo (mapeado del modelo Permission del backend)
 * Representa permisos sobre tipos de entidades completas
 */
export interface ModelPermission {
  id: number;                         // ID único del permiso
  name: string;                       // Nombre descriptivo del permiso
  contentType: string;                // Tipo de entidad (ej: 'project', 'area', 'user')
  codename: string;                   // Código del permiso (ej: 'add_project', 'change_project')
}

/**
 * Permiso a nivel de objeto específico (mapeado del modelo UserObjectPermission del backend)
 * Representa permisos sobre instancias específicas de entidades
 */
export interface ObjectPermission {
  id: number;                         // ID único del permiso de objeto
  permission: ModelPermission;        // Permiso base asociado
  objectId: number;
  contentType: string;
  objectRepr?: string; // Human readable object representation
}

// Maps to backend UserModelPermission  
export interface UserModelPermission {
  id: number;
  permission: ModelPermission;
  contentType: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: AuthUser;
  token: string;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
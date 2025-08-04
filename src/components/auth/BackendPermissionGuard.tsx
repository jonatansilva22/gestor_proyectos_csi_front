// src/components/auth/BackendPermissionGuard.tsx
// Componentes de protección basados en permisos del backend

import React from 'react';
import { useBackendPermissions } from '../../hooks/permissions/useBackendPermissions';

/**
 * Props para el componente de protección de permisos del backend.
 */
interface BackendPermissionGuardProps {
  children: React.ReactNode;     // Contenido a proteger
  permission: string;            // Permiso requerido
  contentType?: string;          // Tipo de contenido (opcional)
  objectId?: number;             // ID del objeto específico (opcional)
  fallback?: React.ReactNode;    // Contenido alternativo si no tiene permisos
  requireAll?: boolean;          // Si requiere todos los permisos o solo uno
  permissions?: { permission: string; contentType?: string; objectId?: number }[]; // Múltiples permisos
}

/**
 * Componente de protección genérico basado en permisos del backend.
 * Renderiza el contenido solo si el usuario tiene los permisos requeridos.
 * 
 * @param children - Contenido a proteger
 * @param permission - Permiso requerido (ej: "add_project")
 * @param contentType - Tipo de contenido (ej: "project")
 * @param objectId - ID del objeto específico
 * @param fallback - Contenido alternativo si no tiene permisos
 * @param requireAll - Si se requieren todos los permisos o solo uno
 * @param permissions - Array de múltiples permisos a verificar
 */
export const BackendPermissionGuard: React.FC<BackendPermissionGuardProps> = ({
  children,
  permission,
  contentType,
  objectId,
  fallback = null,
  requireAll = false,
  permissions = [],
}) => {
  const { can, canAll, canAny } = useBackendPermissions();

  let hasAccess = false;

  if (permissions.length > 0) {
    // Verificación de múltiples permisos
    hasAccess = requireAll ? canAll(permissions) : canAny(permissions);
  } else {
    // Verificación de permiso único
    hasAccess = can(permission, contentType, objectId);
  }

  return hasAccess ? <>{children}</> : <>{fallback}</>;
};

// ========================================
// GUARDS ESPECÍFICOS POR ENTIDAD
// ========================================

/**
 * Props para guards de entidad específica.
 */
interface EntityGuardProps {
  children: React.ReactNode; // Contenido a proteger
  entityId?: number;         // ID de la entidad (opcional para permisos de modelo)
  fallback?: React.ReactNode; // Contenido alternativo
}

// GUARDS DE PROYECTOS

/** Guard para ver proyectos */
export const ProjectViewGuard: React.FC<EntityGuardProps> = ({ children, entityId, fallback = null }) => {
  const { canViewProject } = useBackendPermissions();
  return canViewProject(entityId) ? <>{children}</> : <>{fallback}</>;
};

/** Guard para editar proyectos */
export const ProjectEditGuard: React.FC<EntityGuardProps> = ({ children, entityId, fallback = null }) => {
  const { canEditProject } = useBackendPermissions();
  return canEditProject(entityId) ? <>{children}</> : <>{fallback}</>;
};

/** Guard para eliminar proyectos */
export const ProjectDeleteGuard: React.FC<EntityGuardProps> = ({ children, entityId, fallback = null }) => {
  const { canDeleteProject } = useBackendPermissions();
  return canDeleteProject(entityId) ? <>{children}</> : <>{fallback}</>;
};

/** Guard para crear proyectos */
export const ProjectCreateGuard: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({ children, fallback = null }) => {
  const { canCreateProject } = useBackendPermissions();
  return canCreateProject() ? <>{children}</> : <>{fallback}</>;
};

// GUARDS DE ÁREAS

/** Guard para ver áreas */
export const AreaViewGuard: React.FC<EntityGuardProps> = ({ children, entityId, fallback = null }) => {
  const { canViewArea } = useBackendPermissions();
  return canViewArea(entityId) ? <>{children}</> : <>{fallback}</>;
};

/** Guard para editar áreas */
export const AreaEditGuard: React.FC<EntityGuardProps> = ({ children, entityId, fallback = null }) => {
  const { canEditArea } = useBackendPermissions();
  return canEditArea(entityId) ? <>{children}</> : <>{fallback}</>;
};

/** Guard para eliminar áreas */
export const AreaDeleteGuard: React.FC<EntityGuardProps> = ({ children, entityId, fallback = null }) => {
  const { canDeleteArea } = useBackendPermissions();
  return canDeleteArea(entityId) ? <>{children}</> : <>{fallback}</>;
};

/** Guard para crear áreas */
export const AreaCreateGuard: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({ children, fallback = null }) => {
  const { canCreateArea } = useBackendPermissions();
  return canCreateArea() ? <>{children}</> : <>{fallback}</>;
};

// GUARDS DE USUARIOS

/** Guard para ver usuarios */
export const UserViewGuard: React.FC<EntityGuardProps> = ({ children, entityId, fallback = null }) => {
  const { canViewUser } = useBackendPermissions();
  return canViewUser(entityId) ? <>{children}</> : <>{fallback}</>;
};

/** Guard para editar usuarios */
export const UserEditGuard: React.FC<EntityGuardProps> = ({ children, entityId, fallback = null }) => {
  const { canEditUser } = useBackendPermissions();
  return canEditUser(entityId) ? <>{children}</> : <>{fallback}</>;
};

/** Guard para eliminar usuarios */
export const UserDeleteGuard: React.FC<EntityGuardProps> = ({ children, entityId, fallback = null }) => {
  const { canDeleteUser } = useBackendPermissions();
  return canDeleteUser(entityId) ? <>{children}</> : <>{fallback}</>;
};

/** Guard para crear usuarios */
export const UserCreateGuard: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({ children, fallback = null }) => {
  const { canCreateUser } = useBackendPermissions();
  return canCreateUser() ? <>{children}</> : <>{fallback}</>;
};

// GUARDS DE REPOSITORIOS

/** Guard para ver repositorios */
export const RepositoryViewGuard: React.FC<EntityGuardProps> = ({ children, entityId, fallback = null }) => {
  const { canViewRepository } = useBackendPermissions();
  return canViewRepository(entityId) ? <>{children}</> : <>{fallback}</>;
};

/** Guard para editar repositorios */
export const RepositoryEditGuard: React.FC<EntityGuardProps> = ({ children, entityId, fallback = null }) => {
  const { canEditRepository } = useBackendPermissions();
  return canEditRepository(entityId) ? <>{children}</> : <>{fallback}</>;
};

/** Guard para eliminar repositorios */
export const RepositoryDeleteGuard: React.FC<EntityGuardProps> = ({ children, entityId, fallback = null }) => {
  const { canDeleteRepository } = useBackendPermissions();
  return canDeleteRepository(entityId) ? <>{children}</> : <>{fallback}</>;
};

/** Guard para crear repositorios */
export const RepositoryCreateGuard: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({ children, fallback = null }) => {
  const { canCreateRepository } = useBackendPermissions();
  return canCreateRepository() ? <>{children}</> : <>{fallback}</>;
};

// GUARDS DE HERRAMIENTAS

/** Guard para ver herramientas */
export const ToolViewGuard: React.FC<EntityGuardProps> = ({ children, entityId, fallback = null }) => {
  const { canViewTool } = useBackendPermissions();
  return canViewTool(entityId) ? <>{children}</> : <>{fallback}</>;
};

/** Guard para editar herramientas */
export const ToolEditGuard: React.FC<EntityGuardProps> = ({ children, entityId, fallback = null }) => {
  const { canEditTool } = useBackendPermissions();
  return canEditTool(entityId) ? <>{children}</> : <>{fallback}</>;
};

/** Guard para eliminar herramientas */
export const ToolDeleteGuard: React.FC<EntityGuardProps> = ({ children, entityId, fallback = null }) => {
  const { canDeleteTool } = useBackendPermissions();
  return canDeleteTool(entityId) ? <>{children}</> : <>{fallback}</>;
};

/** Guard para crear herramientas */
export const ToolCreateGuard: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({ children, fallback = null }) => {
  const { canCreateTool } = useBackendPermissions();
  return canCreateTool() ? <>{children}</> : <>{fallback}</>;
};

// GUARD DE GESTIÓN DE PERMISOS

/** Guard para gestionar permisos del sistema */
export const PermissionManagementGuard: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({ children, fallback = null }) => {
  const { canManagePermissions } = useBackendPermissions();
  return canManagePermissions() ? <>{children}</> : <>{fallback}</>;
};
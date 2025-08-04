// src/hooks/permissions/useBackendPermissions.ts
import { useAuth } from '../../context';
import {
  UserPermissionResponse,
  PERMISSIONS,
  CONTENT_TYPES,
  hasPermission,
} from '../../types';

/**
 * Hook `useBackendPermissions` para una gestión centralizada y granular de permisos del backend.
 *
 * Proporciona funciones específicas para verificar permisos sobre modelos y objetos,
 * basándose en la respuesta de permisos del API.
 *
 * @returns Un objeto con funciones de verificación de permisos para todas las entidades del sistema.
 */
export const useBackendPermissions = () => {
  const { userPermissions } = useAuth();
  const permissions: UserPermissionResponse | null = userPermissions;

  /**
   * Verificador genérico de permisos.
   *
   * @param permission - Código del permiso (ej. `view_project`).
   * @param contentType - Modelo sobre el que se verifica (ej. `project`).
   * @param objectId - ID del objeto específico (opcional).
   * @returns `true` si el usuario tiene el permiso.
   */
  const can = (
    permission: string,
    contentType?: string,
    objectId?: number
  ): boolean => {
    if (!permissions) return false;
    return hasPermission(permissions, permission, contentType, objectId);
  };

  // --- Verificaciones de Permisos por Entidad ---

  const canViewProject = (id?: number) => can(PERMISSIONS.VIEW_PROJECT, CONTENT_TYPES.PROJECT, id);
  const canCreateProject = () => can(PERMISSIONS.ADD_PROJECT, CONTENT_TYPES.PROJECT);
  const canEditProject = (id?: number) => can(PERMISSIONS.CHANGE_PROJECT, CONTENT_TYPES.PROJECT, id);
  const canDeleteProject = (id?: number) => can(PERMISSIONS.DELETE_PROJECT, CONTENT_TYPES.PROJECT, id);

  const canViewArea = (id?: number) => can(PERMISSIONS.VIEW_AREA, CONTENT_TYPES.AREA, id);
  const canCreateArea = () => can(PERMISSIONS.ADD_AREA, CONTENT_TYPES.AREA);
  const canEditArea = (id?: number) => can(PERMISSIONS.CHANGE_AREA, CONTENT_TYPES.AREA, id);
  const canDeleteArea = (id?: number) => can(PERMISSIONS.DELETE_AREA, CONTENT_TYPES.AREA, id);

  const canViewUser = (id?: number) => can(PERMISSIONS.VIEW_USER, CONTENT_TYPES.USER, id);
  const canCreateUser = () => can(PERMISSIONS.ADD_USER, CONTENT_TYPES.USER);
  const canEditUser = (id?: number) => can(PERMISSIONS.CHANGE_USER, CONTENT_TYPES.USER, id);
  const canDeleteUser = (id?: number) => can(PERMISSIONS.DELETE_USER, CONTENT_TYPES.USER, id);

  const canViewRepository = (id?: number) => can(PERMISSIONS.VIEW_REPOSITORY, CONTENT_TYPES.REPOSITORY, id);
  const canCreateRepository = () => can(PERMISSIONS.ADD_REPOSITORY, CONTENT_TYPES.REPOSITORY);
  const canEditRepository = (id?: number) => can(PERMISSIONS.CHANGE_REPOSITORY, CONTENT_TYPES.REPOSITORY, id);
  const canDeleteRepository = (id?: number) => can(PERMISSIONS.DELETE_REPOSITORY, CONTENT_TYPES.REPOSITORY, id);

  const canViewTool = (id?: number) => can(PERMISSIONS.VIEW_TOOL, CONTENT_TYPES.TOOL, id);
  const canCreateTool = () => can(PERMISSIONS.ADD_TOOL, CONTENT_TYPES.TOOL);
  const canEditTool = (id?: number) => can(PERMISSIONS.CHANGE_TOOL, CONTENT_TYPES.TOOL, id);
  const canDeleteTool = (id?: number) => can(PERMISSIONS.DELETE_TOOL, CONTENT_TYPES.TOOL, id);

  const canManagePermissions = () => can(PERMISSIONS.CHANGE_PERMISSION, CONTENT_TYPES.PERMISSION);

  // --- Verificaciones de Permisos para Nuevas Entidades ---

  const canViewRoleType = (id?: number) => can(PERMISSIONS.VIEW_ROLETYPE, CONTENT_TYPES.ROLETYPE, id);
  const canCreateRoleType = () => can(PERMISSIONS.ADD_ROLETYPE, CONTENT_TYPES.ROLETYPE);
  const canEditRoleType = (id?: number) => can(PERMISSIONS.CHANGE_ROLETYPE, CONTENT_TYPES.ROLETYPE, id);
  const canDeleteRoleType = (id?: number) => can(PERMISSIONS.DELETE_ROLETYPE, CONTENT_TYPES.ROLETYPE, id);

  const canViewStatusType = (id?: number) => can(PERMISSIONS.VIEW_STATUSTYPE, CONTENT_TYPES.STATUSTYPE, id);
  const canCreateStatusType = () => can(PERMISSIONS.ADD_STATUSTYPE, CONTENT_TYPES.STATUSTYPE);
  const canEditStatusType = (id?: number) => can(PERMISSIONS.CHANGE_STATUSTYPE, CONTENT_TYPES.STATUSTYPE, id);
  const canDeleteStatusType = (id?: number) => can(PERMISSIONS.DELETE_STATUSTYPE, CONTENT_TYPES.STATUSTYPE, id);

  // --- Funciones de Utilidad ---

  /**
   * Verifica si el usuario tiene al menos uno de los permisos especificados.
   * @param permissionChecks - Array de funciones de verificación de permisos.
   * @returns `true` si alguna de las verificaciones de permisos es exitosa.
   */
  const canAny = (permissionChecks: (() => boolean)[]): boolean => {
    return permissionChecks.some(check => check());
  };

  /**
   * Verifica si el usuario tiene todos los permisos especificados.
   * @param permissionChecks - Array de funciones de verificación de permisos.
   * @returns `true` si todas las verificaciones de permisos son exitosas.
   */
  const canAll = (permissionChecks: (() => boolean)[]): boolean => {
    return permissionChecks.every(check => check());
  };

  /**
   * Verifica si el usuario es un administrador del sistema.
   * @returns `true` si puede gestionar permisos o crear usuarios.
   */
  const isSystemAdmin = (): boolean => {
    return canManagePermissions() || canCreateUser();
  };

  return {
    can, canAny, canAll,
    canViewProject, canCreateProject, canEditProject, canDeleteProject,
    canViewArea, canCreateArea, canEditArea, canDeleteArea,
    canViewUser, canCreateUser, canEditUser, canDeleteUser,
    canViewRepository, canCreateRepository, canEditRepository, canDeleteRepository,
    canViewTool, canCreateTool, canEditTool, canDeleteTool,
    canViewRoleType, canCreateRoleType, canEditRoleType, canDeleteRoleType,
    canViewStatusType, canCreateStatusType, canEditStatusType, canDeleteStatusType,
    canManagePermissions,
    isSystemAdmin,
    permissions,
  };
};

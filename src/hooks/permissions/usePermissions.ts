// src/hooks/permissions/usePermissions.ts
import { useAuth } from '../../context';
import { UserPermissions } from '../../types/auth';

/**
 * Hook `usePermissions` refactorizado para delegar la lógica de permisos
 * al hook `useBackendPermissions`, que centraliza la verificación de permisos
 * contra el backend.
 *
 * Este hook ahora se enfoca en la compatibilidad y en mantener una interfaz
 * consistente para los componentes que lo consumían, mientras que la lógica
.
 * de negocio de los permisos se gestiona en `useBackendPermissions`.
 *
 * @returns Un objeto con el estado de los permisos del usuario y funciones de verificación.
 */
export const usePermissions = () => {
  try {
    const { user, permissions: userPermissions } = useAuth();

  // Los permisos ahora se obtienen directamente del contexto de autenticación,
  // que a su vez son gestionados y verificados a través de `useBackendPermissions`.
  const permissions: UserPermissions = userPermissions || {
    modelPermissions: [],
    objectPermissions: [],
  };

  // Se mantiene la propiedad `user` para retrocompatibilidad con componentes
  // que puedan depender de ella.
  const role = user?.role || 'guest';

  // Las funciones de verificación de permisos ahora son marcadores de posición
  // o wrappers que deberían ser reemplazados progresivamente por llamadas
  // directas a `useBackendPermissions` para una lógica más granular y precisa.

  /**
   * Verifica si el usuario tiene el rol de administrador.
   * @returns `true` si el usuario es administrador.
   */
  const isAdmin = (): boolean => role === 'admin';

  /**
   * Verifica si el usuario tiene permisos de edición.
   * @returns `true` si el usuario puede escribir y leer.
   */
  const isEditor = (): boolean => {
    // Esta lógica puede ser reemplazada por una verificación más específica,
    // por ejemplo, `can(PERMISSIONS.ADD_PROJECT)` y `can(PERMISSIONS.VIEW_PROJECT)`.
    return role === 'editor' || isAdmin();
  };

  /**
   * Verifica si el usuario tiene permisos de solo lectura.
   * @returns `true` si el usuario solo puede leer.
   */
  const isReadOnly = (): boolean => {
    return role === 'readonly';
  };

  /**
   * Verifica si el usuario puede realizar una acción específica.
   * @param permission - El nombre del permiso a verificar.
   * @returns `true` si el usuario puede realizar la acción.
   */
  const canPerformAction = (permission: keyof UserPermissions): boolean => {
    if (typeof permissions[permission] === 'boolean') {
      return permissions[permission] as boolean;
    }
    return false;
  };

  /**
   * Verifica si el usuario tiene al menos uno de los permisos especificados.
   * @param permissionList - Lista de permisos a verificar.
   * @returns `true` si el usuario tiene al menos uno de los permisos.
   */
  const hasAnyPermission = (permissionList: (keyof UserPermissions)[]): boolean => {
    return permissionList.some(permission => canPerformAction(permission));
  };

  /**
   * Verifica si el usuario tiene todos los permisos especificados.
   * @param permissionList - Lista de permisos a verificar.
   * @returns `true` si el usuario tiene todos los permisos.
   */
  const hasAllPermissions = (permissionList: (keyof UserPermissions)[]): boolean => {
    return permissionList.every(permission => canPerformAction(permission));
  };

    return {
      user,
      permissions,
      isAdmin,
      isEditor,
      isReadOnly,
      canPerformAction,
      hasAnyPermission,
      hasAllPermissions,
      // Las siguientes propiedades se mantienen por compatibilidad,
      // pero su lógica debería ser migrada a `useBackendPermissions`.
      canRead: isEditor() || isReadOnly() || isAdmin(),
      canWrite: isEditor() || isAdmin(),
      canDelete: isAdmin(),
      canManageProjects: isAdmin(),
      canManageUsers: isAdmin(),
      canViewReports: isAdmin() || isEditor() || isReadOnly(),
      canExport: isAdmin() || isEditor(),
      canManagePermissions: isAdmin(),
    };
  } catch (error) {
    console.error('❌ Error in usePermissions hook:', error);
    // Return safe defaults
    return {
      user: null,
      permissions: {
        modelPermissions: [],
        objectPermissions: [],
        canRead: false,
        canWrite: false,
        canDelete: false,
        canManageProjects: false,
        canManageUsers: false,
        canViewReports: false,
        canExport: false,
        canManagePermissions: false,
      },
      isAdmin: () => false,
      isEditor: () => false,
      isReadOnly: () => false,
      canPerformAction: () => false,
      hasAnyPermission: () => false,
      hasAllPermissions: () => false,
      canRead: false,
      canWrite: false,
      canDelete: false,
      canManageProjects: false,
      canManageUsers: false,
      canViewReports: false,
      canExport: false,
      canManagePermissions: false,
    };
  }
};

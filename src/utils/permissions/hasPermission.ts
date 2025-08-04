// src/utils/permissions/hasPermission.ts
import { UserPermissions } from '../../types/auth';

/**
 * Verifica si el usuario tiene un permiso específico
 * @param permissions - Permisos del usuario
 * @param permission - Código del permiso a verificar
 * @param contentType - Tipo de contenido (opcional)
 * @param objectId - ID del objeto específico (opcional)
 * @returns true si el usuario tiene el permiso
 */
export const hasPermission = (
  permissions: UserPermissions,
  permission: string,
  contentType?: string,
  objectId?: number
): boolean => {
  if (!permissions) return false;

  // Verificar permisos de modelo
  if (permissions.modelPermissions) {
    const hasModelPermission = permissions.modelPermissions.some(mp => 
      mp.codename === permission && 
      (!contentType || mp.contentType === contentType)
    );
    if (hasModelPermission) return true;
  }

  // Verificar permisos de objeto específico
  if (permissions.objectPermissions && objectId) {
    const hasObjectPermission = permissions.objectPermissions.some(op => 
      op.permission.codename === permission &&
      (!contentType || op.contentType === contentType) &&
      op.objectId === objectId
    );
    if (hasObjectPermission) return true;
  }

  // Verificar permisos legacy/simples basados en el permiso solicitado
  const permissionMap: Record<string, keyof UserPermissions> = {
    'view_project': 'canRead',
    'add_project': 'canWrite',
    'change_project': 'canWrite',
    'delete_project': 'canDelete',
    'view_area': 'canRead',
    'add_area': 'canWrite',
    'change_area': 'canWrite',
    'delete_area': 'canDelete',
    'view_user': 'canManageUsers',
    'add_user': 'canManageUsers',
    'change_user': 'canManageUsers',
    'delete_user': 'canManageUsers',
    'change_permission': 'canManagePermissions',
  };

  const legacyPermission = permissionMap[permission];
  if (legacyPermission && typeof permissions[legacyPermission] === 'boolean') {
    return permissions[legacyPermission] as boolean;
  }

  return false;
};
// src/utils/permissions.ts
import { UserPermissions, ModelPermission, ObjectPermission } from '../../types/auth';

// Permission templates for different user roles
export const PERMISSION_PRESETS = {
  guest: {
    modelPermissions: [] as ModelPermission[],
    objectPermissions: [] as ObjectPermission[],
    canRead: false,
    canWrite: false,
    canDelete: false,
    canManageProjects: false,
    canManageUsers: false,
    canViewReports: false,
    canExport: false,
    canManagePermissions: false,
  },
  readonly: {
    modelPermissions: [] as ModelPermission[],
    objectPermissions: [] as ObjectPermission[],
    canRead: true,
    canWrite: false,
    canDelete: false,
    canManageProjects: false,
    canManageUsers: false,
    canViewReports: true,
    canExport: false,
    canManagePermissions: false,
  },
  editor: {
    modelPermissions: [] as ModelPermission[],
    objectPermissions: [] as ObjectPermission[],
    canRead: true,
    canWrite: true,
    canDelete: false,
    canManageProjects: false,
    canManageUsers: false,
    canViewReports: true,
    canExport: true,
    canManagePermissions: false,
  },
  projectManager: {
    modelPermissions: [] as ModelPermission[],
    objectPermissions: [] as ObjectPermission[],
    canRead: true,
    canWrite: true,
    canDelete: true,
    canManageProjects: true,
    canManageUsers: false,
    canViewReports: true,
    canExport: true,
    canManagePermissions: false,
  },
  admin: {
    modelPermissions: [] as ModelPermission[],
    objectPermissions: [] as ObjectPermission[],
    canRead: true,
    canWrite: true,
    canDelete: true,
    canManageProjects: true,
    canManageUsers: true,
    canViewReports: true,
    canExport: true,
    canManagePermissions: true,
  },
};

// Permission groups for easier management
export const PERMISSION_GROUPS = {
  content: ['canRead', 'canWrite', 'canDelete'] as const,
  projects: ['canManageProjects'] as const,
  users: ['canManageUsers', 'canManagePermissions'] as const,
  reports: ['canViewReports', 'canExport'] as const,
};

// Permission labels for UI (only for boolean permissions)
type BooleanPermissionKeys = Exclude<keyof UserPermissions, 'modelPermissions' | 'objectPermissions'>;

export const PERMISSION_LABELS: Record<BooleanPermissionKeys, string> = {
  canRead: 'Ver contenido',
  canWrite: 'Crear/Editar contenido',
  canDelete: 'Eliminar contenido',
  canManageProjects: 'Gestionar proyectos',
  canManageUsers: 'Gestionar usuarios',
  canViewReports: 'Ver reportes',
  canExport: 'Exportar datos',
  canManagePermissions: 'Gestionar permisos',
};

// Permission descriptions for UI (only for boolean permissions)
export const PERMISSION_DESCRIPTIONS: Record<BooleanPermissionKeys, string> = {
  canRead: 'Permite ver y leer todo el contenido del sistema',
  canWrite: 'Permite crear y editar contenido existente',
  canDelete: 'Permite eliminar contenido del sistema',
  canManageProjects: 'Permite crear, editar y eliminar proyectos',
  canManageUsers: 'Permite gestionar cuentas de usuario',
  canViewReports: 'Permite acceder a reportes y estadísticas',
  canExport: 'Permite exportar datos del sistema',
  canManagePermissions: 'Permite modificar permisos de otros usuarios',
};

// Utility functions
export const getPermissionsByRole = (role: string): UserPermissions => {
  switch (role.toLowerCase()) {
    case 'admin':
      return PERMISSION_PRESETS.admin;
    case 'project_manager':
    case 'projectmanager':
      return PERMISSION_PRESETS.projectManager;
    case 'editor':
      return PERMISSION_PRESETS.editor;
    case 'readonly':
    case 'viewer':
      return PERMISSION_PRESETS.readonly;
    default:
      return PERMISSION_PRESETS.guest;
  }
};

export const hasMinimumPermissions = (
  userPermissions: UserPermissions,
  requiredPermissions: Partial<UserPermissions>
): boolean => {
  return Object.entries(requiredPermissions).every(([key, required]) => {
    if (!required) return true;
    return userPermissions[key as keyof UserPermissions];
  });
};

export const getPermissionLevel = (permissions: UserPermissions): string => {
  if (permissions.canManagePermissions) return 'admin';
  if (permissions.canManageProjects) return 'project_manager';
  if (permissions.canWrite) return 'editor';
  if (permissions.canRead) return 'readonly';
  return 'guest';
};
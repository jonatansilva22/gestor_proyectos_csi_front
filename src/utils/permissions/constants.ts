// src/utils/permissions/constants.ts
// Constantes de permisos para el sistema

export const PERMISSIONS = {
  // Project permissions
  VIEW_PROJECT: 'view_project',
  ADD_PROJECT: 'add_project',
  CHANGE_PROJECT: 'change_project',
  DELETE_PROJECT: 'delete_project',

  // Area permissions
  VIEW_AREA: 'view_area',
  ADD_AREA: 'add_area',
  CHANGE_AREA: 'change_area',
  DELETE_AREA: 'delete_area',

  // User permissions
  VIEW_USER: 'view_user',
  ADD_USER: 'add_user',
  CHANGE_USER: 'change_user',
  DELETE_USER: 'delete_user',

  // Repository permissions
  VIEW_REPOSITORY: 'view_repository',
  ADD_REPOSITORY: 'add_repository',
  CHANGE_REPOSITORY: 'change_repository',
  DELETE_REPOSITORY: 'delete_repository',

  // Tool permissions
  VIEW_TOOL: 'view_tool',
  ADD_TOOL: 'add_tool',
  CHANGE_TOOL: 'change_tool',
  DELETE_TOOL: 'delete_tool',

  // Permission management
  CHANGE_PERMISSION: 'change_permission',

  // Role type permissions
  VIEW_ROLETYPE: 'view_roletype',
  ADD_ROLETYPE: 'add_roletype',
  CHANGE_ROLETYPE: 'change_roletype',
  DELETE_ROLETYPE: 'delete_roletype',

  // Status type permissions
  VIEW_STATUSTYPE: 'view_statustype',
  ADD_STATUSTYPE: 'add_statustype',
  CHANGE_STATUSTYPE: 'change_statustype',
  DELETE_STATUSTYPE: 'delete_statustype',
} as const;

export const CONTENT_TYPES = {
  PROJECT: 'project',
  AREA: 'area',
  USER: 'user',
  REPOSITORY: 'repository',
  TOOL: 'tool',
  PERMISSION: 'permission',
  ROLETYPE: 'roletype',
  STATUSTYPE: 'statustype',
} as const;

export type PermissionType = typeof PERMISSIONS[keyof typeof PERMISSIONS];
export type ContentType = typeof CONTENT_TYPES[keyof typeof CONTENT_TYPES];
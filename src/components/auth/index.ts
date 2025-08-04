// src/components/auth/index.ts
// EXPORTS de componentes relacionados con autenticación

export { default as LoginForm } from './LoginForm';
export { default as ProtectedRoute } from './ProtectedRoute';
export { PermissionGuard, ReadOnlyGuard, WriteGuard, DeleteGuard, AdminGuard, ProjectManagerGuard } from './PermissionGuard';
export { 
  BackendPermissionGuard,
  ProjectViewGuard,
  ProjectEditGuard, 
  ProjectDeleteGuard,
  ProjectCreateGuard,
  AreaViewGuard,
  AreaEditGuard,
  AreaDeleteGuard,
  AreaCreateGuard,
  UserViewGuard,
  UserEditGuard,
  UserDeleteGuard,
  UserCreateGuard,
  RepositoryViewGuard,
  RepositoryEditGuard,
  RepositoryDeleteGuard,
  RepositoryCreateGuard,
  ToolViewGuard,
  ToolEditGuard,
  ToolDeleteGuard,
  ToolCreateGuard,
  PermissionManagementGuard
} from './BackendPermissionGuard';

// src/components/auth/PermissionGuard.tsx
import React from 'react';
import { usePermissions } from '../../hooks/permissions/usePermissions';
import { UserPermissions } from '../../types/auth';

interface PermissionGuardProps {
  children: React.ReactNode;
  permission?: keyof UserPermissions;
  permissions?: (keyof UserPermissions)[];
  requireAll?: boolean;
  fallback?: React.ReactNode;
  role?: string;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  children,
  permission,
  permissions = [],
  requireAll = false,
  fallback = null,
  role,
}) => {
  const { 
    canPerformAction, 
    hasAnyPermission, 
    hasAllPermissions, 
    isAdmin 
  } = usePermissions();

  // Check role-based access
  if (role) {
    if (role === 'admin' && !isAdmin()) {
      return <>{fallback}</>;
    }
  }

  // Check single permission
  if (permission && !canPerformAction(permission)) {
    return <>{fallback}</>;
  }

  // Check multiple permissions
  if (permissions.length > 0) {
    const hasAccess = requireAll 
      ? hasAllPermissions(permissions)
      : hasAnyPermission(permissions);
    
    if (!hasAccess) {
      return <>{fallback}</>;
    }
  }

  return <>{children}</>;
};

// Specific permission guards for common use cases
export const ReadOnlyGuard: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({ children, fallback = null }) => (
  <PermissionGuard permission="canRead" fallback={fallback}>
    {children}
  </PermissionGuard>
);

export const WriteGuard: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({ children, fallback = null }) => (
  <PermissionGuard permission="canWrite" fallback={fallback}>
    {children}
  </PermissionGuard>
);

export const DeleteGuard: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({ children, fallback = null }) => (
  <PermissionGuard permission="canDelete" fallback={fallback}>
    {children}
  </PermissionGuard>
);

export const AdminGuard: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({ children, fallback = null }) => (
  <PermissionGuard role="admin" fallback={fallback}>
    {children}
  </PermissionGuard>
);

export const ProjectManagerGuard: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({ children, fallback = null }) => (
  <PermissionGuard permission="canManageProjects" fallback={fallback}>
    {children}
  </PermissionGuard>
);
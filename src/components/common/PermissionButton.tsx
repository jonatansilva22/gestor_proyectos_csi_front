// src/components/common/PermissionButton.tsx
import React from 'react';
import { usePermissions } from '../../hooks/permissions/usePermissions';
import { UserPermissions } from '../../types/auth';

interface PermissionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  permission?: keyof UserPermissions;
  permissions?: (keyof UserPermissions)[];
  requireAll?: boolean;
  role?: string;
  children: React.ReactNode;
  fallbackText?: string;
  showFallback?: boolean;
}

export const PermissionButton: React.FC<PermissionButtonProps> = ({
  permission,
  permissions = [],
  requireAll = false,
  role,
  children,
  fallbackText = 'Sin permisos',
  showFallback = false,
  disabled,
  className = '',
  ...props
}) => {
  const { 
    canPerformAction, 
    hasAnyPermission, 
    hasAllPermissions, 
    isAdmin 
  } = usePermissions();

  // Check role-based access
  if (role && role === 'admin' && !isAdmin()) {
    if (showFallback) {
      return (
        <button 
          disabled 
          className={`opacity-50 cursor-not-allowed ${className}`}
          {...props}
        >
          {fallbackText}
        </button>
      );
    }
    return null;
  }

  // Check single permission
  if (permission && !canPerformAction(permission)) {
    if (showFallback) {
      return (
        <button 
          disabled 
          className={`opacity-50 cursor-not-allowed ${className}`}
          {...props}
        >
          {fallbackText}
        </button>
      );
    }
    return null;
  }

  // Check multiple permissions
  if (permissions.length > 0) {
    const hasAccess = requireAll 
      ? hasAllPermissions(permissions)
      : hasAnyPermission(permissions);
    
    if (!hasAccess) {
      if (showFallback) {
        return (
          <button 
            disabled 
            className={`opacity-50 cursor-not-allowed ${className}`}
            {...props}
          >
            {fallbackText}
          </button>
        );
      }
      return null;
    }
  }

  return (
    <button 
      disabled={disabled}
      className={className}
      {...props}
    >
      {children}
    </button>
  );
};
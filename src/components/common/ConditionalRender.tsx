// src/components/common/ConditionalRender.tsx
// Renderizado condicional basado en permisos del usuario

import React from 'react';
import { usePermissions } from '../../hooks/permissions/usePermissions';
import { UserPermissions } from '../../types/auth';

/**
 * Props para el componente de renderizado condicional.
 */
interface ConditionalRenderProps {
  children: React.ReactNode;                    // Contenido a renderizar condicionalmente
  permission?: keyof UserPermissions;          // Permiso individual requerido
  permissions?: (keyof UserPermissions)[];     // Múltiples permisos a verificar
  requireAll?: boolean;                        // Si requiere todos los permisos o solo uno
  role?: string;                               // Rol requerido
  fallback?: React.ReactNode;                  // Contenido alternativo
  inverse?: boolean;                           // Mostrar cuando NO tenga el permiso
}

/**
 * Componente para renderizado condicional basado en permisos.
 * Muestra el contenido solo si el usuario cumple las condiciones de permisos.
 * 
 * @param children - Contenido a mostrar si cumple las condiciones
 * @param permission - Permiso individual requerido
 * @param permissions - Array de permisos a verificar
 * @param requireAll - Si requiere todos los permisos (true) o solo uno (false)
 * @param role - Rol requerido
 * @param fallback - Contenido alternativo si no cumple las condiciones
 * @param inverse - Lógica inversa (mostrar si NO tiene el permiso)
 */
export const ConditionalRender: React.FC<ConditionalRenderProps> = ({
  children,
  permission,
  permissions = [],
  requireAll = false,
  role,
  fallback = null,
  inverse = false,
}) => {
  const { 
    canPerformAction, 
    hasAnyPermission, 
    hasAllPermissions, 
    isAdmin 
  } = usePermissions();

  let hasAccess = true;

  // Verificar acceso basado en rol
  if (role) {
    if (role === 'admin') {
      hasAccess = isAdmin();
    }
  }

  // Verificar permiso individual
  if (permission && hasAccess) {
    hasAccess = canPerformAction(permission);
  }

  // Verificar múltiples permisos
  if (permissions.length > 0 && hasAccess) {
    hasAccess = requireAll 
      ? hasAllPermissions(permissions)
      : hasAnyPermission(permissions);
  }

  // Aplicar lógica inversa si se especifica
  if (inverse) {
    hasAccess = !hasAccess;
  }

  return hasAccess ? <>{children}</> : <>{fallback}</>;
};

// ========================================
// COMPONENTES ESPECÍFICOS PARA CASOS COMUNES
// ========================================

/** Mostrar contenido solo para usuarios con permisos de lectura */
export const ShowForReaders: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({ children, fallback = null }) => (
  <ConditionalRender permission="canRead" fallback={fallback}>
    {children}
  </ConditionalRender>
);

/** Mostrar contenido solo para usuarios con permisos de escritura */
export const ShowForWriters: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({ children, fallback = null }) => (
  <ConditionalRender permission="canWrite" fallback={fallback}>
    {children}
  </ConditionalRender>
);

/** Mostrar contenido solo para administradores */
export const ShowForAdmins: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({ children, fallback = null }) => (
  <ConditionalRender role="admin" fallback={fallback}>
    {children}
  </ConditionalRender>
);

/** Ocultar contenido para usuarios invitados (sin permisos de lectura) */
export const HideForGuests: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({ children, fallback = null }) => (
  <ConditionalRender permission="canRead" fallback={fallback}>
    {children}
  </ConditionalRender>
);
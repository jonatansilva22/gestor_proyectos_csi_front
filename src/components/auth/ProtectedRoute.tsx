// src/components/auth/ProtectedRoute.tsx
// Componente de ruta protegida que verifica autenticación y permisos
// Redirige a login si no está autenticado o a dashboard si no tiene permisos

import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { usePermissions } from '../../hooks/permissions/usePermissions';
import { useBackendPermissions } from '../../hooks/permissions/useBackendPermissions';
import { JSX, FC } from 'react';
import { UserPermissions } from '../../types/auth';

/**
 * Props para el componente ProtectedRoute
 */
interface ProtectedRouteProps {
  children: JSX.Element;                              // Componente hijo a renderizar si tiene acceso
  requiredPermission?: keyof UserPermissions;         // Permiso único requerido
  requiredPermissions?: (keyof UserPermissions)[];    // Lista de permisos requeridos
  requireAll?: boolean;                               // Si requiere todos los permisos o solo uno
  requiredRole?: string;                              // Rol específico requerido
}

/**
 * Componente de ruta protegida que verifica autenticación y permisos
 * antes de permitir el acceso a una página o componente
 */
const ProtectedRoute: FC<ProtectedRouteProps> = ({ 
  children, 
  requiredPermission,
  requiredPermissions = [],
  requireAll = false,
  requiredRole 
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const { canPerformAction, hasAnyPermission, hasAllPermissions, isAdmin } = usePermissions();
  const { can } = useBackendPermissions();
  const location = useLocation();

  // Mientras está verificando la autenticación, muestra un indicador de carga
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado, redirige al login
  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Verificar acceso basado en rol
  if (requiredRole) {
    if (requiredRole === 'admin' && !isAdmin()) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  // Verificar permiso único (priorizar permisos del backend)
  if (requiredPermission) {
    const hasBackendPermission = can && can(requiredPermission);
    const hasLegacyPermission = canPerformAction(requiredPermission);
    
    if (!hasBackendPermission && !hasLegacyPermission) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  // Verificar múltiples permisos
  if (requiredPermissions.length > 0) {
    const hasAccess = requireAll 
      ? hasAllPermissions(requiredPermissions)
      : hasAnyPermission(requiredPermissions);
    
    if (!hasAccess) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  // Si está autenticado y tiene permisos, renderiza el componente hijo
  return children;
};

export default ProtectedRoute;
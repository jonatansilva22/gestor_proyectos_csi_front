// src/components/common/PermissionActionButton.tsx
// Botones de acción con control de permisos integrado

import React from 'react';
import { useBackendPermissions } from '../../hooks/permissions/useBackendPermissions';

/**
 * Props para botones de acción con control de permisos.
 */
interface PermissionActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  permission: string;         // Código del permiso requerido
  contentType?: string;       // Tipo de contenido (opcional)
  objectId?: number;          // ID del objeto específico (opcional)
  children: React.ReactNode;  // Contenido del botón
  fallbackText?: string;      // Texto alternativo cuando no hay permisos
  showFallback?: boolean;     // Mostrar botón deshabilitado en lugar de ocultarlo
}

/**
 * Botón de acción que se muestra solo si el usuario tiene el permiso requerido.
 * 
 * @param permission - Código del permiso necesario para mostrar el botón
 * @param contentType - Tipo de contenido para verificación específica
 * @param objectId - ID del objeto para permisos a nivel de objeto
 * @param children - Contenido del botón
 * @param fallbackText - Texto cuando no tiene permisos
 * @param showFallback - Si mostrar el botón deshabilitado
 */
export const PermissionActionButton: React.FC<PermissionActionButtonProps> = ({
  permission,
  contentType,
  objectId,
  children,
  fallbackText = 'Sin permisos',
  showFallback = false,
  disabled,
  className = '',
  ...props
}) => {
  const { can } = useBackendPermissions();

  const hasPermission = can(permission, contentType, objectId);

  // Si no tiene permisos
  if (!hasPermission) {
    if (showFallback) {
      // Mostrar botón deshabilitado
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
    // No mostrar nada
    return null;
  }

  // Mostrar botón normal
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

// ========================================
// BOTONES ESPECÍFICOS POR TIPO DE ACCIÓN
// ========================================

/**
 * Props para botones de acción específicos de entidad.
 */
interface EntityActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  entityId?: number;         // ID de la entidad (opcional)
  children: React.ReactNode; // Contenido del botón
  showFallback?: boolean;    // Mostrar botón deshabilitado
}

/**
 * Botón para editar entidades.
 * Verifica automáticamente el permiso "change_[entityType]".
 */
export const EditButton: React.FC<EntityActionButtonProps & { entityType: string }> = ({ 
  entityType, 
  entityId, 
  children, 
  showFallback = false,
  ...props 
}) => (
  <PermissionActionButton 
    permission={`change_${entityType}`}
    contentType={entityType}
    objectId={entityId}
    showFallback={showFallback}
    {...props}
  >
    {children}
  </PermissionActionButton>
);

/**
 * Botón para eliminar entidades.
 * Verifica automáticamente el permiso "delete_[entityType]".
 */
export const DeleteButton: React.FC<EntityActionButtonProps & { entityType: string }> = ({ 
  entityType, 
  entityId, 
  children, 
  showFallback = false,
  ...props 
}) => (
  <PermissionActionButton 
    permission={`delete_${entityType}`}
    contentType={entityType}
    objectId={entityId}
    showFallback={showFallback}
    {...props}
  >
    {children}
  </PermissionActionButton>
);

/**
 * Botón para crear nuevas entidades.
 * Verifica automáticamente el permiso "add_[entityType]".
 */
export const CreateButton: React.FC<EntityActionButtonProps & { entityType: string }> = ({ 
  entityType, 
  children, 
  showFallback = false,
  ...props 
}) => (
  <PermissionActionButton 
    permission={`add_${entityType}`}
    contentType={entityType}
    showFallback={showFallback}
    {...props}
  >
    {children}
  </PermissionActionButton>
);

/**
 * Botón para ver/acceder a entidades.
 * Verifica automáticamente el permiso "view_[entityType]".
 */
export const ViewButton: React.FC<EntityActionButtonProps & { entityType: string }> = ({ 
  entityType, 
  entityId, 
  children, 
  showFallback = false,
  ...props 
}) => (
  <PermissionActionButton 
    permission={`view_${entityType}`}
    contentType={entityType}
    objectId={entityId}
    showFallback={showFallback}
    {...props}
  >
    {children}
  </PermissionActionButton>
);
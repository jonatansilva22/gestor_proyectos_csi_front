// src/services/permissions/backendPermissionsService.ts
// Servicio para manejo de permisos del backend

import api from '../api';
import {
  UserPermissionResponse,
  PermissionCheckRequest,
  PermissionAssignmentRequest,
  BulkPermissionRequest,
  Permission,
  ContentType
} from '../../types/backend-permissions';

/**
 * Servicio para manejar todas las operaciones de permisos con el backend.
 * Proporciona métodos para consultar, asignar y gestionar permisos de usuarios.
 */
class BackendPermissionsService {
  /**
   * Obtener todos los permisos de un usuario desde el backend.
   * 
   * @param userId - ID del usuario
   * @returns Respuesta con permisos de modelo y objeto del usuario
   */
  async getUserPermissions(userId: number): Promise<UserPermissionResponse> {
    try {
      const response = await api.get(`/permissions/users/${userId}/permissions/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user permissions:', error);
      throw error;
    }
  }

  /**
   * Verificar si un usuario tiene un permiso específico.
   * 
   * @param request - Solicitud de verificación de permiso
   * @returns true si el usuario tiene el permiso
   */
  async checkPermission(request: PermissionCheckRequest): Promise<boolean> {
    try {
      const response = await api.post('/permissions/check/', request);
      return response.data.has_permission;
    } catch (error) {
      console.error('Error checking permission:', error);
      return false;
    }
  }

  /**
   * Asignar un permiso a un usuario.
   * 
   * @param request - Solicitud de asignación de permiso
   */
  async assignPermission(request: PermissionAssignmentRequest): Promise<void> {
    try {
      await api.post('/permissions/assign/', request);
    } catch (error) {
      console.error('Error assigning permission:', error);
      throw error;
    }
  }

  /**
   * Remover un permiso de un usuario.
   * 
   * @param request - Solicitud de remoción de permiso
   */
  async removePermission(request: PermissionAssignmentRequest): Promise<void> {
    try {
      await api.delete('/permissions/remove/', { data: request });
    } catch (error) {
      console.error('Error removing permission:', error);
      throw error;
    }
  }

  /**
   * Realizar operaciones masivas de permisos.
   * Permite agregar o remover múltiples permisos a múltiples usuarios.
   * 
   * @param request - Solicitud de operación masiva
   */
  async bulkPermissionUpdate(request: BulkPermissionRequest): Promise<void> {
    try {
      await api.post('/permissions/bulk/', request);
    } catch (error) {
      console.error('Error in bulk permission update:', error);
      throw error;
    }
  }

  /**
   * Obtener todos los permisos disponibles en el sistema.
   * 
   * @returns Array con todos los permisos del sistema
   */
  async getAllPermissions(): Promise<Permission[]> {
    try {
      const response = await api.get('/permissions/');
      return response.data;
    } catch (error) {
      console.error('Error fetching permissions:', error);
      throw error;
    }
  }

  /**
   * Obtener todos los tipos de contenido disponibles.
   * 
   * @returns Array con todos los tipos de contenido
   */
  async getContentTypes(): Promise<ContentType[]> {
    try {
      const response = await api.get('/permissions/content-types/');
      return response.data;
    } catch (error) {
      console.error('Error fetching content types:', error);
      throw error;
    }
  }

  /**
   * Obtener permisos específicos para un tipo de contenido.
   * 
   * @param contentType - Tipo de contenido (ej: "project", "area")
   * @returns Array con permisos para el tipo de contenido especificado
   */
  async getPermissionsByContentType(contentType: string): Promise<Permission[]> {
    try {
      const response = await api.get(`/permissions/content-types/${contentType}/permissions/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching permissions for content type:', error);
      throw error;
    }
  }

  /**
   * Obtener usuarios que tienen un permiso específico.
   * 
   * @param permissionCodename - Código del permiso
   * @param contentType - Tipo de contenido (opcional)
   * @param objectId - ID del objeto (opcional)
   * @returns Array de usuarios con el permiso especificado
   */
  async getUsersWithPermission(
    permissionCodename: string,
    contentType?: string,
    objectId?: number
  ): Promise<any[]> {
    try {
      const params = new URLSearchParams({
        permission: permissionCodename,
        ...(contentType && { content_type: contentType }),
        ...(objectId && { object_id: objectId.toString() }),
      });
      
      const response = await api.get(`/permissions/users/?${params}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching users with permission:', error);
      throw error;
    }
  }

  /**
   * Clonar permisos de un usuario a otro.
   * 
   * @param fromUserId - ID del usuario origen
   * @param toUserId - ID del usuario destino
   */
  async cloneUserPermissions(fromUserId: number, toUserId: number): Promise<void> {
    try {
      await api.post('/permissions/clone/', {
        from_user: fromUserId,
        to_user: toUserId,
      });
    } catch (error) {
      console.error('Error cloning permissions:', error);
      throw error;
    }
  }

  /**
   * Obtener historial de cambios de permisos de un usuario.
   * 
   * @param userId - ID del usuario
   * @returns Array con el historial de cambios de permisos
   */
  async getPermissionHistory(userId: number): Promise<any[]> {
    try {
      const response = await api.get(`/permissions/users/${userId}/history/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching permission history:', error);
      throw error;
    }
  }

  /**
   * Exportar permisos de un usuario en formato JSON o CSV.
   * 
   * @param userId - ID del usuario
   * @param format - Formato de exportación ('json' o 'csv')
   * @returns Blob con los datos exportados
   */
  async exportUserPermissions(userId: number, format: 'json' | 'csv' = 'json'): Promise<Blob> {
    try {
      const response = await api.get(`/permissions/users/${userId}/export/`, {
        params: { format },
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      console.error('Error exporting permissions:', error);
      throw error;
    }
  }

  /**
   * Importar permisos para un usuario desde un archivo.
   * 
   * @param userId - ID del usuario
   * @param file - Archivo con los permisos a importar
   */
  async importUserPermissions(userId: number, file: File): Promise<void> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('user_id', userId.toString());
      
      await api.post('/permissions/import/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } catch (error) {
      console.error('Error importing permissions:', error);
      throw error;
    }
  }

  /**
   * Obtener todos los permisos asignados a un objeto específico.
   * 
   * @param contentType - Tipo de contenido del objeto
   * @param objectId - ID del objeto
   * @returns Array con todos los permisos del objeto
   */
  async getObjectPermissions(contentType: string, objectId: number): Promise<any[]> {
    try {
      const response = await api.get(`/permissions/objects/${contentType}/${objectId}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching object permissions:', error);
      throw error;
    }
  }

  /**
   * Establecer permisos de un usuario sobre un objeto específico.
   * 
   * @param userId - ID del usuario
   * @param contentType - Tipo de contenido del objeto
   * @param objectId - ID del objeto
   * @param permissions - Array de códigos de permisos a asignar
   */
  async setObjectPermissions(
    userId: number,
    contentType: string,
    objectId: number,
    permissions: string[]
  ): Promise<void> {
    try {
      await api.post(`/permissions/objects/${contentType}/${objectId}/`, {
        user_id: userId,
        permissions,
      });
    } catch (error) {
      console.error('Error setting object permissions:', error);
      throw error;
    }
  }
}

/**
 * Instancia única del servicio de permisos del backend.
 * Exportada para uso en toda la aplicación.
 */
export const backendPermissionsService = new BackendPermissionsService();
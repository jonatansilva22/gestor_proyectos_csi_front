// src/context/AuthContext.tsx
// src/context/AuthContext.tsx
// Contexto de autenticación con integración de permisos del backend

import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthUser } from '../types';
import { authService } from '../services';
import { storage } from '../utils/storage';
import { UserPermissions } from '../types/auth';
// import { backendPermissionsService } from '../services/permissions/backendPermissionsService';

/**
 * Interfaz del contexto de autenticación.
 * Define la estructura de datos y funciones disponibles.
 */
interface AuthContextType {
  user: AuthUser | null;                     // Usuario autenticado actual
  isAuthenticated: boolean;                  // Estado de autenticación
  isLoading: boolean;                        // Indicador de carga
  permissions: UserPermissions | null;       // Permisos del usuario del backend
  userPermissions: UserPermissions | null;   // Alias para compatibilidad
  login: (email: string, password: string, remember: boolean) => Promise<void>; // Función de login
  logout: () => Promise<void>;               // Función de logout
  refreshPermissions: () => Promise<void>;   // Actualizar permisos desde el backend
}

/**
 * Contexto de autenticación con valores por defecto.
 */
const AuthContext = createContext<AuthContextType>({
  user: null,                    // Sin usuario inicialmente
  isAuthenticated: false,        // No autenticado por defecto
  isLoading: true,              // Cargando por defecto
  permissions: null,             // Sin permisos inicialmente
  userPermissions: null,         // Sin permisos inicialmente (alias)
  login: async () => {},         // Función vacía por defecto
  logout: async () => {},        // Función vacía por defecto
  refreshPermissions: async () => {}, // Función vacía por defecto
});

/**
 * Hook para acceder al contexto de autenticación.
 * 
 * @returns Contexto de autenticación con usuario, permisos y funciones
 */
export const useAuth = () => useContext(AuthContext);

/**
 * Proveedor del contexto de autenticación.
 * Maneja el estado de autenticación y permisos del usuario.
 * 
 * @param children - Componentes hijos que tendrán acceso al contexto
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Estado del usuario autenticado
  const [user, setUser] = useState<AuthUser | null>(null);
  // Estado de carga global
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // Permisos del usuario desde el backend
  const [userPermissions, setUserPermissions] = useState<UserPermissions | null>(null);
  
  /**
   * Cargar permisos del usuario desde el backend.
   * 
   * @param userId - ID del usuario para cargar permisos
   */
  const loadUserPermissions = async (_userId: number) => {
    try {
      // Por ahora, usar permisos por defecto basados en el rol
      const defaultPermissions: UserPermissions = {
        modelPermissions: [],
        objectPermissions: [],
        canRead: true,
        canWrite: true,
        canDelete: false,
        canManageProjects: false,
        canManageUsers: false,
        canViewReports: true,
        canExport: false,
        canManagePermissions: false,
      };
      setUserPermissions(defaultPermissions);
    } catch (error) {
      console.error('Error loading user permissions:', error);
      setUserPermissions(null);
    }
  };

  /**
   * Actualizar permisos del usuario actual.
   * Útil cuando los permisos cambian dinámicamente.
   */
  const refreshPermissions = async () => {
    if (user?.id) {
      await loadUserPermissions(user.id);
    }
  };

  /**
   * Efecto para inicializar la autenticación al cargar la aplicación.
   * Verifica si hay un usuario guardado en el storage local.
   */
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedUser = storage.getUser();
        const token = storage.getToken();
        
        // Si hay usuario y token guardados, restaurar sesión
        if (storedUser && token) {
          setUser(storedUser);
          
          // Cargar permisos para el usuario restaurado
          if (storedUser.id) {
            await loadUserPermissions(storedUser.id);
          }
        }
      } catch (error) {
        console.error('Error during auth initialization:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    initAuth();
  }, []);
  
  /**
   * Función de inicio de sesión.
   * Autentica al usuario y carga sus permisos.
   * 
   * @param email - Email del usuario
   * @param password - Contraseña del usuario
   * @param remember - Si debe recordar la sesión
   */
  const login = async (email: string, password: string, remember: boolean) => {
    try {
      setIsLoading(true);
      const response = await authService.login({ email, password });
      
      // Establecer usuario autenticado
      setUser(response.user);
      storage.setToken(response.token, remember);
      storage.setUser(response.user, remember);
      
      // Cargar permisos del usuario después del login exitoso
      if (response.user.id) {
        await loadUserPermissions(response.user.id);
      }
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Función de cierre de sesión.
   * Limpia el estado del usuario y sus permisos.
   */
  const logout = async () => {
    try {
      setIsLoading(true);
      await authService.logout();
      
      // Limpiar estado y storage completamente
      setUser(null);
      setUserPermissions(null);
      storage.clearAll();
    } catch (error) {
      console.error('Error en logout:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Proveedor del contexto con todos los valores y funciones.
   */
  return (
    <AuthContext.Provider 
      value={{ 
        user,                               // Usuario autenticado
        isAuthenticated: !!user,           // Estado de autenticación
        isLoading,                          // Estado de carga
        permissions: userPermissions,       // Permisos del backend
        userPermissions,                    // Permisos del backend (alias)
        login,                              // Función de login
        logout,                             // Función de logout
        refreshPermissions                  // Actualizar permisos
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
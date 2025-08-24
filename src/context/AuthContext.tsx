// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthUser } from '../types';
import { authService } from '../services';
import { storage } from '../utils/storage';

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (identifier: string, password: string, remember: boolean) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: AuthUser) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  logout: async () => {},
  updateUser: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Verifica si hay un usuario en storage al cargar la aplicación
  useEffect(() => {
    const initAuth = () => {
      const storedUser = storage.getUser();
      const token = storage.getToken();
      
      if (storedUser && token) {
        setUser(storedUser);
      } else {
        // Sin usuario autenticado, mantener null para mostrar login
        setUser(null);
      }
      
      setIsLoading(false);
    };
    
    initAuth();
  }, []);
  
  const login = async (identifier: string, password: string, remember: boolean) => {
    try {
      setIsLoading(true);
      const response = await authService.login({ identifier, password });
      
      setUser(response.user);
      storage.setToken(response.token, remember);
      storage.setUser(response.user, remember);
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = async () => {
    try {
      setIsLoading(true);
      await authService.logout();
    } catch (error) {
      console.error('Error en logout:', error);
    } finally {
      // Limpiar estado y storage
      setUser(null);
      storage.clearAll();
      setIsLoading(false);
    }
  };

  // Permite actualizar los datos del usuario en memoria y en storage
  const updateUser = (newUser: AuthUser) => {
    setUser(newUser);
    storage.setUserAuto(newUser);
  };
  
  return (
    <AuthContext.Provider 
      value={{ 
        user,
        isAuthenticated: !!user,
        isLoading,
        login, 
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

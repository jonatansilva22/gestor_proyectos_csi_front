// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthUser } from '../types';
import { authService } from '../services';
import { storage } from '../utils/storage';

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, remember: boolean) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Verifica si hay un usuario en storage al cargar la aplicación
  useEffect(() => {
    const initAuth = async () => {
      const storedUser = storage.getUser();
      const token = storage.getToken();
      
      if (storedUser && token) {
        setUser(storedUser);
      }
      
      setIsLoading(false);
    };
    
    initAuth();
  }, []);
  
  const login = async (email: string, password: string, remember: boolean) => {
    try {
      setIsLoading(true);
      const response = await authService.login({ email, password });
      
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
      
      // Limpiar estado y storage
      setUser(null);
      storage.clearAll();
    } catch (error) {
      console.error('Error en logout:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated: !!user, 
        isLoading,
        login, 
        logout 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
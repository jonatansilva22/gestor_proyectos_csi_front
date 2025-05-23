// src/services/authService.ts
import api from './api';
import { LoginCredentials, LoginResponse } from '../types/auth';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
      const response = await api.post('/auth/login/', credentials);
      return response.data;
    } catch (error) {
      console.error('Error en servicio de autenticación:', error);
      throw error;
    }
  },
  
  logout: async (): Promise<void> => {
    try {
      await api.post('/auth/logout/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  },
  
  refreshToken: async (): Promise<LoginResponse> => {
    const response = await api.post('/auth/token/refresh/');
    return response.data;
  }
};
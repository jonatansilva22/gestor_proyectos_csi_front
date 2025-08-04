// src/services/auth/authService.ts
// Servicio de autenticación para manejo de login y logout
// Transforma las respuestas del backend y maneja errores de validación

import api from '../api';
import { LoginCredentials, LoginResponse } from '../../types';

/**
 * Transforma errores de validación del backend a formato esperado por el frontend
 * Convierte arrays de errores a strings y normaliza el formato
 */
const transformLoginErrors = (backendErrors: any) => {
  const transformedErrors: { [key: string]: string } = {};

  Object.keys(backendErrors).forEach(field => {
    const errorMessages = backendErrors[field];
    
    // Manejar formatos de error tanto array como string
    if (Array.isArray(errorMessages)) {
      transformedErrors[field] = errorMessages[0]; // Tomar primer error
    } else if (typeof errorMessages === 'string') {
      transformedErrors[field] = errorMessages;
    }
  });

  return transformedErrors;
};

/**
 * Servicio de autenticación que maneja el login y logout de usuarios
 */
export const authService = {
  /**
   * Realiza el login del usuario y transforma la respuesta del backend
   * @param credentials - Credenciales de login (email y password)
   * @returns Respuesta de login con información del usuario y token
   */
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
      // Llamada al endpoint de login del backend
      const response = await api.post('/login/', credentials);
      
      // El backend retorna { message, token }, pero el frontend espera { user, token }
      // Decodificar JWT para extraer información del usuario
      const token = response.data.token;
      const payload = JSON.parse(atob(token.split('.')[1]));
      
      const loginResponse: LoginResponse = {
        user: {
          id: payload.user_id,
          username: payload.email.split('@')[0], // Extraer username del email
          email: payload.email
        },
        token: token
      };
      
      return loginResponse;
    } catch (error: any) {
      console.error('Error en servicio de autenticación:', error);
      
      // Transformar errores de validación del backend para login
      if (error.response?.status === 400 && error.response?.data) {
        const backendErrors = error.response.data;
        const transformedError = {
          ...error,
          validationErrors: transformLoginErrors(backendErrors)
        };
        throw transformedError;
      }
      
      // Manejar 401 no autorizado con mensaje de error específico
      if (error.response?.status === 401) {
        const unauthorizedError = {
          ...error,
          message: error.response.data?.error || 'Credenciales inválidas'
        };
        throw unauthorizedError;
      }
      
      throw error;
    }
  },
  
  logout: async (): Promise<void> => {
    try {
      // TODO: Endpoint de rama LogIn del backend aún no implementado
      // await api.post('/logout/');
      console.log('Logout realizado localmente - endpoint backend no implementado');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  },
  
  refreshToken: async (): Promise<LoginResponse> => {
    // TODO: Endpoint de rama LogIn del backend para refresh token aún no implementado
    // const response = await api.post('/token/refresh/');
    // return response.data;
    throw new Error('Endpoint de refresh token aún no implementado en backend');
  }
};
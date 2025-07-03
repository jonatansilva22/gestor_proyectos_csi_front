// src/services/auth/authService.ts
import api from '../api';
import { LoginCredentials, LoginResponse } from '../../types';

// Transform backend login validation errors
// Since field names match, we only need to handle array/string conversion
const transformLoginErrors = (backendErrors: any) => {
  const transformedErrors: { [key: string]: string } = {};

  Object.keys(backendErrors).forEach(field => {
    const errorMessages = backendErrors[field];
    
    // Handle both array and string error formats
    if (Array.isArray(errorMessages)) {
      transformedErrors[field] = errorMessages[0]; // Take first error
    } else if (typeof errorMessages === 'string') {
      transformedErrors[field] = errorMessages;
    }
  });

  return transformedErrors;
};

export const authService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
      // Backend LogIn branch endpoint
      const response = await api.post('/login/', credentials);
      
      // Backend returns { message, token }, but frontend expects { user, token }
      // Parse JWT to extract user info
      const token = response.data.token;
      const payload = JSON.parse(atob(token.split('.')[1]));
      
      const loginResponse: LoginResponse = {
        user: {
          id: payload.user_id,
          username: payload.email.split('@')[0], // Extract username from email
          email: payload.email
        },
        token: token
      };
      
      return loginResponse;
    } catch (error: any) {
      console.error('Error en servicio de autenticación:', error);
      
      // Transform backend validation errors for login
      if (error.response?.status === 400 && error.response?.data) {
        const backendErrors = error.response.data;
        const transformedError = {
          ...error,
          validationErrors: transformLoginErrors(backendErrors)
        };
        throw transformedError;
      }
      
      // Handle 401 unauthorized with specific error message
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
      // TODO: Backend LogIn branch endpoint not implemented yet
      // await api.post('/logout/');
      console.log('Logout realizado localmente - endpoint backend no implementado');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  },
  
  refreshToken: async (): Promise<LoginResponse> => {
    // TODO: Backend LogIn branch endpoint for token refresh not implemented yet
    // const response = await api.post('/token/refresh/');
    // return response.data;
    throw new Error('Refresh token endpoint not implemented in backend yet');
  }
};
// src/services/api.ts
// Configuración centralizada de Axios para todas las llamadas a la API
// Incluye interceptores para autenticación automática y manejo de errores globales

import axios from 'axios';
import { storage } from '../utils/storage';

// URL base del backend configurada desde variables de entorno
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

/**
 * Instancia principal de Axios configurada para la API del backend
 * Incluye configuración base y timeout de 10 segundos
 */
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 segundos timeout
});

// Alias para usuarios (mismo endpoint que la API general)
const usersApi = api;

/**
 * Configuración de interceptores para manejo automático de autenticación y errores
 */
[api].forEach(apiInstance => {
  /**
   * Interceptor de solicitudes salientes
   * Añade automáticamente el token JWT a todas las peticiones
   */
  apiInstance.interceptors.request.use(
    (config) => {
      const token = storage.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      console.error('Error en request interceptor:', error);
      return Promise.reject(error);
    }
  );

  /**
   * Interceptor de respuestas entrantes
   * Maneja errores de autenticación y del servidor automáticamente
   */
  apiInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      console.error('Error en response:', error);
      
      // Error 401: Token inválido o expirado - redirigir al login
      if (error.response && error.response.status === 401) {
        storage.clearAll();
        window.location.href = '/';
      }
      
      // Errores del servidor (5xx) - log detallado
      if (error.response && error.response.status >= 500) {
        console.error('Error del servidor:', error.response.data);
      }
      
      return Promise.reject(error);
    }
  );
});

export default api;
export { usersApi };
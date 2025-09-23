// src/services/api.ts
import axios from 'axios';
import { storage } from '../utils/storage';

// URL unificada para el backend
const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  throw new Error('VITE_API_URL no está configurado en las variables de entorno');
}

// API unificada para todos los servicios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Accept': 'application/json',
  },
  timeout: 30000, // 30 segundos timeout para operaciones que incluyen email
  withCredentials: false, // Evitar envío de cookies en CORS
});

// Alias para usuarios (mismo endpoint)
const usersApi = api;


// Aplicar interceptors a la API unificada
[api].forEach(apiInstance => {
  // Interceptor de solicitudes
  apiInstance.interceptors.request.use(
    (config) => {
      const token = storage.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      // Establecer Content-Type correcto según el tipo de datos
      if (config.data instanceof FormData) {
        // Para FormData, dejar que el navegador establezca el Content-Type automáticamente
        // (incluye el boundary para multipart/form-data)
        delete config.headers['Content-Type'];
      } else if (!config.headers['Content-Type']) {
        // Para otros tipos de datos, establecer JSON por defecto
        config.headers['Content-Type'] = 'application/json';
      }
      
      return config;
    },
    (error) => {
      console.error('Error en request interceptor:', error);
      return Promise.reject(error);
    }
  );

  // Interceptor de respuestas
  apiInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      console.error('Error en response:', error);
      
      // Manejo específico de errores CORS/Preflight
      if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
        console.error('Error de conexión con el backend. Verifica que el servidor esté ejecutándose.');
        return Promise.reject({
          ...error,
          message: 'No se puede conectar con el servidor. Verifica que el backend esté ejecutándose.'
        });
      }
      
      if (error.response && error.response.status === 401) {
        storage.clearAll();
        window.location.href = '/';
      }
      
      if (error.response && error.response.status >= 500) {
        console.error('Error del servidor:', error.response.data);
      }
      
      return Promise.reject(error);
    }
  );
});

export default api;
export { usersApi };
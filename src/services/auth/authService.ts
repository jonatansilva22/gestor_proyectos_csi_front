// src/services/auth/authService.ts
import api from '../api';
import { toMediaUrl } from '../../utils/media';
import { LoginCredentials, LoginResponse } from '../../types';

// Transformar errores de validación de login del backend
// Como los nombres de campos coinciden, solo necesitamos manejar conversión array/string
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

export const authService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
      // Endpoint de la rama LogIn del backend
      const response = await api.post('/login/', credentials);
      
      // Backend retorna { message, token }
      const token = response.data.token;
      
      // Establecer el token en los headers para la siguiente petición
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Decodificar el JWT para obtener el user_id y posibles claims útiles
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userId = payload.user_id;

      // Intentar obtener los datos del usuario de un endpoint accesible para cualquier autenticado
      // Preferimos endpoints tipo "/auth/me/" o "/users/me/" si el backend los expone
      let userData: any = null;
      const envMe = import.meta.env.VITE_AUTH_ME_ENDPOINT as string | undefined;
      const meCandidates = envMe && envMe.trim().length > 0
        ? [envMe]
        : ['/auth/me/', '/users/me/'];
      for (const meEndpoint of meCandidates) {
        try {
          const resp = await api.get(meEndpoint);
          userData = resp.data;
          break;
        } catch (e: any) {
          // Si 404/405/Not implemented, seguimos probando; si 401/403 no abortamos aún (probamos fallback)
        }
      }

      // Fallback: usar el endpoint actual por id si los de "me" no existen
      if (!userData) {
        try {
          const userResponse = await api.get(`/create-user/${userId}/`);
          userData = userResponse.data;
        } catch (e: any) {
          // Si no podemos obtener el usuario (p.ej., 403 para colaboradores o endpoint inexistente),
          // procedemos con datos mínimos desde el JWT para no bloquear el login.
          const status = e?.response?.status;
          if (status === 403 || status === 404 || status === 405) {
            userData = {
              id: userId,
              username: payload.username ?? payload.user ?? '',
              email: payload.email ?? '',
              role: 3, // Default a Colaborador para no romper la UI
              first_name: '',
              last_name: '',
              photo: null,
            };
          } else {
            // Errores de red u otros casos deben propagarse
            throw e;
          }
        }
      }
      
      // Mapear role_id a role_name
      const getRoleName = (roleId: number) => {
        switch (roleId) {
          case 1: return 'Admin';
          case 2: return 'SuperAdmin';
          case 3: return 'Colaborador';
          default: return 'Usuario';
        }
      };
      
      const userInfo = {
        id: userData.id ?? userId,
        // Derivar username del JWT o del identifier ingresado si no viene del backend
        username: userData.username 
          ?? payload.username 
          ?? payload.user 
          ?? (credentials.identifier.includes('@') ? credentials.identifier.split('@')[0] : credentials.identifier),
        first_name: userData.first_name,
        last_name: userData.last_name,
        // Asegurar email: usa backend, luego JWT y por último el identifier si es email
        email: userData.email ?? payload.email ?? (credentials.identifier.includes('@') ? credentials.identifier : ''),
        role: userData.role ?? 3, // ID del rol desde la base de datos o default Colaborador
        role_id: userData.role ?? 3,
        role_name: getRoleName(userData.role ?? 3),
        photo: toMediaUrl(userData.photo) || undefined,
      };
      
      const loginResponse: LoginResponse = {
        user: userInfo,
        token: token
      };
      
      return loginResponse;
    } catch (error: any) {
      console.error('Error en servicio de autenticación:', error);
      
      // Manejar errores de conexión/red
      if (error.code === 'ERR_NETWORK' || error.message === 'Network Error' || 
          error.message?.includes('No se puede conectar')) {
        throw {
          ...error,
          message: 'Error de conexión. Verifica que el backend esté ejecutándose en http://localhost:8000',
          isNetworkError: true
        };
      }
      
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

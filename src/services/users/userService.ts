// src/services/users/userService.ts
import { usersApi } from '../api';
import { CreateUserRequest, User } from '../../types';
import { ROLE_MAPPING } from '../../const';

// Transformar errores de validación del backend al formato frontend
// Como los nombres de campos ya coinciden, solo necesitamos manejar conversión array/string
const transformBackendErrors = (backendErrors: any) => {
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

export const userService = {
  createUser: async (userData: CreateUserRequest): Promise<User> => {
    console.log('=== INICIO CREATE USER FRONTEND ===');
    console.log('userData recibido:', userData);
    console.log('role type:', typeof userData.role, 'value:', userData.role);
    
    try {
      // Usar FormData si hay archivo, de lo contrario JSON
      if (userData.photo) {
        console.log('--- FLUJO CON FOTO (FormData) ---');
        const formData = new FormData();
        formData.append('username', userData.username);
        formData.append('first_name', userData.first_name);
        formData.append('last_name', userData.last_name);
        formData.append('email', userData.email);
        formData.append('password', userData.password);
        formData.append('role', String(userData.role));
        formData.append('photo', userData.photo);
        
        console.log('FormData creado:');
        for (const [key, value] of formData.entries()) {
          console.log(`  ${key}:`, value instanceof File ? `File(${value.name})` : value);
        }
        
        const response = await usersApi.post('/create-user/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        
        console.log('Respuesta exitosa con foto:', response.status, response.data);
        
        return response.data;
      } else {
        console.log('--- FLUJO SIN FOTO (JSON) ---');
        // Payload JSON para usuarios sin fotos
        const payload = {
          username: userData.username,
          first_name: userData.first_name,
          last_name: userData.last_name,
          email: userData.email,
          password: userData.password,
          role: userData.role,
        };
        
        console.log('Payload JSON creado:', payload);
        console.log('role en payload - type:', typeof payload.role, 'value:', payload.role);
        
        const response = await usersApi.post('/create-user/', payload);
        console.log('Respuesta exitosa sin foto:', response.status, response.data);
        return response.data;
      }
    } catch (error: any) {
      console.error('Error creando usuario:', error);
      console.error('Detalles del error:', error.response?.data);
      console.error('Estado del error:', error.response?.status);
      
      // Transformar errores de validación del backend al formato frontend
      if (error.response?.status === 400 && error.response?.data) {
        const backendErrors = error.response.data;
        
        // Manejar errores específicos del backend
        if (backendErrors.username && backendErrors.username.includes('already exists')) {
          const transformedError = {
            ...error,
            validationErrors: { username: 'Este nombre de usuario ya está en uso. Elige otro.' }
          };
          throw transformedError;
        }
        
        if (backendErrors.email && backendErrors.email.includes('already exists')) {
          const transformedError = {
            ...error,
            validationErrors: { email: 'Este correo electrónico ya está registrado.' }
          };
          throw transformedError;
        }
        
        const transformedError = {
          ...error,
          validationErrors: transformBackendErrors(backendErrors)
        };
        throw transformedError;
      }
      
      // Manejar errores de red específicos
      if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
        const networkError = {
          ...error,
          message: 'Error de conexión. Verifica tu internet e intenta nuevamente.'
        };
        throw networkError;
      }
      
      // Manejar timeout - usuario puede haberse creado
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        const timeoutError = {
          ...error,
          message: 'Timeout: El usuario puede haberse creado correctamente. Verifica la lista de usuarios.',
          possibleSuccess: true
        };
        throw timeoutError;
      }
      
      throw error;
    }
  },

  getUsers: async (): Promise<User[]> => {
    try {
      // Endpoint de rama RamaAlanBack del backend para listar usuarios
      const response = await usersApi.get('/create-user/');
      return response.data;
    } catch (error) {
      console.error('Error obteniendo usuarios:', error);
      throw error;
    }
  },

  getUserById: async (id: number): Promise<User> => {
    try {
      // Endpoint de rama RamaAlanBack del backend para obtener usuario específico
      const response = await usersApi.get(`/create-user/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo usuario:', error);
      throw error;
    }
  },

  updateUser: async (id: number, userData: Partial<CreateUserRequest>): Promise<{ user: User; message: string }> => {
    try {
      const formData = new FormData();
      
      // Agregar solo los campos que se van a actualizar
      if (userData.username !== undefined) {
        formData.append('username', userData.username);
      }
      if (userData.first_name !== undefined) {
        formData.append('first_name', userData.first_name);
      }
      if (userData.last_name !== undefined) {
        formData.append('last_name', userData.last_name);
      }
      if (userData.email !== undefined) {
        formData.append('email', userData.email);
      }
      if (userData.password !== undefined) {
        formData.append('password', userData.password);
      }
      if (userData.role !== undefined) {
        const roleValue = typeof userData.role === 'string' 
          ? (ROLE_MAPPING[userData.role] ?? userData.role) 
          : userData.role;
        formData.append('role', String(roleValue));
      }
      
      // Agregar archivo si existe
      if (userData.photo) {
        formData.append('photo', userData.photo);
      }
      
      // Debug: log outgoing payload
      try {
        const debugEntries: Record<string, any> = {};
        formData.forEach((v, k) => {
          debugEntries[k] = v instanceof File ? `File(${v.name})` : v;
        });
        console.log('[userService.updateUser] PATCH payload for id', id, debugEntries);
      } catch {}

      // Endpoint de rama RamaAlanBack del backend para actualizar usuario
      const response = await usersApi.patch(`/create-user/${id}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error: any) {
      console.error('Error actualizando usuario:', error);
      
      // Transformar errores de validación del backend al formato frontend
      if (error.response?.status === 400 && error.response?.data) {
        const backendErrors = error.response.data;
        const transformedError = {
          ...error,
          validationErrors: transformBackendErrors(backendErrors)
        };
        throw transformedError;
      }
      
      throw error;
    }
  },

  deleteUser: async (id: number): Promise<void> => {
    try {
      // Endpoint de rama RamaAlanBack del backend para eliminar usuario
      await usersApi.delete(`/create-user/${id}/`);
    } catch (error) {
      console.error('Error eliminando usuario:', error);
      throw error;
    }
  },

  updateProfile: async (id: number, data: { 
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    role: number;
    photo?: File;
    current_password?: string;
    new_password?: string;
  }): Promise<User> => {
    console.log('=== INICIO UPDATE PROFILE ===');
    console.log('ID del usuario:', id);
    console.log('Datos a actualizar:', data);
    
    try {
      // Usar FormData si hay archivo, de lo contrario JSON
      if (data.photo) {
        console.log('--- FLUJO CON FOTO (FormData) ---');
        const formData = new FormData();
        
        // Agregar todos los campos obligatorios
        formData.append('username', data.username);
        formData.append('first_name', data.first_name);
        formData.append('last_name', data.last_name);
        formData.append('email', data.email);
        formData.append('role', data.role.toString());
        
        if (data.photo) {
          formData.append('photo', data.photo);
        }
        
        console.log('Campos agregados al FormData:');
        console.log('- username:', data.username);
        console.log('- first_name:', data.first_name);
        console.log('- last_name:', data.last_name);
        console.log('- email:', data.email);
        console.log('- role:', data.role);
        console.log('- photo:', data.photo ? `File: ${data.photo.name}` : 'No');
        
        // Add password fields if changing password
        if (data.current_password && data.new_password) {
          formData.append('current_password', data.current_password);
          formData.append('new_password', data.new_password);
        }
        
        console.log('FormData para actualización creado:');
        for (const [key, value] of formData.entries()) {
          console.log(`  ${key}:`, value instanceof File ? `File(${value.name})` : value);
        }
        
        // Usar el endpoint correcto para actualizar usuarios
        const response = await usersApi.patch(`/create-user/${id}/`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        
        console.log('Respuesta exitosa con foto:', response.status, response.data);
        return response.data;
      } else {
        console.log('--- FLUJO SIN FOTO (JSON) ---');
        console.log('Campos a actualizar sin foto:', Object.keys(data));
        // Payload JSON para actualizaciones sin fotos
        const payload: any = {};
        
        // Agregar todos los campos obligatorios
        payload.username = data.username;
        payload.first_name = data.first_name;
        payload.last_name = data.last_name;
        payload.email = data.email;
        payload.role = data.role;
        
        console.log('Campos agregados al payload:');
        console.log('- username:', data.username);
        console.log('- first_name:', data.first_name);
        console.log('- last_name:', data.last_name);
        console.log('- email:', data.email);
        console.log('- role:', data.role);
        
        // Add password fields if changing password
        if (data.current_password && data.new_password) {
          payload.current_password = data.current_password;
          payload.new_password = data.new_password;
          console.log('Agregando campos de contraseña');
        }
        
        console.log('Payload JSON final:', payload);
        console.log('Número de campos a actualizar:', Object.keys(payload).length);
        
        // Usar el endpoint correcto para actualizar usuarios
        const response = await usersApi.patch(`/create-user/${id}/`, payload);
        console.log('Respuesta exitosa sin foto:', response.status, response.data);
        return response.data;
      }
    } catch (error: any) {
      console.error('Error actualizando perfil:', error);
      console.error('Detalles del error:', error.response?.data);
      console.error('Estado del error:', error.response?.status);
      
      if (error.response?.status === 400 && error.response?.data) {
        const backendErrors = error.response.data;
        
        // Manejar errores específicos de contraseña
        if (backendErrors.current_password) {
          const transformedError = {
            ...error,
            validationErrors: { 
              current_password: 'La contraseña actual es incorrecta',
              currentPassword: 'La contraseña actual es incorrecta'
            }
          };
          throw transformedError;
        }
        
        const transformedError = {
          ...error,
          validationErrors: transformBackendErrors(backendErrors)
        };
        throw transformedError;
      }
      
      throw error;
    }
  },

  deleteUserPhoto: async (id: number): Promise<User> => {
    try {
      // Usar el endpoint correcto para actualizar usuario sin foto
      const payload = { photo: null }; // o el campo que use tu backend para eliminar la foto
      const response = await usersApi.patch(`/create-user/${id}/`, payload);
      return response.data;
    } catch (error) {
      console.error('Error eliminando foto de usuario:', error);
      throw error;
    }
  },
};

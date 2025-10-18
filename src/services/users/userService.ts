// src/services/users/userService.ts
import { usersApi } from '../api';
import { CreateUserRequest, User } from '../../types';
import { ROLE_MAPPING } from '../../const';

// Función para transformar errores del backend al formato frontend
const transformBackendErrors = (backendErrors: any) => {
  const transformedErrors: { [key: string]: string } = {};
  Object.keys(backendErrors).forEach(field => {
    const errorMessages = backendErrors[field];
    if (Array.isArray(errorMessages)) {
      transformedErrors[field] = errorMessages[0];
    } else if (typeof errorMessages === 'string') {
      transformedErrors[field] = errorMessages;
    }
  });
  return transformedErrors;
};

export const userService = {
  // -------------------------
  // Crear usuario
  // -------------------------
  createUser: async (userData: CreateUserRequest): Promise<User> => {
    try {
      if (userData.photo) {
        const formData = new FormData();
        formData.append('username', userData.username);
        formData.append('first_name', userData.first_name);
        formData.append('last_name', userData.last_name);
        formData.append('email', userData.email);
        formData.append('password', userData.password);
        formData.append('role', String(userData.role));
        formData.append('photo', userData.photo);

        const response = await usersApi.post('/create-user/', formData);
        return response.data;
      }

      // Si no hay foto
      const payload = { ...userData };
      const response = await usersApi.post('/create-user/', payload);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 400 && error.response?.data) {
        const backendErrors = error.response.data;
        if (backendErrors.username?.includes('already exists')) {
          throw { ...error, validationErrors: { username: 'Este nombre de usuario ya está en uso.' } };
        }
        if (backendErrors.email?.includes('already exists')) {
          throw { ...error, validationErrors: { email: 'Este correo electrónico ya está registrado.' } };
        }
        throw { ...error, validationErrors: transformBackendErrors(backendErrors) };
      }
      throw error;
    }
  },

  // -------------------------
  // Obtener lista de usuarios
  // -------------------------
  getUsers: async (): Promise<User[]> => {
    try {
      const response = await usersApi.get('/create-user/');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // -------------------------
  // Obtener usuario por ID
  // -------------------------
  getUserById: async (id: number): Promise<User> => {
    try {
      const response = await usersApi.get(`/create-user/${id}/`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // -------------------------
  // Actualizar usuario
  // -------------------------
  updateUser: async (id: number, userData: Partial<CreateUserRequest>): Promise<User> => {
    try {
      const formData = new FormData();

      if (userData.username !== undefined) formData.append('username', userData.username);
      if (userData.first_name !== undefined) formData.append('first_name', userData.first_name);
      if (userData.last_name !== undefined) formData.append('last_name', userData.last_name);
      if (userData.email !== undefined) formData.append('email', userData.email);
      if (userData.password !== undefined) formData.append('password', userData.password);
      if (userData.role !== undefined) {
        const roleValue = typeof userData.role === 'string'
          ? (ROLE_MAPPING[userData.role] ?? userData.role)
          : userData.role;
        formData.append('role', String(roleValue));
      }
      if (userData.photo) formData.append('photo', userData.photo);

      const response = await usersApi.patch(`/create-user/${id}/`, formData);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 400 && error.response?.data) {
        throw { ...error, validationErrors: transformBackendErrors(error.response.data) };
      }
      throw error;
    }
  },

  // -------------------------
  // Actualizar perfil (usuario actual)
  // -------------------------
  updateProfile: async (id: number, data: {
    username?: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    role?: number;
    photo?: File;
    current_password?: string;
    new_password?: string;
  }): Promise<User> => {
    try {
      const formData = new FormData();

      if (data.username !== undefined) formData.append('username', data.username);
      if (data.first_name !== undefined) formData.append('first_name', data.first_name);
      if (data.last_name !== undefined) formData.append('last_name', data.last_name);
      if (data.email !== undefined) formData.append('email', data.email);
      if (data.role !== undefined) formData.append('role', data.role.toString());
      if (data.photo) formData.append('photo', data.photo);

      if (data.current_password && data.new_password) {
        formData.append('current_password', data.current_password);
        formData.append('new_password', data.new_password);
      }

      const response = await usersApi.patch(`/create-user/${id}/`, formData);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 403) throw new Error('No tienes permisos para modificar este perfil');
      if (error.response?.status === 400 && error.response?.data) {
        const backendErrors = error.response.data;
        if (backendErrors.current_password) {
          throw { ...error, validationErrors: { current_password: 'La contraseña actual es incorrecta' } };
        }
        throw { ...error, validationErrors: transformBackendErrors(backendErrors) };
      }
      throw error;
    }
  },

  // -------------------------
  // Eliminar usuario
  // -------------------------
  deleteUser: async (id: number): Promise<void> => {
    try {
      await usersApi.delete(`/create-user/${id}/`);
    } catch (error) {
      throw error;
    }
  },

  // -------------------------
  // Eliminar foto de usuario
  // -------------------------
  deleteUserPhoto: async (id: number): Promise<User> => {
    try {
      const formData = new FormData();
      formData.append('photo', ''); // Backend debe interpretar como eliminar
      const response = await usersApi.patch(`/create-user/${id}/`, formData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // -------------------------
  // Cambiar contraseña
  // -------------------------
  changePassword: async (userId: number, data: { current_password: string; new_password: string }): Promise<{ message: string }> => {
    try {
      const payload = { current_password: data.current_password, new_password: data.new_password };
      await usersApi.patch(`/create-user/${userId}/`, payload);
      return { message: 'Contraseña actualizada correctamente' };
    } catch (error: any) {
      if (error.response?.status === 400 && error.response?.data) {
        throw { ...error, validationErrors: transformBackendErrors(error.response.data) };
      }
      throw error;
    }
  },

  // -------------------------
  // Obtener perfil de usuario
  // -------------------------
  getUserProfile: async (id: number): Promise<User> => {
    try {
      const response = await usersApi.get(`/create-user/${id}/`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 403) throw new Error('No tienes permisos para acceder a este perfil');
      if (error.response?.status === 404) throw new Error('Usuario no encontrado');
      throw error;
    }
  },
};

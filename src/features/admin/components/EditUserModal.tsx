import React, { useState, useEffect } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { Modal } from '../../../components/common/Modal';
import { User, CreateUserRequest, UserRole } from '../../../types/user';
import { useAuth } from '../../../context/AuthContext';

interface EditUserModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: number, userData: Partial<CreateUserRequest>) => Promise<void>;
  isSaving: boolean;
}

const EditUserModal: React.FC<EditUserModalProps> = ({
  user,
  isOpen,
  onClose,
  onSave,
  isSaving,
}) => {
  const { darkMode } = useTheme();
  const { user: currentUser } = useAuth();
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    role: 'colaborador' as UserRole,
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        // Mapear correctamente: 1 -> admin, 2 -> superadmin, 3 -> colaborador
        role: user.role === 2 ? 'superadmin' : user.role === 1 ? 'admin' : 'colaborador',
      });
      setErrors({});
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    // Bloquear selección de 'superadmin' desde la UI de edición
    if (name === 'role' && value === 'superadmin') {
      setErrors(prev => ({ ...prev, role: 'No está permitido asignar rol SuperAdmin desde esta pantalla.' }));
      return;
    }
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.username.trim()) {
      newErrors.username = 'El nombre de usuario es requerido';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.first_name.trim()) {
      newErrors.first_name = 'El nombre es requerido';
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = 'El apellido es requerido';
    }

    // Prevent admin from demoting themselves
    if (user && currentUser && user.id === currentUser.id && (user.role === 2 || user.role === 1) && formData.role === 'colaborador') {
      newErrors.role = 'No puedes quitarte el rol de administrador';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !validateForm()) {
      return;
    }

    try {
      await onSave(user.id, formData);
      onClose();
    } catch {
      // Error is handled by the parent component
    }
  };

  if (!isOpen || !user) return null;

  const isCurrentUser = currentUser && user.id === currentUser.id;

  return (
    <Modal open={isOpen} onClose={onClose} title="Editar Usuario" size="md">
      {/* Form */}
      <form onSubmit={handleSubmit} className="px-2 sm:px-0 py-2">
          <div className="space-y-4">
            {/* Username */}
            <div>
              <label className={`block text-sm font-medium mb-1 ${
                darkMode ? 'text-white' : 'text-gray-700'
              }`}>
                Nombre de usuario <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-xl transition-colors focus:ring-2 focus:ring-purple-400 ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-purple-400'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500'
                } ${errors.username ? 'border-red-500' : ''}`}
                placeholder="Ingresa el nombre de usuario"
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">{errors.username}</p>
              )}
            </div>

              {/* Email */}
              <div>
                <label className={`block text-sm font-medium mb-1 ${
                  darkMode ? 'text-white' : 'text-gray-700'
                }`}>
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-xl transition-colors focus:ring-2 focus:ring-purple-400 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-purple-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500'
                  } ${errors.email ? 'border-red-500' : ''}`}
                  placeholder="Ingresa el email"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              {/* First Name */}
              <div>
                <label className={`block text-sm font-medium mb-1 ${
                  darkMode ? 'text-white' : 'text-gray-700'
                }`}>
                  Nombre <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-xl transition-colors focus:ring-2 focus:ring-purple-400 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-purple-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500'
                  } ${errors.first_name ? 'border-red-500' : ''}`}
                  placeholder="Ingresa el nombre"
                />
                {errors.first_name && (
                  <p className="text-red-500 text-sm mt-1">{errors.first_name}</p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label className={`block text-sm font-medium mb-1 ${
                  darkMode ? 'text-white' : 'text-gray-700'
                }`}>
                  Apellido <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-xl transition-colors focus:ring-2 focus:ring-purple-400 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-purple-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500'
                  } ${errors.last_name ? 'border-red-500' : ''}`}
                  placeholder="Ingresa el apellido"
                />
                {errors.last_name && (
                  <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>
                )}
              </div>

              {/* Role */}
              <div>
                <label className={`block text-sm font-medium mb-1 ${
                  darkMode ? 'text-white' : 'text-gray-700'
                }`}>
                  Rol <span className="text-red-500">*</span>
                </label>
                {(() => {
                  // Construir opciones sin SuperAdmin por defecto
                  const isEditingSuperAdmin = user?.role === 2;
                  const disableRoleChange = isEditingSuperAdmin; // si es superadmin, no permitir cambiar rol
                  return (
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      disabled={disableRoleChange}
                      className={`w-full px-3 py-2 border rounded-xl transition-colors focus:ring-2 focus:ring-purple-400 ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white focus:border-purple-400'
                          : 'bg-white border-gray-300 text-gray-900 focus:border-purple-500'
                      } ${errors.role ? 'border-red-500' : ''} ${disableRoleChange ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      {/* Si el usuario es superadmin, mostrar opción bloqueada para conservar visualización */}
                      {isEditingSuperAdmin && (
                        <option value="superadmin" disabled>
                          Superadministrador
                        </option>
                      )}
                      <option value="admin">Administrador</option>
                      <option value="colaborador">Colaborador</option>
                    </select>
                  );
                })()}
                {errors.role && (
                  <p className="text-red-500 text-sm mt-1">{errors.role}</p>
                )}
                {isCurrentUser && (formData.role === 'admin' || formData.role === 'superadmin') && (
                  <p className={`text-sm mt-1 ${
                    darkMode ? 'text-gray-300' : 'text-yellow-600'
                  }`}>
                    Este es tu usuario actual con rol de administrador
                  </p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className={`flex items-center justify-end gap-3 pt-6 mt-6 border-t ${
              darkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <button
                type="button"
                onClick={onClose}
                disabled={isSaving}
                className={`px-4 py-2 rounded-xl font-semibold transition-colors ${
                  darkMode 
                    ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                }`}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Guardando...
                  </div>
                ) : (
                  'Guardar cambios'
                )}
              </button>
            </div>
          </form>
    </Modal>
  );
};

export default EditUserModal;

import React, { useState, useEffect } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { Modal } from '../../../components/common/Modal';
import { User, CreateUserRequest, UserRole } from '../../../types/user';
import { useAuth } from '../../../context/AuthContext';
import { FileUpload } from '../../../components/common/FileUpload';
import UserAvatar from '../../../components/common/UserAvatar';
import { toast } from 'react-toastify';

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
    password: '',
    confirmPassword: '',
    photo: undefined as File | undefined,
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        // Mapear correctamente: 1 -> admin, 2 -> superadmin, 3 -> colaborador
        role: user.role === 2 ? 'superadmin' : user.role === 1 ? 'admin' : 'colaborador',
        password: '', // Siempre vacío inicialmente
        confirmPassword: '', // Siempre vacío inicialmente
        photo: undefined,
      });
      setErrors({});
      setShowPassword(false);
      setShowConfirmPassword(false);
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    // Bloquear selección de 'superadmin' desde la UI de edición
    if (name === 'role' && value === 'superadmin') {
      setErrors(prev => ({ ...prev, role: 'No está permitido asignar rol SuperAdmin desde esta pantalla.' }));
      return;
    }
    
    // Si se está borrando la contraseña, también limpiar la confirmación
    if (name === 'password' && !value.trim()) {
      setFormData(prev => ({ ...prev, [name]: value, confirmPassword: '' }));
      setErrors(prev => ({ ...prev, [name]: '', confirmPassword: '' }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
      // Clear error when user starts typing
      if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: '' }));
      }
    }
  };

  const handleFileSelect = (file: File | null) => {
    setFormData(prev => ({ ...prev, photo: file || undefined }));
    
    // Clear photo error if exists
    if (errors.photo) {
      setErrors(prev => ({ ...prev, photo: '' }));
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
      toast.error('Por favor, ingresa un correo o usuario válido');
      newErrors.email = 'Por favor, ingresa un correo o usuario válido';
    }

    if (!formData.first_name.trim()) {
      newErrors.first_name = 'El nombre es requerido';
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = 'El apellido es requerido';
    }

    // Validar contraseña solo si se proporciona
    if (formData.password && formData.password.trim()) {
      if (formData.password.length < 8) {
        newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
      }
      
      // Validar confirmación de contraseña si se proporciona una nueva contraseña
      if (!formData.confirmPassword.trim()) {
        newErrors.confirmPassword = 'Debes confirmar la nueva contraseña';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Las contraseñas no coinciden';
      }
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

  if (!user || !validateForm()) return;

  try {
    const roleMap: Record<UserRole, number> = {
      colaborador: 0,
      admin: 1,
      superadmin: 2,
    };

    // Construir objeto parcial solo con los campos necesarios
    const dataToSend: Partial<CreateUserRequest> = {
      username: formData.username,
      email: formData.email,
      first_name: formData.first_name,
      last_name: formData.last_name,
      role: roleMap[formData.role],
      ...(formData.password?.trim() ? { password: formData.password } : {}),
      ...(formData.photo ? { photo: formData.photo } : {}),
    };

    await onSave(user.id, dataToSend);
    onClose();
  } catch {
    // el error se maneja desde el componente padre
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

              {/* Password */}
              <div className="relative">
                <label className={`block text-sm font-medium mb-1 ${
                  darkMode ? 'text-white' : 'text-gray-700'
                }`}>
                  Nueva Contraseña (Opcional)
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 pr-12 border rounded-xl transition-colors focus:ring-2 focus:ring-purple-400 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-purple-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500'
                  } ${errors.password ? 'border-red-500' : ''}`}
                  placeholder="Deja vacío para mantener la contraseña actual"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-3 top-8 text-gray-500 hover:text-gray-700 focus:outline-none ${
                    darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464m1.414 1.414L21.75 21.75m-12.606-12.606L6.637 6.637m0 0a9.97 9.97 0 00-3.172 4.638c0 .887.157 1.739.449 2.527m2.723-7.165a9.97 9.97 0 00-2.723 7.165m9.896-3.172L19.07 8.464m-9.896 3.172a3 3 0 003.172 3.172M9.174 11.828a3 3 0 003.172-3.172" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
                <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Por seguridad, las contraseñas no se muestran. Ingresa una nueva solo si deseas cambiarla.
                </p>
              </div>

              {/* Confirm Password - Solo aparece si se escribió en el campo de contraseña */}
              {formData.password && formData.password.trim() && (
                <div className="relative">
                  <label className={`block text-sm font-medium mb-1 ${
                    darkMode ? 'text-white' : 'text-gray-700'
                  }`}>
                    Confirmar Nueva Contraseña <span className="text-red-500">*</span>
                  </label>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 pr-12 border rounded-xl transition-colors focus:ring-2 focus:ring-purple-400 ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-purple-400'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500'
                    } ${errors.confirmPassword ? 'border-red-500' : ''}`}
                    placeholder="Confirma la nueva contraseña"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className={`absolute right-3 top-8 text-gray-500 hover:text-gray-700 focus:outline-none ${
                      darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {showConfirmPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464m1.414 1.414L21.75 21.75m-12.606-12.606L6.637 6.637m0 0a9.97 9.97 0 00-3.172 4.638c0 .887.157 1.739.449 2.527m2.723-7.165a9.97 9.97 0 00-2.723 7.165m9.896-3.172L19.07 8.464m-9.896 3.172a3 3 0 003.172 3.172M9.174 11.828a3 3 0 003.172-3.172" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                  )}
                </div>
              )}

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

              {/* Avatar and Photo Upload */}
              <div>
                <label className={`block text-sm font-medium mb-3 ${
                  darkMode ? 'text-white' : 'text-gray-700'
                }`}>
                  Foto del Usuario
                </label>
                <div className="flex items-center gap-4 mb-3">
                  {user && (
                    <UserAvatar
                      user={{
                        first_name: user.first_name || '',
                        last_name: user.last_name || '',
                        photo: user.photo
                      }}
                      size="medium"
                    />
                  )}
                  <div className="flex-1">
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Foto actual del usuario
                    </p>
                  </div>
                </div>
                <FileUpload
                  label="Cambiar foto (Opcional)"
                  onFileSelect={handleFileSelect}
                  required={false}
                  error={errors.photo}
                />
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

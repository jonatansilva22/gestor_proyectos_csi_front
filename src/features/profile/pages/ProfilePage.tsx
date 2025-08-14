import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useTheme } from '../../../context/ThemeContext';
import HeaderSidebarLayout from '../../../components/common/HeaderSidebarLayout';
import { userService } from '../../../services/users/userService';
import { notifySuccess, notifyError, notifyInfo } from '../../../components/common/ToastNotify';
import { toMediaUrl } from '../../../utils/media';

const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { darkMode } = useTheme();
  
  // Debug: Log user data
  console.log('Usuario actual en ProfilePage:', user);
  console.log('ID del usuario:', user?.id);
  
  const [formData, setFormData] = useState({
    firstName: user?.first_name || '',
    lastName: user?.last_name || '',
    email: user?.email || '',
    photo: undefined as File | undefined,
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPhoto, setCurrentPhoto] = useState<string | null>(null);
  
  // Inicializar la foto actual desde el usuario autenticado
  useEffect(() => {
    if (user?.photo) {
      setCurrentPhoto(toMediaUrl(user.photo));
    } else {
      setCurrentPhoto(null);
    }
  }, [user?.photo]);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [passwordErrors, setPasswordErrors] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear password errors when user starts typing
    if (name in passwordErrors && passwordErrors[name as keyof typeof passwordErrors]) {
      setPasswordErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileSelect = (file: File | null) => {
    setFormData(prev => ({ ...prev, photo: file || undefined }));
  };

  const handleDeletePhoto = async () => {
    try {
      if (user?.id) {
        const updated = await userService.deleteUserPhoto(user.id);
        // Actualizar contexto y estado con la respuesta del backend
        updateUser({
          id: updated.id,
          username: updated.username,
          first_name: updated.first_name,
          last_name: updated.last_name,
          email: updated.email,
          role: updated.role,
          role_id: (updated as any).role_id ?? updated.role,
          role_name: (updated as any).role_name,
          photo: updated.photo,
        } as any);
        setCurrentPhoto(toMediaUrl(updated.photo) || null);
        setFormData(prev => ({ ...prev, photo: undefined }));
        notifySuccess('Foto eliminada correctamente');
      }
    } catch (error) {
      notifyError('Error al eliminar la foto');
    }
  };

  const validatePasswordForm = () => {
    const newErrors = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    };

    const isChangingPassword = formData.newPassword || formData.confirmPassword || formData.currentPassword;
    
    if (isChangingPassword) {
      if (!formData.currentPassword) {
        newErrors.currentPassword = 'La contraseña actual es requerida';
      }

      if (!formData.newPassword) {
        newErrors.newPassword = 'La nueva contraseña es requerida';
      } else if (formData.newPassword.length < 8) {
        newErrors.newPassword = 'La contraseña debe tener al menos 8 caracteres';
      }

      if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Las contraseñas no coinciden';
      }
    }

    setPasswordErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePasswordForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log('=== INICIO SUBMIT ===');
      console.log('Usuario completo:', user);
      console.log('ID del usuario:', user?.id);
      console.log('Datos del formulario:', formData);
      
      if (!user?.id) {
        console.error('No hay ID de usuario disponible');
        notifyError('No se pudo identificar el usuario. ID: ' + user?.id);
        return;
      }
      
      // El backend requiere todos los campos obligatorios, no solo los que cambian
      const updateData: {
        username: string;
        first_name: string;
        last_name: string;
        email: string;
        role: number;
        photo?: File;
        current_password?: string;
        new_password?: string;
      } = {
        // Campos obligatorios: mantener valores actuales
        username: user.username,
        first_name: formData.firstName.trim(),
        last_name: formData.lastName.trim(),
        email: user.email,
        role: user.role || 3, // Default a colaborador si no tiene rol
      };
      
      // Verificar si hay cambios en los datos del perfil
      const originalFirstName = user.first_name || '';
      const originalLastName = user.last_name || '';
      
      const hasProfileChanges = 
        formData.firstName.trim() !== originalFirstName ||
        formData.lastName.trim() !== originalLastName ||
        formData.photo !== undefined;
      
      const hasPasswordChange = formData.newPassword && formData.currentPassword;
      
      if (hasProfileChanges) {
        console.log(`Cambios en perfil detectados:`);
        if (formData.firstName.trim() !== originalFirstName) {
          console.log(`- Nombre: "${originalFirstName}" → "${formData.firstName.trim()}"`);
        }
        if (formData.lastName.trim() !== originalLastName) {
          console.log(`- Apellido: "${originalLastName}" → "${formData.lastName.trim()}"`);
        }
        if (formData.photo) {
          console.log(`- Nueva foto: ${formData.photo.name}`);
          updateData.photo = formData.photo;
        }
      }
      
      if (hasPasswordChange) {
        updateData.current_password = formData.currentPassword;
        updateData.new_password = formData.newPassword;
        console.log('Cambio de contraseña solicitado');
      }
      
      // Verificar si hay algo que actualizar
      if (!hasProfileChanges && !hasPasswordChange) {
        notifyInfo('No hay cambios que guardar');
        return;
      }
      
      console.log('Datos finales a enviar:', {
        ...updateData,
        photo: updateData.photo ? `File: ${updateData.photo.name}` : 'No photo',
        current_password: updateData.current_password ? '***' : undefined,
        new_password: updateData.new_password ? '***' : undefined
      });
      
      console.log('Enviando al userService.updateProfile...');
      console.log('- User ID:', user.id);
      console.log('- Update Data:', updateData);
      
      const updatedUser = await userService.updateProfile(user.id, updateData);
      
      console.log('=== RESPUESTA EXITOSA ===');
      console.log('Usuario actualizado:', updatedUser);
      
      // Actualizar AuthContext y storage con los nuevos datos del usuario
      if (updatedUser) {
        // Mapear respuesta del backend al tipo AuthUser
        const nextUser = {
          id: updatedUser.id,
          username: updatedUser.username,
          first_name: updatedUser.first_name,
          last_name: updatedUser.last_name,
          email: updatedUser.email,
          role: updatedUser.role,
          role_id: updatedUser.role_id ?? updatedUser.role,
          role_name: updatedUser.role_name,
        } as any;
        updateUser(nextUser);
      }
      
      // If a new photo was uploaded, use the server URL from response
      if (formData.photo) {
        setCurrentPhoto(toMediaUrl((updatedUser as any).photo) || null);
        setFormData(prev => ({ ...prev, photo: undefined }));
      }
      
      // Clear password fields if they were used
      if (formData.newPassword) {
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
        notifySuccess('Perfil y contraseña actualizados correctamente');
      } else {
        notifySuccess('Perfil actualizado correctamente');
      }
    } catch (error: any) {
      console.error('Error completo:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      if (error.validationErrors) {
        console.log('Errores de validación:', error.validationErrors);
        // Handle validation errors from backend
        Object.keys(error.validationErrors).forEach(field => {
          if (field.includes('password') || field === 'current_password' || field === 'currentPassword') {
            setPasswordErrors(prev => ({
              ...prev,
              [field === 'current_password' ? 'currentPassword' : field]: error.validationErrors[field]
            }));
          }
        });
        notifyError('Por favor corrige los errores en el formulario');
      } else if (error.response?.status === 400) {
        const errorData = error.response.data;
        console.log('Datos del error 400:', errorData);
        
        // Manejar errores específicos del backend
        if (errorData.current_password) {
          setPasswordErrors(prev => ({
            ...prev,
            currentPassword: Array.isArray(errorData.current_password) 
              ? errorData.current_password[0] 
              : errorData.current_password
          }));
        }
        if (errorData.new_password) {
          setPasswordErrors(prev => ({
            ...prev,
            newPassword: Array.isArray(errorData.new_password) 
              ? errorData.new_password[0] 
              : errorData.new_password
          }));
        }
        
        notifyError('Por favor corrige los errores en el formulario');
      } else {
        notifyError(`Error al actualizar el perfil: ${error.message || 'Error desconocido'}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const getUserInitials = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
    }
    if (user?.username) {
      return user.username.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  return (
    <HeaderSidebarLayout headerTitle="Perfil de Usuario">
      <div className={`max-w-4xl mx-auto p-6 min-h-screen transition-colors ${
        darkMode ? 'bg-[#1A0F30]' : 'bg-slate-100'
      }`}>
        {/* Header Section */}
        <div className="bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 rounded-3xl p-8 mb-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-white/5 backdrop-blur-sm" />
          <div className="relative z-10 flex items-center gap-6">
            <div className="relative w-20 h-20 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20 group">
              {currentPhoto || formData.photo ? (
                <img 
                  src={formData.photo ? URL.createObjectURL(formData.photo) : currentPhoto || ''} 
                  alt="Profile" 
                  className="w-16 h-16 rounded-xl object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                  {getUserInitials()}
                </div>
              )}
              
              {/* Photo action buttons */}
              <div className="absolute -bottom-2 -right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {(currentPhoto || formData.photo) && (
                  <button
                    type="button"
                    onClick={handleDeletePhoto}
                    className="w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs transition-colors"
                    title="Eliminar foto"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-white text-3xl font-bold mb-2">
                {user?.first_name && user?.last_name 
                  ? `${user.first_name} ${user.last_name}` 
                  : user?.username || 'Usuario'
                }
              </h1>
              <p className="text-purple-100 text-lg opacity-90 mb-4">{user?.email}</p>
              
              {/* Botones de foto como en la imagen */}
              <div className="flex gap-3">
                {(currentPhoto || formData.photo) && (
                  <button
                    type="button"
                    onClick={handleDeletePhoto}
                    className="px-4 py-2 bg-transparent border border-white/30 text-white text-sm rounded-lg hover:bg-white/10 transition-colors"
                  >
                    Eliminar foto
                  </button>
                )}
                <label className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg cursor-pointer transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileSelect(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                  Editar foto
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className={`rounded-2xl shadow-lg border overflow-hidden ${
          darkMode 
            ? 'bg-[#3A2B5A] border-purple-700/30 shadow-purple-900/20' 
            : 'bg-white border-gray-100'
        }`}>
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex-1">
                  <label className={`block font-semibold mb-1 ${
                    darkMode ? 'text-purple-200' : 'text-gray-700'
                  }`}>
                    Nombre <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    className={`w-full border rounded px-3 py-2 transition-colors ${
                      darkMode 
                        ? 'bg-[#3A2B5A] border-purple-600/50 text-white placeholder-gray-400 focus:border-purple-500'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500'
                    }`}
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="Ingresa tu nombre"
                    required
                  />
                </div>
                
                <div className="flex-1">
                  <label className={`block font-semibold mb-1 ${
                    darkMode ? 'text-purple-200' : 'text-gray-700'
                  }`}>
                    Apellido <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    className={`w-full border rounded px-3 py-2 transition-colors ${
                      darkMode 
                        ? 'bg-[#3A2B5A] border-purple-600/50 text-white placeholder-gray-400 focus:border-purple-500'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500'
                    }`}
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Ingresa tu apellido"
                    required
                  />
                </div>
              </div>

              <div className="flex-1">
                <label className={`block font-semibold mb-1 ${
                  darkMode ? 'text-purple-200' : 'text-gray-700'
                }`}>
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  name="email"
                  className={`w-full border rounded px-3 py-2 ${
                    darkMode 
                      ? 'bg-purple-800/30 border-purple-600/40 text-purple-200'
                      : 'bg-gray-100 border-gray-300 text-gray-700'
                  }`}
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="correo@ejemplo.com"
                  disabled
                />
                <p className={`text-sm mt-1 ${
                  darkMode ? 'text-purple-300' : 'text-gray-500'
                }`}>El correo electrónico no se puede modificar por razones de seguridad</p>
              </div>

              {/* Password Change Section */}
              <div className={`mt-8 p-6 rounded-xl border ${
                darkMode 
                  ? 'bg-purple-900/20 border-purple-700/30'
                  : 'bg-purple-50 border-purple-200'
              }`}>
                <h3 className={`text-lg font-semibold mb-4 ${
                  darkMode ? 'text-purple-200' : 'text-gray-900'
                }`}>Cambiar Contraseña</h3>
                
                <div className="space-y-4">
                  <div className="relative">
                    <label className={`block font-semibold mb-1 ${
                      darkMode ? 'text-purple-200' : 'text-gray-700'
                    }`}>
                      Contraseña actual
                    </label>
                    <input
                      type={showPasswords.current ? "text" : "password"}
                      name="currentPassword"
                      className={`w-full border rounded px-3 py-2 pr-10 transition-colors ${
                        darkMode 
                          ? `bg-[#3A2B5A] border-purple-600/50 text-white placeholder-gray-400 focus:border-purple-500 ${
                              passwordErrors.currentPassword ? 'border-red-500' : ''
                            }`
                          : `bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500 ${
                              passwordErrors.currentPassword ? 'border-red-500' : ''
                            }`
                      }`}
                      value={formData.currentPassword}
                      onChange={handleInputChange}
                      placeholder="Ingresa tu contraseña actual"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                      onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                    >
                      {showPasswords.current ? (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                    {passwordErrors.currentPassword && (
                      <p className="text-red-500 text-sm mt-1">{passwordErrors.currentPassword}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                      <label className={`block font-semibold mb-1 ${
                        darkMode ? 'text-purple-200' : 'text-gray-700'
                      }`}>
                        Nueva contraseña
                      </label>
                      <input
                        type={showPasswords.new ? "text" : "password"}
                        name="newPassword"
                        className={`w-full border rounded px-3 py-2 pr-10 transition-colors ${
                          darkMode 
                            ? `bg-[#3A2B5A] border-purple-600/50 text-white placeholder-gray-400 focus:border-purple-500 ${
                                passwordErrors.newPassword ? 'border-red-500' : ''
                              }`
                            : `bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500 ${
                                passwordErrors.newPassword ? 'border-red-500' : ''
                              }`
                        }`}
                        value={formData.newPassword}
                        onChange={handleInputChange}
                        placeholder="Nueva contraseña"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                        onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                      >
                        {showPasswords.new ? (
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                      {passwordErrors.newPassword && (
                        <p className="text-red-500 text-sm mt-1">{passwordErrors.newPassword}</p>
                      )}
                    </div>

                    <div className="relative">
                      <label className={`block font-semibold mb-1 ${
                        darkMode ? 'text-purple-200' : 'text-gray-700'
                      }`}>
                        Confirmar contraseña
                      </label>
                      <input
                        type={showPasswords.confirm ? "text" : "password"}
                        name="confirmPassword"
                        className={`w-full border rounded px-3 py-2 pr-10 transition-colors ${
                          darkMode 
                            ? `bg-[#3A2B5A] border-purple-600/50 text-white placeholder-gray-400 focus:border-purple-500 ${
                                passwordErrors.confirmPassword ? 'border-red-500' : ''
                              }`
                            : `bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500 ${
                                passwordErrors.confirmPassword ? 'border-red-500' : ''
                              }`
                        }`}
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="Confirmar contraseña"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                        onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                      >
                        {showPasswords.confirm ? (
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                      {passwordErrors.confirmPassword && (
                        <p className="text-red-500 text-sm mt-1">{passwordErrors.confirmPassword}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>


              {/* Status Badge */}
              <div className={`flex items-center gap-3 p-4 rounded-xl border ${
                darkMode 
                  ? 'bg-purple-900/20 border-purple-600/30'
                  : 'bg-purple-50 border-purple-200'
              }`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  darkMode 
                    ? 'bg-purple-700/40 text-purple-300'
                    : 'bg-purple-100 text-purple-600'
                }`}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className={`font-semibold text-sm ${
                    darkMode ? 'text-purple-200' : 'text-purple-900'
                  }`}>Cuenta verificada</p>
                  <p className={`text-xs ${
                    darkMode ? 'text-purple-300' : 'text-purple-700'
                  }`}>Tu cuenta está activa y verificada</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className={`flex items-center justify-end gap-4 pt-6 border-t ${
                darkMode ? 'border-purple-700/30' : 'border-gray-100'
              }`}>
                <button
                  type="button"
                  className={`px-6 py-3 font-semibold transition-colors ${
                    darkMode 
                      ? 'text-purple-300 hover:text-purple-200'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                  onClick={() => window.history.back()}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-8 py-3 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${
                    darkMode
                      ? 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 shadow-purple-900/30'
                      : 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800'
                  }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Guardando...
                    </div>
                  ) : (
                    'Guardar cambios'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Account Information */}
        <div className={`mt-8 rounded-2xl shadow-lg border overflow-hidden ${
          darkMode 
            ? 'bg-[#3A2B5A] border-purple-700/30 shadow-purple-900/20' 
            : 'bg-white border-gray-100'
        }`}>
          <div className="p-8">
            <h3 className={`text-xl font-bold mb-6 ${
              darkMode ? 'text-purple-200' : 'text-gray-900'
            }`}>Información de la cuenta</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className={`p-4 rounded-xl ${
                darkMode 
                  ? 'bg-purple-800/20 border border-purple-700/30'
                  : 'bg-gray-50'
              }`}>
                <p className={`text-sm font-medium mb-1 ${
                  darkMode ? 'text-purple-300' : 'text-gray-600'
                }`}>Rol</p>
                <p className={`font-semibold ${
                  darkMode ? 'text-purple-200' : 'text-gray-900'
                }`}>{user?.role_name || 'Usuario'}</p>
              </div>
              <div className={`p-4 rounded-xl ${
                darkMode 
                  ? 'bg-purple-800/20 border border-purple-700/30'
                  : 'bg-gray-50'
              }`}>
                <p className={`text-sm font-medium mb-1 ${
                  darkMode ? 'text-purple-300' : 'text-gray-600'
                }`}>Estado</p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <p className={`font-semibold ${
                    darkMode ? 'text-purple-200' : 'text-gray-900'
                  }`}>Activo</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </HeaderSidebarLayout>
  );
};

export default ProfilePage;

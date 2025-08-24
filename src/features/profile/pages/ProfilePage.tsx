import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useTheme } from '../../../context/ThemeContext';
import HeaderSidebarLayout from '../../../components/common/HeaderSidebarLayout';
import { userService } from '../../../services/users/userService';
import { notifySuccess, notifyError, notifyInfo } from '../../../components/common/ToastNotify';
import { ConfirmModal } from '../../../components/common/ConfirmModal';
import { SuccessModal } from '../../../components/common/SuccessModal';
import UserAvatar from '../../../components/common/UserAvatar';
import { toMediaUrl } from '../../../utils/media';

const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { darkMode } = useTheme();
  
  // Debug: Log user data
  console.log('Usuario actual en ProfilePage:', user);
  console.log('ID del usuario:', user?.id);
  
  const [formData, setFormData] = useState({
    username: user?.username || '',
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

  // Actualizar formData cuando el usuario cambie
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      username: user?.username || '',
      firstName: user?.first_name || '',
      lastName: user?.last_name || '',
      email: user?.email || ''
    }));
  }, [user?.username, user?.first_name, user?.last_name, user?.email]);
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
  const [profileErrors, setProfileErrors] = useState({
    username: '',
    firstName: '',
    lastName: ''
  });

  // Modals state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [confirmDescription, setConfirmDescription] = useState<React.ReactNode>(null);
  const [pendingUpdate, setPendingUpdate] = useState<{ updateData: any, hasPasswordChange: boolean } | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear password errors when user starts typing
    if (name in passwordErrors && passwordErrors[name as keyof typeof passwordErrors]) {
      setPasswordErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // Real-time validation for username
    if (name === 'username') {
      const usernameRegex = /^[a-zA-Z0-9._-]{3,50}$/;
      if (value.length > 0 && !usernameRegex.test(value)) {
        setProfileErrors(prev => ({ 
          ...prev, 
          username: 'Formato inválido: 3-50 caracteres, solo letras, números, puntos, guiones y guiones bajos' 
        }));
      } else {
        setProfileErrors(prev => ({ ...prev, username: '' }));
      }
    } else if (name in profileErrors && profileErrors[name as keyof typeof profileErrors]) {
      setProfileErrors(prev => ({ ...prev, [name]: '' } as any));
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
      } else if (!/[A-Z]/.test(formData.newPassword)) {
        newErrors.newPassword = 'Debe contener al menos una letra mayúscula';
      } else if (!/[a-z]/.test(formData.newPassword)) {
        newErrors.newPassword = 'Debe contener al menos una letra minúscula';
      } else if (!/[0-9]/.test(formData.newPassword)) {
        newErrors.newPassword = 'Debe contener al menos un número';
      } else if (!/[^A-Za-z0-9]/.test(formData.newPassword)) {
        newErrors.newPassword = 'Debe contener al menos un carácter especial';
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
    
    // Construir payload condicional
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
      
      // Enviar solo campos modificados para evitar validaciones innecesarias
      const updateData: any = {};
      
      // Verificar si hay cambios en los datos del perfil
      const originalUsername = user.username || '';
      const originalFirstName = user.first_name || '';
      const originalLastName = user.last_name || '';
      
      const hasProfileChanges = 
        formData.username.trim() !== originalUsername ||
        formData.firstName.trim() !== originalFirstName ||
        formData.lastName.trim() !== originalLastName ||
        formData.photo !== undefined;
      
      const hasPasswordChange = !!(formData.newPassword && formData.currentPassword);
      
      if (hasProfileChanges) {
        console.log(`Cambios en perfil detectados:`);
        if (formData.username.trim() !== originalUsername) {
          console.log(`- Username: "${originalUsername}" -> "${formData.username.trim()}"`);
          updateData.username = formData.username.trim();
        }
        if (formData.firstName.trim() !== originalFirstName) {
          console.log(`- Nombre: "${originalFirstName}" -> "${formData.firstName.trim()}"`);
          updateData.first_name = formData.firstName.trim();
        }
        if (formData.lastName.trim() !== originalLastName) {
          console.log(`- Apellido: "${originalLastName}" -> "${formData.lastName.trim()}"`);
          updateData.last_name = formData.lastName.trim();
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

      // Armar descripción para confirmación
      const lines: React.ReactNode[] = [];
      if (updateData.username) lines.push(<li key="un">Nombre de Usuario: {originalUsername} &rarr; {updateData.username}</li>);
      if (updateData.first_name) lines.push(<li key="fn">Nombre: {originalFirstName} &rarr; {updateData.first_name}</li>);
      if (updateData.last_name) lines.push(<li key="ln">Apellido: {originalLastName} &rarr; {updateData.last_name}</li>);
      if (updateData.photo) lines.push(<li key="ph">Se actualizará la foto de perfil</li>);
      if (hasPasswordChange) lines.push(<li key="pw">Se cambiará la contraseña</li>);
      setConfirmDescription(
        <div>
          <p className="mb-2">Confirma los cambios a aplicar:</p>
          <ul className="list-disc pl-5 space-y-1">{lines}</ul>
        </div>
      );
      // Guardar payload pendiente en estado para confirmar
      setPendingUpdate({ updateData, hasPasswordChange });
      setConfirmOpen(true);
    } catch (error: any) {
      console.error('Error en handleSubmit:', error);
      notifyError('Error al procesar los datos del formulario');
    }
  };

  const executeUpdate = async () => {
    const stored = pendingUpdate;
    const updateData = stored?.updateData || {};
    const hasPasswordChange = stored?.hasPasswordChange || false;
    setConfirmOpen(false);
    setIsSubmitting(true);

    try {
      console.log('Datos finales a enviar:', {
        ...updateData,
        photo: updateData.photo ? `File: ${updateData.photo.name}` : 'No photo',
        current_password: updateData.current_password ? '***' : undefined,
        new_password: updateData.new_password ? '***' : undefined
      });
      
      console.log('Enviando al userService.updateProfile...');
      console.log('- User ID:', user?.id);
      console.log('- Update Data:', updateData);
      
      const updatedUser = await userService.updateProfile(user!.id, updateData);
      
      console.log('=== RESPUESTA EXITOSA ===');
      console.log('Usuario actualizado:', updatedUser);
      
      // Actualizar AuthContext y storage con los nuevos datos del usuario
      if (updatedUser) {
        // Mapear respuesta del backend al tipo AuthUser, preservando información del rol
        const nextUser: any = {
          ...user, // Mantener todos los campos existentes como base
          // Solo actualizar campos que se devolvieron del backend
          id: updatedUser.id,
          username: updatedUser.username,
          first_name: updatedUser.first_name,
          last_name: updatedUser.last_name,
          email: updatedUser.email,
          photo: updatedUser.photo,
          // Información del rol - usar datos del backend si están disponibles, sino preservar
          role: updatedUser.role || user?.role,
          role_id: updatedUser.role || user?.role_id || user?.role,
          role_name: updatedUser.role_name || user?.role_name,
        };
        
        console.log('=== ACTUALIZACIÓN DE USUARIO ===');
        console.log('Usuario anterior:', user);
        console.log('Datos del backend:', updatedUser);
        console.log('Usuario final:', nextUser);
        
        updateUser(nextUser);
      }
      
      // If a new photo was uploaded, use the server URL from response
      if (formData.photo) {
        setCurrentPhoto(toMediaUrl((updatedUser as any).photo) || null);
        setFormData(prev => ({ ...prev, photo: undefined }));
      }
      
      // Clear password fields if they were used
      if (hasPasswordChange) {
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
        setSuccessOpen(true);
        notifySuccess('Perfil y contraseña actualizados correctamente');
      } else {
        setSuccessOpen(true);
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
            const msg = Array.isArray(error.validationErrors[field]) ? error.validationErrors[field][0] : error.validationErrors[field];
            if (msg) notifyError(String(msg));
          } else if (field === 'username') {
            setProfileErrors(prev => ({ ...prev, username: error.validationErrors[field] }));
            const msg = Array.isArray(error.validationErrors[field]) ? error.validationErrors[field][0] : error.validationErrors[field];
            if (msg) notifyError(String(msg));
          } else if (field === 'first_name') {
            setProfileErrors(prev => ({ ...prev, firstName: error.validationErrors[field] }));
            const msg = Array.isArray(error.validationErrors[field]) ? error.validationErrors[field][0] : error.validationErrors[field];
            if (msg) notifyError(String(msg));
          } else if (field === 'last_name') {
            setProfileErrors(prev => ({ ...prev, lastName: error.validationErrors[field] }));
            const msg = Array.isArray(error.validationErrors[field]) ? error.validationErrors[field][0] : error.validationErrors[field];
            if (msg) notifyError(String(msg));
          }
        });
        // ya se mostraron mensajes específicos
      } else if (error.message && error.message.includes('permisos')) {
        // Error de permisos (403)
        notifyError(error.message);
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
          const msg = Array.isArray(errorData.current_password) ? errorData.current_password[0] : errorData.current_password;
          if (msg) notifyError(String(msg));
        }
        if (errorData.new_password) {
          setPasswordErrors(prev => ({
            ...prev,
            newPassword: Array.isArray(errorData.new_password) 
              ? errorData.new_password[0] 
              : errorData.new_password
          }));
          const msg = Array.isArray(errorData.new_password) ? errorData.new_password[0] : errorData.new_password;
          if (msg) notifyError(String(msg));
        }
        if (errorData.username) {
          setProfileErrors(prev => ({
            ...prev,
            username: Array.isArray(errorData.username)
              ? errorData.username[0]
              : errorData.username
          }));
          const msg = Array.isArray(errorData.username) ? errorData.username[0] : errorData.username;
          if (msg) notifyError(String(msg));
        }
        if (errorData.first_name) {
          setProfileErrors(prev => ({
            ...prev,
            firstName: Array.isArray(errorData.first_name)
              ? errorData.first_name[0]
              : errorData.first_name
          }));
          const msg = Array.isArray(errorData.first_name) ? errorData.first_name[0] : errorData.first_name;
          if (msg) notifyError(String(msg));
        }
        if (errorData.last_name) {
          setProfileErrors(prev => ({
            ...prev,
            lastName: Array.isArray(errorData.last_name)
              ? errorData.last_name[0]
              : errorData.last_name
          }));
          const msg = Array.isArray(errorData.last_name) ? errorData.last_name[0] : errorData.last_name;
          if (msg) notifyError(String(msg));
        }
        // mensajes específicos mostrados arriba
      } else {
        notifyError(`Error al actualizar el perfil: ${error.message || 'Error desconocido'}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <HeaderSidebarLayout headerTitle="Perfil de Usuario">
      {/* Confirm and Success Modals */}
      <ConfirmModal
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={executeUpdate}
        title="Confirmar actualización de perfil"
        description={confirmDescription}
        confirmLabel="Aplicar cambios"
      />
      <SuccessModal
        open={successOpen}
        onClose={() => setSuccessOpen(false)}
        title="Cambios guardados"
        message={<div>Se guardaron correctamente los cambios de tu perfil.</div>}
      />
      <div className={`max-w-4xl mx-auto p-6 min-h-screen transition-colors ${
        darkMode ? 'bg-[#1A0F30]' : 'bg-slate-100'
      }`}>
        {/* Header Section */}
        <div className="bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 rounded-3xl p-8 mb-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-white/5 backdrop-blur-sm" />
          <div className="relative z-10 flex items-center gap-6">
            <div className="relative group">
              {formData.photo ? (
                <img 
                  src={URL.createObjectURL(formData.photo)} 
                  alt="Profile" 
                  className="w-20 h-20 rounded-2xl object-cover border border-white/20 bg-white/15 backdrop-blur-sm"
                />
              ) : user ? (
                <UserAvatar
                  user={{
                    first_name: user.first_name || '',
                    last_name: user.last_name || '',
                    photo: user.photo
                  }}
                  size="large"
                  className="border border-white/20 bg-white/15 backdrop-blur-sm"
                />
              ) : null}
              
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
              {/* Username Field */}
              <div className="flex-1">
                <label className={`block font-semibold mb-1 ${
                  darkMode ? 'text-purple-200' : 'text-gray-700'
                }`}>
                  Nombre de Usuario <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="username"
                  className={`w-full border rounded px-3 py-2 transition-colors ${
                    darkMode 
                      ? 'bg-[#3A2B5A] border-purple-600/50 text-white placeholder-gray-400 focus:border-purple-500'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500'
                  }`}
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Ingresa tu nombre de usuario"
                  pattern="^[a-zA-Z0-9._-]{3,50}$"
                  title="3-50 caracteres: letras, números, puntos, guiones y guiones bajos"
                  required
                />
                {profileErrors.username && (
                  <p className="text-red-500 text-sm mt-1">{profileErrors.username}</p>
                )}
                <p className={`text-xs mt-1 ${
                  darkMode ? 'text-purple-300' : 'text-gray-500'
                }`}>Cambiar tu nombre de usuario puede afectar tu forma de iniciar sesión</p>
              </div>
              
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
                  {profileErrors.firstName && (
                    <p className="text-red-500 text-sm mt-1">{profileErrors.firstName}</p>
                  )}
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
                  {profileErrors.lastName && (
                    <p className="text-red-500 text-sm mt-1">{profileErrors.lastName}</p>
                  )}
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

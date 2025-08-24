import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/users/userService';
import { ConfirmModal } from './ConfirmModal';
import { SuccessModal } from './SuccessModal';
import { notifySuccess, notifyError } from './ToastNotify';

interface ChangePasswordProps {
  onBack: () => void;
}

const ChangePassword: React.FC<ChangePasswordProps> = ({ onBack }) => {
  const { isDarkMode } = useTheme();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    };

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

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu nueva contraseña';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (!user?.id) {
      notifyError('No se pudo identificar el usuario');
      return;
    }
    setConfirmOpen(true);
  };

  const executeChange = async () => {
    setConfirmOpen(false);
    try {
      await userService.changePassword(user!.id, {
        current_password: formData.currentPassword,
        new_password: formData.newPassword,
      });
      setSuccessOpen(true);
      notifySuccess('Contraseña actualizada correctamente');
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setErrors({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      const backend = error?.validationErrors || error?.response?.data || {};
      const newErrors = { currentPassword: '', newPassword: '', confirmPassword: '' } as typeof errors;
      let shownSpecific = false;
      if (backend.current_password) {
        const msg = Array.isArray(backend.current_password) ? backend.current_password[0] : backend.current_password;
        newErrors.currentPassword = msg;
        notifyError(msg);
        shownSpecific = true;
      }
      if (backend.new_password) {
        const msg = Array.isArray(backend.new_password) ? backend.new_password[0] : backend.new_password;
        newErrors.newPassword = msg;
        notifyError(msg);
        shownSpecific = true;
      }
      setErrors(newErrors);
      if (!shownSpecific) {
        notifyError('No se pudo actualizar la contraseña. Revisa los datos.');
      }
    }
  };

  return (
    <div className={`relative min-h-full ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 to-gray-800' 
        : 'bg-gradient-to-br from-blue-50/30 to-white'
    }`}>
      <ConfirmModal
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={executeChange}
        title="Confirmar cambio de contraseña"
        description={<div>
          <p className="mb-2">Se va a cambiar tu contraseña. ¿Deseas continuar?</p>
          <ul className="list-disc pl-5 text-sm">
            <li>Debe tener al menos 8 caracteres</li>
            <li>Incluir mayúsculas, minúsculas, números y un caracter especial</li>
          </ul>
        </div>}
        confirmLabel="Cambiar contraseña"
      />
      <SuccessModal
        open={successOpen}
        onClose={() => setSuccessOpen(false)}
        title="Contraseña actualizada"
        message={<div>Tu contraseña se cambió correctamente.</div>}
      />
      {/* Enhanced Header with Navigation */}
      <div className={`sticky top-0 z-10 backdrop-blur-sm border-b px-8 py-4 ${
        isDarkMode 
          ? 'bg-gray-800/95 border-gray-700/50' 
          : 'bg-white/95 border-gray-200/50'
      }`}>
        <div className="flex items-center gap-4 max-w-6xl mx-auto">
          <button
            onClick={onBack}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 transform hover:scale-105 ${
              isDarkMode 
                ? 'bg-gray-700 hover:bg-gray-600' 
                : 'bg-blue-100 hover:bg-blue-200'
            }`}
            aria-label="Volver"
          >
            <svg className={`w-5 h-5 ${
              isDarkMode ? 'text-blue-400' : 'text-blue-700'
            }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h2 className={`text-xl font-bold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>Seguridad</h2>
            <p className={`text-sm ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>Cambia tu contraseña de acceso</p>
          </div>
        </div>
      </div>

      <div className="px-8 py-8 max-w-4xl mx-auto">

        {/* Enhanced Security Form */}
        <div className={`rounded-3xl shadow-xl border overflow-hidden ${
          isDarkMode 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-100'
        }`}>
          <div className={`px-8 py-6 ${
            isDarkMode 
              ? 'bg-gradient-to-r from-gray-700 to-gray-600/50' 
              : 'bg-gradient-to-r from-blue-50 to-blue-100/50'
          }`}>
            <h3 className={`text-lg font-bold mb-2 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>Cambiar Contraseña</h3>
            <p className={`text-sm ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>Mantén tu cuenta segura actualizando tu contraseña</p>
          </div>
          
          <form onSubmit={handleSubmit} className="px-8 py-8">
            <div className="space-y-6">
              {/* Current Password */}
              <div className="space-y-2">
                <label className={`block text-sm font-semibold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Contraseña Actual *
                </label>
                <div className="relative">
                  <input
                    type="password"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                    placeholder="Introduce tu contraseña actual"
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 ${
                      isDarkMode 
                        ? errors.currentPassword
                          ? 'text-white bg-red-900/20 border-red-500/50 focus:ring-red-500 focus:border-red-500'
                          : 'text-white bg-gray-700 border-gray-600 focus:ring-blue-500 focus:border-blue-500'
                        : errors.currentPassword 
                          ? 'text-gray-900 border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50' 
                          : 'text-gray-900 bg-gray-50 border-gray-200 focus:ring-blue-500 focus:border-blue-500'
                    }`}
                    required
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <svg className={`w-4 h-4 ${
                      isDarkMode ? 'text-gray-500' : 'text-gray-400'
                    }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                </div>
                {errors.currentPassword && (
                  <p className="text-red-600 text-sm flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {errors.currentPassword}
                  </p>
                )}
              </div>

              {/* New Password */}
              <div className="space-y-2">
                <label className={`block text-sm font-semibold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Nueva Contraseña *
                </label>
                <div className="relative">
                  <input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    placeholder="Crea una nueva contraseña segura"
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 ${
                      isDarkMode 
                        ? errors.newPassword
                          ? 'text-white bg-red-900/20 border-red-500/50 focus:ring-red-500 focus:border-red-500'
                          : 'text-white bg-gray-700 border-gray-600 focus:ring-blue-500 focus:border-blue-500'
                        : errors.newPassword 
                          ? 'text-gray-900 border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50' 
                          : 'text-gray-900 bg-gray-50 border-gray-200 focus:ring-blue-500 focus:border-blue-500'
                    }`}
                    required
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <svg className={`w-4 h-4 ${
                      isDarkMode ? 'text-gray-500' : 'text-gray-400'
                    }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                </div>
                {errors.newPassword && (
                  <p className="text-red-600 text-sm flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {errors.newPassword}
                  </p>
                )}
                <div className={`text-xs p-3 rounded-lg ${
                  isDarkMode 
                    ? 'text-gray-300 bg-gray-700' 
                    : 'text-gray-600 bg-gray-50'
                }`}>
                  <p className="font-semibold mb-1">Requisitos de contraseña:</p>
                  <ul className="space-y-1">
                    <li className={`flex items-center gap-1 ${
                      formData.newPassword.length >= 8 
                        ? isDarkMode ? 'text-green-400' : 'text-green-600'
                        : isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Mínimo 8 caracteres
                    </li>
                  </ul>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label className={`block text-sm font-semibold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Confirmar Nueva Contraseña *
                </label>
                <div className="relative">
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Repite la nueva contraseña"
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 ${
                      isDarkMode 
                        ? errors.confirmPassword
                          ? 'text-white bg-red-900/20 border-red-500/50 focus:ring-red-500 focus:border-red-500'
                          : 'text-white bg-gray-700 border-gray-600 focus:ring-blue-500 focus:border-blue-500'
                        : errors.confirmPassword 
                          ? 'text-gray-900 border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50' 
                          : 'text-gray-900 bg-gray-50 border-gray-200 focus:ring-blue-500 focus:border-blue-500'
                    }`}
                    required
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <svg className={`w-4 h-4 ${
                      isDarkMode ? 'text-gray-500' : 'text-gray-400'
                    }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                    </svg>
                  </div>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-600 text-sm flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className={`flex flex-col sm:flex-row gap-4 pt-8 mt-8 border-t ${
              isDarkMode ? 'border-gray-700' : 'border-gray-100'
            }`}>
              <button
                type="button"
                onClick={onBack}
                className={`px-6 py-3 border-2 font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 ${
                  isDarkMode 
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-gray-500' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                }`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Cancelar
              </button>
              <button
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg flex-1 sm:flex-none"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                </svg>
                Actualizar Contraseña
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;

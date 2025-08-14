import React, { useState } from 'react';
import HeaderSidebarLayout from '../../../components/common/HeaderSidebarLayout';
import { useTheme } from '../../../context/ThemeContext';
// import { FormInput } from '../../components/common/FormInput';
import { notifySuccess, notifyError } from '../../../components/common/ToastNotify';

const PasswordPage: React.FC = () => {
  const { darkMode } = useTheme();
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
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear errors when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
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
    }

    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      notifySuccess('Contraseña actualizada correctamente');
      
      // Reset form
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      notifyError('Error al actualizar la contraseña');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, label: '', color: '' };
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    if (strength <= 2) return { strength, label: 'Débil', color: 'bg-red-500' };
    if (strength <= 3) return { strength, label: 'Regular', color: 'bg-yellow-500' };
    if (strength <= 4) return { strength, label: 'Buena', color: 'bg-blue-500' };
    return { strength, label: 'Excelente', color: 'bg-green-500' };
  };

  const passwordStrength = getPasswordStrength(formData.newPassword);

  return (
    <HeaderSidebarLayout headerTitle="Cambiar Contraseña">
      <div className={`max-w-4xl mx-auto p-6 min-h-screen transition-colors ${
        darkMode ? 'bg-[#1A0F30]' : 'bg-slate-100'
      }`}>
        {/* Header Section */}
        <div className="bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 rounded-3xl p-8 mb-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-white/5 backdrop-blur-sm" />
          <div className="relative z-10 flex items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20">
              <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div className="flex-1">
              <h1 className="text-white text-3xl font-bold mb-2">Cambiar Contraseña</h1>
              <p className="text-purple-100 text-lg opacity-90">Actualiza tu contraseña de acceso de forma segura</p>
            </div>
          </div>
        </div>

        {/* Security Tips */}
        <div className={`rounded-2xl p-6 mb-8 transition-colors ${
          darkMode 
            ? 'bg-[#3A2B5A] border border-purple-700/30 shadow-lg shadow-purple-900/20' 
            : 'bg-purple-50 border border-purple-200'
        }`}>
          <div className="flex items-start gap-4">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
              darkMode ? 'bg-purple-600/20 text-purple-400' : 'bg-purple-100 text-purple-600'
            }`}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className={`font-semibold mb-2 ${
                darkMode ? 'text-purple-100' : 'text-purple-900'
              }`}>Consejos de seguridad</h3>
              <ul className={`text-sm space-y-1 ${
                darkMode ? 'text-purple-200' : 'text-purple-800'
              }`}>
                <li>• Usa al menos 8 caracteres</li>
                <li>• Combina letras mayúsculas y minúsculas</li>
                <li>• Incluye números y símbolos</li>
                <li>• Evita información personal</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className={`rounded-2xl shadow-lg border overflow-hidden transition-colors ${
          darkMode 
            ? 'bg-[#3A2B5A] border-purple-700/30 shadow-purple-900/20' 
            : 'bg-white border-gray-100'
        }`}>
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <div className="flex-1">
                  <label className={`block font-semibold mb-1 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Contraseña actual <span className="text-red-500">*</span>
                  </label>
                  <input
                    type={showPasswords.current ? "text" : "password"}
                    name="currentPassword"
                    className={`w-full border rounded px-3 py-2 pr-10 transition-colors ${
                      darkMode 
                        ? `bg-[#3A2B5A] border-purple-600/50 text-white placeholder-gray-400 focus:border-purple-500 ${
                            errors.currentPassword ? 'border-red-500' : ''
                          }`
                        : `bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500 ${
                            errors.currentPassword ? 'border-red-500' : ''
                          }`
                    }`}
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                    placeholder="Ingresa tu contraseña actual"
                    required
                  />
                  {errors.currentPassword && (
                    <p className="text-red-500 text-sm mt-1">{errors.currentPassword}</p>
                  )}
                </div>
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
              </div>

              <div className="relative">
                <div className="flex-1">
                  <label className={`block font-semibold mb-1 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Nueva contraseña <span className="text-red-500">*</span>
                  </label>
                  <input
                    type={showPasswords.new ? "text" : "password"}
                    name="newPassword"
                    className={`w-full border rounded px-3 py-2 pr-10 transition-colors ${
                      darkMode 
                        ? `bg-[#3A2B5A] border-purple-600/50 text-white placeholder-gray-400 focus:border-purple-500 ${
                            errors.newPassword ? 'border-red-500' : ''
                          }`
                        : `bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500 ${
                            errors.newPassword ? 'border-red-500' : ''
                          }`
                    }`}
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    placeholder="Ingresa tu nueva contraseña"
                    required
                  />
                  {errors.newPassword && (
                    <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
                  )}
                </div>
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
                
                {/* Password Strength Indicator */}
                {formData.newPassword && (
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${
                        darkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>Seguridad de la contraseña</span>
                      <span className={`text-sm font-semibold ${
                        passwordStrength.strength <= 2 ? 'text-red-600' :
                        passwordStrength.strength <= 3 ? 'text-yellow-600' :
                        passwordStrength.strength <= 4 ? 'text-purple-600' : 'text-green-600'
                      }`}>
                        {passwordStrength.label}
                      </span>
                    </div>
                    <div className={`w-full rounded-full h-2 ${
                      darkMode ? 'bg-gray-600' : 'bg-gray-200'
                    }`}>
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                        style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="relative">
                <div className="flex-1">
                  <label className={`block font-semibold mb-1 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Confirmar nueva contraseña <span className="text-red-500">*</span>
                  </label>
                  <input
                    type={showPasswords.confirm ? "text" : "password"}
                    name="confirmPassword"
                    className={`w-full border rounded px-3 py-2 pr-10 transition-colors ${
                      darkMode 
                        ? `bg-[#3A2B5A] border-purple-600/50 text-white placeholder-gray-400 focus:border-purple-500 ${
                            errors.confirmPassword ? 'border-red-500' : ''
                          }`
                        : `bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500 ${
                            errors.confirmPassword ? 'border-red-500' : ''
                          }`
                    }`}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirma tu nueva contraseña"
                    required
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                  )}
                </div>
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
              </div>

              {/* Action Buttons */}
              <div className={`flex items-center justify-end gap-4 pt-6 border-t ${
                darkMode ? 'border-purple-600/30' : 'border-gray-100'
              }`}>
                <button
                  type="button"
                  className={`px-6 py-3 font-semibold transition-colors ${
                    darkMode 
                      ? 'text-gray-300 hover:text-white'
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
                      Actualizando...
                    </div>
                  ) : (
                    'Actualizar contraseña'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </HeaderSidebarLayout>
  );
};

export default PasswordPage;

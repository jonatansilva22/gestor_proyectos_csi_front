import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { validateLoginForm } from '../../utils/validation';
import { useValidationErrors } from '../../hooks/useValidationErrors';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { errors, clearErrors, clearFieldError, handleApiError, setBackendErrors } = useValidationErrors();
  const { login, isLoading } = useAuth();
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();

    // Validación del frontend usando reglas del backend
    const validationResult = validateLoginForm({ email, password });
    
    if (!validationResult.isValid) {
      // Usar el manejador de errores de validación para validación del frontend
      setBackendErrors(validationResult.errors);
      return;
    }

    try {
      await login(email, password, rememberMe);
      navigate('/create-user'); // Redirección corregida según CLAUDE.md
    } catch (error: any) {
      // Manejo mejorado de errores con soporte para validación del backend
      handleApiError(error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={`${darkMode ? 'bg-[#3A2864]' : 'bg-white'} p-6 border-t ${darkMode ? 'border-[#6F43D6]/20' : 'border-gray-200'}`}>
      <h2
        className={`text-center text-2xl font-bold mb-6 ${
          darkMode ? 'text-white' : 'text-[#000000]'
        }`}
      >
        Iniciar Sesión
      </h2>

      {(errors.general || errors.email || errors.password) && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm shadow-sm">
          {errors.general || 'Por favor corrige los errores en el formulario'}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* --- Campo Email --- */}
        <div className="mb-4">
          <label
            className={`block text-sm font-medium mb-2 ${
              darkMode ? 'text-gray-300' : 'text-[#494949]'
            }`}
          >
            Correo
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
              {/* Icono email */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-[#6F43D6]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                // Limpiar error de email cuando el usuario comienza a escribir
                clearFieldError('email');
              }}
              placeholder="user@email.com"
              required
              className={`w-full py-2 pl-10 pr-3 border rounded-md shadow-sm focus:ring-[#6F43D6] focus:border-[#6F43D6] focus:outline-none
                ${errors.email ? 'border-red-500' : ''}
                ${
                  darkMode
                    ? 'bg-[#FFFFFF] border-gray-700 text-gray-900 placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              disabled={isLoading}
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        {/* --- Campo Contraseña --- */}
        <div className="mb-4">
          <label
            className={`block text-sm font-medium mb-2 ${
              darkMode ? 'text-gray-300' : 'text-[#494949]'
            }`}
          >
            Contraseña
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-[#6F43D6]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                // Limpiar error de contraseña cuando el usuario comienza a escribir
                clearFieldError('password');
              }}
              placeholder="******************"
              required
              className={`w-full py-2 pl-10 pr-10 border rounded-md shadow-sm focus:ring-[#6F43D6] focus:border-[#6F43D6] focus:outline-none
                ${errors.password ? 'border-red-500' : ''}
                ${
                  darkMode
                    ? 'bg-[#FFFFFF] border-gray-700 text-gray-900 placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 flex items-center pr-3"
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-[#6F43D6]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-[#6F43D6]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
          )}
        </div>

        {/* --- Recordarme --- */}
        <div className="mb-6">
          <label className="flex items-center cursor-pointer">
            <div className="relative flex items-center">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="sr-only"
                disabled={isLoading}
              />
              <div
                className={`w-4 h-4 border rounded ${
                  rememberMe
                    ? darkMode
                      ? 'bg-black border-black'
                      : 'bg-[#6F43D6] border-[#6F43D6]'
                    : darkMode
                    ? 'border-gray-600'
                    : 'border-gray-400'
                }`}
              >
                {rememberMe && (
                  <svg
                    className="w-4 h-4 text-white fill-current"
                    viewBox="0 0 20 20"
                  >
                    <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                  </svg>
                )}
              </div>
              <span
                className={`ml-2 text-sm ${
                  darkMode ? 'text-gray-300' : 'text-[#494949]'
                }`}
              >
                Recuérdame
              </span>
            </div>
          </label>
        </div>

        {/* --- Botón Enviar --- */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 px-4 bg-[#6F43D6] hover:bg-[#5F36C4] text-white font-medium rounded-md shadow-md
            focus:outline-none transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Accediendo...' : 'Acceder'}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
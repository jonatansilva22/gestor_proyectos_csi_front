import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Por favor, complete todos los campos');
      return;
    }

    try {
      await login(email, password, rememberMe);
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error en login:', error);
      setError(
        'Credenciales incorrectas. Por favor, verifique su email y contraseña.'
      );
    }
  };

  return (
    <div className={`${darkMode ? 'bg-[#3A2864]' : 'bg-white'} p-6`}>
      <h2
        className={`text-center text-2xl font-bold mb-6 ${
          darkMode ? 'text-white' : 'text-[#000000]'
        }`}
      >
        Iniciar Sesión
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* --- Email --- */}
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
              {/* ícono */}
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
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@email.com"
              required
              className={`w-full py-2 pl-10 pr-3 border rounded-md focus:ring-[#6F43D6] focus:border-[#6F43D6] focus:outline-none
                ${
                  darkMode
                    ? 'bg-[#FFFFFF] border-gray-700 text-gray-900 placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              disabled={isLoading}
            />
          </div>
        </div>

        {/* --- Password --- */}
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
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="******************"
              required
              className={`w-full py-2 pl-10 pr-3 border rounded-md focus:ring-[#6F43D6] focus:border-[#6F43D6] focus:outline-none
                ${
                  darkMode
                    ? 'bg-[#FFFFFF] border-gray-700 text-gray-900 placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              disabled={isLoading}
            />
          </div>
        </div>

        {/* --- Remember me --- */}
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

        {/* --- Submit --- */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 px-4 bg-[#6F43D6] hover:bg-[#5F36C4] text-white font-medium rounded-md 
            focus:outline-none transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Accediendo...' : 'Acceder'}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;

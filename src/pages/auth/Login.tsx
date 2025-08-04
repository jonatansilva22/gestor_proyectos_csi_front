// src/pages/auth/Login.tsx
// Página de inicio de sesión con diseño responsive
// Redirige automáticamente al dashboard si el usuario ya está autenticado

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../../components/auth/LoginForm';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logo.png';

/**
 * Página de inicio de sesión del sistema CSI PRO
 * Muestra el formulario de login con diseño responsive y tema claro/oscuro
 */
const Login: React.FC = () => {
  const { darkMode } = useTheme();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className={`min-h-screen flex items-center justify-center p-3 sm:p-6 ${
      darkMode ? 'bg-[#1A0F30]' : 'bg-slate-100'
    }`}>
      <div className={`w-full max-w-6xl min-h-[600px] sm:min-h-[700px] overflow-hidden rounded-lg sm:rounded-xl border flex flex-col ${ 
        darkMode
          ? 'bg-[#3A2B5A] border-purple-700/40 shadow-2xl shadow-purple-900/30'
          : 'bg-white border-purple-300 shadow-2xl shadow-purple-200/40'
      }`}>
        {/* Encabezado */}
        <div className="bg-[#6F43D6] w-full h-20 sm:h-[120px] flex items-center px-4 sm:px-8 relative flex-shrink-0 rounded-t-lg sm:rounded-t-xl">
          {/* Logo del CSI y el texto a la izquierda */}
          <div className="flex items-center text-white">
            <img
              src={logo}
              alt="CSI PRO Logo"
              className="h-12 w-12 sm:h-16 sm:w-16 lg:h-20 lg:w-20 mr-2 sm:mr-3 lg:mr-4"
            />
            <span className="font-bold text-lg sm:text-2xl lg:text-3xl">CSI PRO</span>
          </div>
         
          {/* Sistema de Gestión - responsive visibility */}
          <div className="hidden sm:flex absolute inset-0 items-center justify-center text-white pointer-events-none">
            <span className="text-xl sm:text-2xl lg:text-3xl font-medium transform sm:translate-x-10">
              Sistema de Gestión de tareas
            </span>
          </div>
          
          {/* Mobile subtitle */}
          <div className="sm:hidden flex-1 flex justify-end items-center text-white">
            <span className="text-sm font-medium">Gestión de tareas</span>
          </div>
        </div>
       
        {/* Contenedor del LoginForm */}
        <div className="flex-1 flex items-center justify-center py-6 sm:py-12 lg:py-16 px-4 sm:px-8">
          <div className={`w-full max-w-sm sm:max-w-md lg:max-w-lg p-6 sm:p-8 lg:p-12 rounded-lg sm:rounded-xl border ${
            darkMode
              ? 'bg-[#2A1B4A] border-purple-600/50 shadow-xl'
              : 'bg-slate-50 border-slate-300 shadow-xl'
          }`}>
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';

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
    <div className={`min-h-screen flex items-center justify-center p-4 ${
      darkMode ? 'bg-[#1A0F30]' : 'bg-slate-100' // Softer page backgrounds
    }`}>
      <div className={`w-[786px] max-w-full min-h-[600px] overflow-hidden rounded-xl border flex flex-col ${ // Increased rounding
        darkMode
          ? 'bg-[#3A2B5A] border-purple-700/40 shadow-2xl shadow-purple-900/30' // Dark theme container: refined shadow
          : 'bg-white border-purple-300 shadow-2xl shadow-purple-200/40' // Light theme container: softer border, refined shadow
      }`}>
        {/* Header */}
        <div className="bg-[#6F43D6] w-full h-[100px] flex items-center px-6 relative flex-shrink-0 rounded-t-xl"> {/* Added rounded-t-xl */}
          {/* Logo del CSI y el texto a la izquierda */}
          <div className="flex items-center text-white">
            <img
              src={logo}
              alt="CSI PRO Logo"
              className="h-16 w-16 sm:h-20 sm:w-20 mr-2 sm:mr-3" // Slightly smaller logo on very small screens
            />
            <span className="font-bold text-xl sm:text-2xl">CSI PRO</span> {/* Responsive text size */}
          </div>
         
          {/* Sistema de Gestión centrado y ligeramente a la derecha */}
          <div className="absolute inset-0 flex items-center justify-center text-white pointer-events-none">
            <span className="text-2xl sm:text-3xl font-medium transform sm:translate-x-8"> {/* Responsive text and transform */}
              Sistema de Gestión de tareas
            </span>
          </div>
        </div>
       
        {/* Contenedor del LoginForm con espacio extra */}
        <div className="flex-1 flex items-center justify-center py-8 sm:py-12 px-6">
          <div className={`w-full max-w-md p-8 sm:p-10 rounded-xl border ${ // Increased padding and rounding
            darkMode
              ? 'bg-[#2A1B4A] border-purple-600/50 shadow-xl' // Dark theme form area: refined border, stronger shadow
              : 'bg-slate-50 border-slate-300 shadow-xl' // Light theme form area: cooler gray, distinct border, stronger shadow
          }`}>
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
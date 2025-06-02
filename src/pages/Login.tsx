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
    <div className={`min-h-screen flex items-center justify-center p-6 ${
      darkMode ? 'bg-[#1A0F30]' : 'bg-slate-100' // Fondos de página más suaves
    }`}>
      <div className={`w-[850px] max-w-full min-h-[700px] overflow-hidden rounded-xl border flex flex-col ${ // Mayor redondeado y altura
        darkMode
          ? 'bg-[#3A2B5A] border-purple-700/40 shadow-2xl shadow-purple-900/30' // Contenedor tema oscuro: sombra refinada
          : 'bg-white border-purple-300 shadow-2xl shadow-purple-200/40' // Contenedor tema claro: borde más suave, sombra refinada
      }`}>
        {/* Encabezado */}
        <div className="bg-[#6F43D6] w-full h-[120px] flex items-center px-8 relative flex-shrink-0 rounded-t-xl"> {/* Mayor altura y padding */}
          {/* Logo del CSI y el texto a la izquierda */}
          <div className="flex items-center text-white">
            <img
              src={logo}
              alt="CSI PRO Logo"
              className="h-18 w-18 sm:h-22 sm:w-22 mr-3 sm:mr-4" // Logo ligeramente más grande
            />
            <span className="font-bold text-2xl sm:text-3xl">CSI PRO</span> {/* Texto más grande */}
          </div>
         
          {/* Sistema de Gestión centrado y ligeramente a la derecha */}
          <div className="absolute inset-0 flex items-center justify-center text-white pointer-events-none">
            <span className="text-2xl sm:text-3xl font-medium transform sm:translate-x-10"> {/* Texto responsivo y transformación */}
              Sistema de Gestión de tareas
            </span>
          </div>
        </div>
       
        {/* Contenedor del LoginForm con espacio extra y mejor distribución */}
        <div className="flex-1 flex items-center justify-center py-12 sm:py-16 px-8">
          <div className={`w-full max-w-lg p-12 sm:p-14 rounded-xl border ${ // Mayor padding y ancho máximo
            darkMode
              ? 'bg-[#2A1B4A] border-purple-600/50 shadow-xl' // Área del formulario tema oscuro: borde refinado, sombra más fuerte
              : 'bg-slate-50 border-slate-300 shadow-xl' // Área del formulario tema claro: gris más frío, borde distintivo, sombra más fuerte
          }`}>
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

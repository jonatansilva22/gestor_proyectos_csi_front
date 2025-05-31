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
      darkMode ? 'bg-[#1A0F30]' : 'bg-slate-100' // Fondos de página más suaves
    }`}>
      <div className={`w-[550px] max-w-full min-h-[750px] overflow-hidden rounded-xl border flex flex-col ${ // Ancho reducido y altura aumentada
        darkMode
          ? 'bg-[#3A2B5A] border-purple-700/40 shadow-2xl shadow-purple-900/30' // Tema oscuro: sombra refinada
          : 'bg-white border-purple-300 shadow-2xl shadow-purple-200/40' // Tema claro: borde más suave, sombra refinada
      }`}>
        {/* Encabezado */}
        <div className="bg-[#6F43D6] w-full h-[120px] flex items-center px-4 relative flex-shrink-0 rounded-t-xl"> {/* Removido justify-center */}
          {/* Logo del CSI pegados a la izquierda */}
          <div className="flex items-center text-white">
            <img
              src={logo}
              alt="CSI PRO Logo"
              className="h-14 w-14 sm:h-16 sm:w-16 mr-2" // Logo ligeramente más pequeño para el contenedor más estrecho
            />
            <span className="font-bold text-xl sm:text-2xl">CSI PRO</span> {/* Sin margen derecho */}
          </div>
          
          {/* Sistema de gestión centrado en el espacio restante */}
          <div className="flex-1 flex justify-center -ml-12"> {/* Movido un poco hacia la izquierda */}
            <div className="flex flex-col text-xl sm:text-2xl font-medium text-white text-center"> {/* Centrado */}
              <span>Sistema de Gestión</span>
              <span>de tareas</span>
            </div>
          </div>
        </div>
                
        {/* Contenedor del LoginForm con más espacio vertical */}
        <div className="flex-1 flex items-center justify-center py-12 sm:py-16 px-4"> {/* Padding horizontal reducido */}
          <div className={`w-full max-w-sm p-6 sm:p-8 rounded-xl border ${ // Ancho máximo reducido y padding ajustado
            darkMode
              ? 'bg-[#2A1B4A] border-purple-600/50 shadow-xl' // Tema oscuro: borde refinado, sombra más fuerte
              : 'bg-slate-50 border-slate-300 shadow-xl' // Tema claro: gris más frío, borde distinto, sombra más fuerte
          }`}>
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

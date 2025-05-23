import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';

const Login: React.FC = () => {
  const { darkMode, toggleTheme } = useTheme();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);
  
  return (
    <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-[#25174A]' : 'bg-gray-50'}`}>
      <div className="w-[786px] overflow-hidden rounded-md shadow-lg">
        {/* Header */}
        <div className="bg-[#6F43D6] w-[786px] h-[100px] flex items-center px-6">
          {/* Logo del CSI y el texto a la izquierda wow */}
          <div className="flex items-center text-white w-1/4">
            <div className="flex items-center">
              <img
                src={logo}
                alt="CSI PRO Logo"
                className="h-20 w-20 mr-2"
              />
              <span className="font-bold text-2xl">CSI PRO</span>
            </div>
          </div>
          
          {/* Sistema de Gestión en el centro - TEXTO GRANDE */}
          <div className="text-center text-white flex-1 w-2/4">
            <div className="text-3xl font-medium">Sistema de</div>
            <div className="text-3xl font-medium">Gestion de tareas</div>
          </div>
          
          {/* Espacio vacío a la derecha para mantener el balance */}
          <div className="w-1/4"></div>
        </div>
        
        <LoginForm />
        
        {/* Botón para cambiar tema */}
        <div className={`px-6 py-2 text-center ${darkMode ? 'bg-[#3A2864]' : 'bg-gray-100'}`}>
          <button
            onClick={toggleTheme}
            className="text-sm text-[#6F43D6] dark:text-gray-300 hover:underline"
          >
            Cambiar a tema {darkMode ? 'claro' : 'oscuro'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
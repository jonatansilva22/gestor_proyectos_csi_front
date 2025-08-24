import React from 'react';
// import { useNavigate } from 'react-router-dom';
import LoginForm from '../../components/auth/LoginForm';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logo.png';

const Login: React.FC = () => {
  const { darkMode, toggleTheme } = useTheme();
  const { isLoading } = useAuth();

  // Redirigir si ya está autenticado - DESACTIVADO PARA DEMO
  // useEffect(() => {
  //   if (isAuthenticated) {
  //     navigate('/dashboard');
  //   }
  // }, [isAuthenticated, navigate]);

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors relative ${
        darkMode ? 'bg-[#1A0F30]' : 'bg-slate-100'
      }`}>
        {/* Botón de tema en loading también */}
        <button
          onClick={toggleTheme}
          className={`absolute top-6 right-6 p-3 rounded-full transition-colors ${
            darkMode ? 'bg-purple-600/20 hover:bg-purple-600/30 text-purple-200' : 'bg-purple-100 hover:bg-purple-200 text-purple-700'
          }`}
          title={darkMode ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
        >
          {darkMode ? (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>
        
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          <p className={`font-medium ${
            darkMode ? 'text-purple-200' : 'text-gray-700'
          }`}>
            Verificando sesión...
          </p>
        </div>

        {/* Footer */}
        <footer className="absolute bottom-4 right-4">
          <div className={`text-xs text-right ${
            darkMode ? 'text-purple-200/80' : 'text-gray-600'
          }`}>
            <p className="font-medium">© 2025 CSI PRO | Universidad de Sonora</p>
            <p>Todos los derechos reservados.</p>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors ${
      darkMode ? 'bg-[#1A0F30]' : 'bg-slate-100'
    }`}>
      {/* Contenedor principal con diseño diferente según tema */}
      <div className={`min-h-screen flex items-center justify-center p-6 relative overflow-hidden ${
        darkMode 
          ? 'bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800' 
          : 'bg-slate-100'
      }`}>
        {/* Overlay solo en modo oscuro */}
        {darkMode && <div className="absolute inset-0 bg-white/5 backdrop-blur-sm" />}
        
        {/* Botón de tema en la esquina superior derecha */}
        <button
          onClick={toggleTheme}
          className={`absolute top-6 right-6 p-3 rounded-full transition-colors z-20 group ${
            darkMode 
              ? 'bg-white/10 hover:bg-white/20 text-white'
              : 'bg-purple-100 hover:bg-purple-200 text-purple-700 shadow-lg'
          }`}
          title={darkMode ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
        >
          {darkMode ? (
            // Icono sol para tema claro
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            // Icono luna para tema oscuro  
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>
        
        {/* Contenedor principal */}
        <div className="relative z-10 w-full max-w-md">
          {/* Logo y título */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <img
                src={logo}
                alt="CSI PRO Logo"
                className="h-16 w-16 mr-3"
              />
              <span className={`font-bold text-3xl ${
                darkMode ? 'text-white' : 'text-gray-800'
              }`}>CSI PRO</span>
            </div>
            <p className={`text-lg opacity-90 ${
              darkMode ? 'text-purple-100' : 'text-gray-600'
            }`}>Sistema de Gestión de tareas</p>
          </div>

          {/* Formulario de login */}
          <div className={`rounded-2xl shadow-2xl border overflow-hidden ${
            darkMode 
              ? 'bg-[#3A2B5A] border-purple-700/30 shadow-purple-900/50' 
              : 'bg-white border-gray-200 shadow-gray-300/50'
          }`}>
            <LoginForm />
          </div>
        </div>

        {/* Footer */}
        <footer className="absolute bottom-4 right-4">
          <div className={`text-xs text-right ${
            darkMode ? 'text-purple-200/80' : 'text-gray-600'
          }`}>
            <p className="font-medium">© 2025 CSI PRO | Universidad de Sonora</p>
            <p>Todos los derechos reservados.</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Login;

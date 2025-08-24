import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import UserAvatar from '../../components/common/UserAvatar';

export default function LogoutPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { user, logout } = useAuth();
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logout();
      // Redirigir manualmente después del logout
      navigate('/login');
    } catch (error) {
      console.error('Error:', error);
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-6 ${
      darkMode ? 'bg-[#1A0F30]' : 'bg-slate-100'
    }`}>
      <div className={`w-full max-w-md rounded-xl border ${
        darkMode
          ? 'bg-[#3A2B5A] border-purple-700/40 shadow-2xl shadow-purple-900/30'
          : 'bg-white border-purple-300 shadow-2xl shadow-purple-200/40'
      }`}>
        
        {/* Header */}
        <div className="bg-[#6F43D6] w-full h-[80px] flex items-center justify-center relative flex-shrink-0 rounded-t-xl">
          <span className="text-white text-xl font-bold">CSI PRO</span>
        </div>

        {/* Contenido */}
        <div className="p-8">
          {/* Icono de advertencia */}
          <div className="text-center mb-6">
            <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
              darkMode 
                ? 'bg-purple-900/50' 
                : 'bg-purple-100'
            }`}>
              <svg className={`w-8 h-8 ${
                darkMode ? 'text-purple-300' : 'text-purple-600'
              }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className={`text-2xl font-bold ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              ¿Cerrar Sesión?
            </h2>
          </div>

          {/* Info del usuario */}
          {user && (
            <div className={`rounded-lg p-4 mb-6 ${
              darkMode 
                ? 'bg-[#2A1B4A] border border-purple-600/50' 
                : 'bg-slate-50 border border-slate-300'
            }`}>
              <div className="flex items-center space-x-4">
                <UserAvatar 
                  user={{
                    first_name: user.first_name || '',
                    last_name: user.last_name || '',
                    photo: user.photo
                  }} 
                  size="large"
                />
                <div className="flex-1">
                  <div className={`font-medium ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {user.first_name && user.last_name 
                      ? `${user.first_name} ${user.last_name}`
                      : user.username
                    }
                  </div>
                  <div className={`text-sm ${
                    darkMode ? 'text-purple-300' : 'text-gray-500'
                  }`}>
                    @{user.username}
                  </div>
                  <div className={`text-sm ${
                    darkMode ? 'text-purple-200' : 'text-gray-600'
                  }`}>
                    {user.email}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Mensaje */}
          <p className={`text-center mb-8 ${
            darkMode ? 'text-purple-200' : 'text-gray-600'
          }`}>
            ¿Estás seguro de que deseas cerrar tu sesión? Tendrás que volver a iniciar sesión para acceder al sistema.
          </p>

          {/* Botones */}
          <div className="space-y-3">
            <button
              onClick={handleLogout}
              disabled={isLoading}
              className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 disabled:opacity-50 font-medium transition-colors duration-200"
            >
              {isLoading ? 'Cerrando Sesión...' : 'Sí, Cerrar Sesión'}
            </button>
                     
            <button
              onClick={handleCancel}
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-colors duration-200 ${
                darkMode
                  ? 'bg-[#2A1B4A] text-purple-200 border border-purple-600/50 hover:bg-[#3A2B5A]'
                  : 'bg-slate-200 text-gray-800 hover:bg-slate-300'
              }`}
            >
              Cancelar
            </button>
          </div>

          {/* Indicador de carga */}
          {isLoading && (
            <div className="flex justify-center mt-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
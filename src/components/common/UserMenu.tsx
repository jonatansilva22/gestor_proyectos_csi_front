import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { ROLE_NAMES } from '../../const/index';

interface UserMenuProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}

const UserMenu: React.FC<UserMenuProps> = ({ isOpen, onClose, triggerRef }) => {
  const { user, logout } = useAuth();
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);

  // Cerrar menú al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, triggerRef]);

  if (!isOpen) return null;

  const handleLogout = async () => {
    // Redirige a la página de logout para un flujo consistente
    navigate('/logout');
    onClose();
  };

  const handleNavigateToSettings = (path: string) => {
    navigate(path);
    onClose();
  };

  const getRoleBadge = () => {
    // Usar constantes centralizadas con mapeo correcto: 1=Admin, 2=SuperAdmin
    const roleColors = {
      1: 'bg-purple-600',  // Admin - Morado
      2: 'bg-red-600',     // SuperAdmin - Rojo
      3: 'bg-green-600'    // Colaborador - Verde
    };
    
    // FORZAR uso de mapeo por ID correcto: 1=Admin, 2=SuperAdmin 
    // Ignorar role_name del backend para garantizar consistencia
    const roleLabel = user?.role ? ROLE_NAMES[user.role as keyof typeof ROLE_NAMES] : 'Usuario';
    const roleColor = user?.role ? roleColors[user.role as keyof typeof roleColors] : 'bg-gray-600';
    
    return { roleLabel, roleColor };
  };

  return (
    <div
      ref={menuRef}
      className={`absolute top-full right-0 mt-2 w-72 sm:w-80 max-w-[calc(100vw-2rem)] rounded-2xl shadow-2xl border overflow-hidden z-50 transform transition-all duration-300 ease-out opacity-100 translate-y-0 ${
                   darkMode 
                     ? 'bg-[#3A2B5A] border-purple-700/30' 
                     : 'bg-white border-gray-200'
                 }`}
    >
        {/* Elegant Header */}
        <div className="gradient-primary px-6 py-5 relative overflow-hidden">
          <div className="absolute inset-0 bg-white/5 backdrop-blur-sm" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm">Mi Cuenta</h3>
                  <p className="text-white/80 text-xs opacity-90">Panel de usuario</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced User Info */}
        <div className={`px-6 py-5 border-b ${
          darkMode 
            ? 'border-purple-700/30 bg-[#1A0F30]' 
            : 'border-gray-200 bg-gray-50'
        }`}>
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center text-white font-bold text-lg shadow-system-lg">
                {user?.username ? user.username.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'U'}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className={`font-bold text-base truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {user?.username || 'Usuario'}
              </h4>
              <p className={`text-sm truncate font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {user?.email || 'usuario@correo.com'}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold text-white ${getRoleBadge().roleColor}`}>
                  {getRoleBadge().roleLabel}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Menu Options */}
        <div className="py-3">
          <button
            onClick={() => handleNavigateToSettings('/settings/profile')}
            className={`group flex items-center gap-4 w-full px-6 py-3.5 text-left transition-all duration-200 transform hover:scale-[1.02] ${
              darkMode 
                ? 'hover:bg-purple-700/20' 
                : 'hover:bg-gray-50'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center group-hover:bg-purple-700 transition-all duration-200">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="flex-1">
              <span className={`text-sm font-semibold ${darkMode ? 'text-white group-hover:text-purple-300' : 'text-gray-900 group-hover:text-purple-700'}`}>Editar perfil</span>
              <p className={`text-xs mt-0.5 ${darkMode ? 'text-gray-300 group-hover:text-purple-400' : 'text-gray-600 group-hover:text-purple-600'}`}>Actualiza información y contraseña</p>
            </div>
            <svg className={`w-4 h-4 transition-colors ${darkMode ? 'text-gray-400 group-hover:text-purple-400' : 'text-gray-500 group-hover:text-purple-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <button
            onClick={() => handleNavigateToSettings('/settings/theme')}
            className={`group flex items-center gap-4 w-full px-6 py-3.5 text-left transition-all duration-200 transform hover:scale-[1.02] ${
              darkMode 
                ? 'hover:bg-purple-700/20' 
                : 'hover:bg-gray-50'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center group-hover:bg-purple-700 transition-all duration-200">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <span className={`text-sm font-semibold ${darkMode ? 'text-white group-hover:text-purple-300' : 'text-gray-900 group-hover:text-purple-700'}`}>Tema</span>
              <p className={`text-xs mt-0.5 ${darkMode ? 'text-gray-300 group-hover:text-purple-400' : 'text-gray-600 group-hover:text-purple-600'}`}>Personaliza la apariencia</p>
            </div>
            <svg className={`w-4 h-4 transition-colors ${darkMode ? 'text-gray-400 group-hover:text-purple-400' : 'text-gray-500 group-hover:text-purple-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>


        {/* Enhanced Logout Button */}
        <div className={`border-t p-4 ${
          darkMode 
            ? 'border-purple-700/30 bg-[#1A0F30]' 
            : 'border-gray-200 bg-gray-50'
        }`}>
          <button 
            onClick={handleLogout}
            className={`group flex items-center gap-3 w-full px-4 py-3.5 text-left rounded-xl transition-all duration-200 transform hover:scale-[1.02] border border-transparent ${ 
              darkMode 
                ? 'text-white hover:bg-red-900/20 hover:border-red-800' 
                : 'text-red-600 hover:bg-red-50 hover:border-red-200'
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center group-hover:bg-red-200 dark:group-hover:bg-red-900/50 transition-colors">
              <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </div>
            <span className={`font-semibold text-sm ${
              darkMode 
                ? 'text-white group-hover:text-red-300' 
                : 'text-red-600 group-hover:text-red-700'
            }`}>Cerrar sesión</span>
          </button>
        </div>

    </div>
  );
};

export default UserMenu;

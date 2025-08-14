import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import EditProfile from './EditProfile';
import ChangePassword from './ChangePassword';
import NotificationSettings from './NotificationSettings';
import ThemeSelector from './ThemeSelector';

interface UserPreferencesProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef?: React.RefObject<HTMLButtonElement>;
  initialSection?: PreferenceSection;
}

type PreferenceSection = 'profile' | 'password' | 'notifications' | 'theme' | null;

const UserPreferences: React.FC<UserPreferencesProps> = ({ isOpen, onClose, initialSection = null }) => {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState<PreferenceSection>(initialSection);

  // Update activeSection when initialSection changes
  React.useEffect(() => {
    if (isOpen) {
      setActiveSection(initialSection);
    }
  }, [isOpen, initialSection]);

  if (!isOpen) return null;

  const handleBackToMenu = () => {
    setActiveSection(null);
  };


  const getUserInitials = (username: string) => {
    const names = username.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return username.substring(0, 2).toUpperCase();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[92vh] overflow-y-auto transform transition-all duration-300 animate-in slide-in-from-bottom-4 scale-in-95">
        {/* Enhanced Header */}
        <div className="bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 px-8 py-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-white/5 backdrop-blur-sm" />
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h1 className="text-white text-2xl font-bold">Preferencias de Usuario</h1>
                <p className="text-purple-100 text-sm opacity-90">Personaliza tu experiencia</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-200 border border-white/20"
              aria-label="Cerrar"
            >
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {!activeSection ? (
          <>
            {/* Enhanced Profile Section */}
            <div className="px-8 py-8 bg-gradient-to-br from-purple-50/50 to-white">
              <div className="flex items-center gap-8 max-w-4xl mx-auto">
                <div className="relative">
                  <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl shadow-xl">
                    {user?.username ? getUserInitials(user.username) : 'U'}
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full" />
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-gray-900 text-3xl font-bold mb-2">
                    {user?.username || 'Juan Rodríguez'}
                  </h2>
                  <p className="text-gray-600 text-lg mb-3">
                    {user?.email || 'juan.rodriguez@uniaon.mx'}
                  </p>
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-purple-100 text-purple-800">
                      Administrador
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                      ● En línea
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <button className="px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 text-sm font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 w-44">
                    Cambiar foto
                  </button>
                  <button 
                    onClick={() => setActiveSection('profile')}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl text-white text-sm font-semibold hover:from-purple-700 hover:to-purple-800 transition-all duration-200 w-44 shadow-lg"
                  >
                    Editar perfil
                  </button>
                </div>
              </div>
            </div>

            {/* Enhanced Preference Options */}
            <div className="px-8 py-8">
              <div className="max-w-4xl mx-auto">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Configuración de cuenta</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <PreferenceOption
                    title="Información Personal"
                    description="Actualiza tu nombre, email y datos de contacto"
                    icon="profile"
                    onClick={() => setActiveSection('profile')}
                  />
                  <PreferenceOption
                    title="Seguridad"
                    description="Cambia tu contraseña y opciones de seguridad"
                    icon="password"
                    onClick={() => setActiveSection('password')}
                  />
                  <PreferenceOption
                    title="Notificaciones"
                    description="Gestiona alertas, emails y notificaciones push"
                    icon="notifications"
                    onClick={() => setActiveSection('notifications')}
                  />
                  <PreferenceOption
                    title="Apariencia"
                    description="Personaliza tema, colores y preferencias visuales"
                    icon="theme"
                    onClick={() => setActiveSection('theme')}
                  />
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {activeSection === 'profile' && (
              <EditProfile onBack={handleBackToMenu} />
            )}
            {activeSection === 'password' && (
              <ChangePassword onBack={handleBackToMenu} />
            )}
            {activeSection === 'notifications' && (
              <NotificationSettings onBack={handleBackToMenu} />
            )}
            {activeSection === 'theme' && (
              <ThemeSelector onBack={handleBackToMenu} />
            )}
          </>
        )}
      </div>
    </div>
  );
};

interface PreferenceOptionProps {
  title: string;
  description: string;
  onClick: () => void;
  icon: 'profile' | 'password' | 'notifications' | 'theme';
}

const PreferenceOption: React.FC<PreferenceOptionProps> = ({ title, description, onClick, icon }) => {
  const getIcon = () => {
    const iconClass = "w-6 h-6";
    switch (icon) {
      case 'profile':
        return (
          <svg className={`${iconClass} text-purple-600`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        );
      case 'password':
        return (
          <svg className={`${iconClass} text-blue-600`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        );
      case 'notifications':
        return (
          <svg className={`${iconClass} text-emerald-600`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" />
          </svg>
        );
      case 'theme':
        return (
          <svg className={`${iconClass} text-amber-600`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getColorClasses = () => {
    switch (icon) {
      case 'profile':
        return 'hover:bg-purple-50 hover:border-purple-200 group-hover:from-purple-50 group-hover:to-purple-100';
      case 'password':
        return 'hover:bg-blue-50 hover:border-blue-200 group-hover:from-blue-50 group-hover:to-blue-100';
      case 'notifications':
        return 'hover:bg-emerald-50 hover:border-emerald-200 group-hover:from-emerald-50 group-hover:to-emerald-100';
      case 'theme':
        return 'hover:bg-amber-50 hover:border-amber-200 group-hover:from-amber-50 group-hover:to-amber-100';
      default:
        return 'hover:bg-gray-50';
    }
  };

  return (
    <button
      onClick={onClick}
      className={`group w-full flex items-center gap-4 p-6 rounded-2xl border-2 border-gray-100 transition-all duration-200 text-left transform hover:scale-[1.02] hover:shadow-lg ${getColorClasses()}`}
    >
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center group-hover:from-white group-hover:to-gray-50 transition-all duration-200">
        {getIcon()}
      </div>
      <div className="flex-1">
        <h3 className="text-gray-900 text-lg font-bold mb-1 group-hover:text-gray-800">{title}</h3>
        <p className="text-gray-600 text-sm group-hover:text-gray-700">{description}</p>
      </div>
      <svg 
        className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-all duration-200 transform group-hover:translate-x-1" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </button>
  );
};

export default UserPreferences;

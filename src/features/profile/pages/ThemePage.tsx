import { useNavigate } from "react-router-dom";
import React, { useState } from 'react';
import HeaderSidebarLayout from '../../../components/common/HeaderSidebarLayout';
import { useTheme } from '../../../context/ThemeContext';
import { notifySuccess, notifyError } from '../../../components/common/ToastNotify';
import volver from "../../../assets/volver.png";
import { useTouchButton } from "../../../hooks/useTouchInteractions";
import { useMobileNavigation } from "../../../hooks/useMobileNavigation";

interface ThemeOption {
  id: 'light' | 'dark' | 'auto';
  name: string;
  description: string;
  icon: React.ReactNode;
  preview: {
    bg: string;
    card: string;
    text: string;
    accent: string;
  };
}

const ThemePage: React.FC = () => {
  const { theme, setTheme, darkMode } = useTheme();
  const [selectedTheme, setSelectedTheme] = useState<'light' | 'dark' | 'auto'>(theme || 'light');
    const { isMobile } = useMobileNavigation();
    const navigate  = useNavigate();

    
  const backButtonTouch = useTouchButton(
    () => navigate(-1),
    {
      hapticFeedback: true,
      tapHapticPattern: 'medium',
    }
  );
    

  const themes: ThemeOption[] = [
    {
      id: 'light',
      name: 'Tema Claro',
      description: 'Ideal para uso durante el día con buena iluminación',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      preview: {
        bg: 'bg-gray-50 dark:bg-gray-800',
        card: 'bg-white dark:bg-gray-700',
        text: 'text-gray-900 dark:text-white',
        accent: 'bg-purple-600'
      }
    },
    {
      id: 'dark',
      name: 'Tema Oscuro',
      description: 'Perfecto para uso nocturno o en ambientes con poca luz',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      ),
      preview: {
        bg: 'bg-gray-900 dark:bg-gray-800',
        card: 'bg-gray-800 dark:bg-gray-700',
        text: 'text-white dark:text-white',
        accent: 'bg-purple-500'
      }
    },
    {
      id: 'auto',
      name: 'Automático',
      description: 'Se adapta automáticamente según la configuración del sistema',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      preview: {
        bg: 'bg-gradient-to-br from-gray-50 to-gray-800 dark:from-gray-800 dark:to-gray-900',
        card: 'bg-gradient-to-br from-gray-50 to-gray-800 dark:from-gray-800 dark:to-gray-900',
        text: 'text-gray-900 dark:text-white',
        accent: 'bg-gradient-to-br from-purple-600 to-purple-800'
      }
    }
  ];

  const handleThemeChange = (themeId: 'light' | 'dark' | 'auto') => {
    setSelectedTheme(themeId);
    // Aplicar previsualización inmediata del tema
    setTheme(themeId);
  };

  const handleSaveTheme = async () => {
    try {
      // El tema ya está aplicado por la previsualización, solo confirmamos
      notifySuccess(`Tema ${themes.find(t => t.id === selectedTheme)?.name} aplicado correctamente`);
    } catch (error) {
      notifyError('Error al cambiar el tema');
    }
  };

  const getCurrentSystemTheme = () => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  return (
    <HeaderSidebarLayout headerTitle="Configuración de Tema">
          <button
          ref={backButtonTouch.elementRef as React.Ref<HTMLButtonElement>}
          onClick={() => navigate(-1)}
          className={`
            mb-4 btn-icon touch-manipulation min-h-[44px] min-w-[44px] cursor-pointer
            flex items-center justify-center rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
            ${darkMode 
              ? 'bg-gray-800 hover:bg-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 focus:ring-purple-400 focus:ring-offset-[#1A0F30] active:bg-gray-600' 
              : 'bg-white hover:bg-gray-200 focus:ring-gray-400 focus:ring-offset-white active:bg-gray-300 border border-gray-300'
            }
            ${isMobile ? 'p-3' : 'p-2'}
          `}
          aria-label="Volver a la página anterior"
        >
          <img 
            src={volver} 
            alt="Volver" 
            className={`${isMobile ? 'w-7 h-7' : 'w-6 h-6 sm:w-7 sm:h-7'}`} 
          />
        </button>
      <div className={`max-w-4xl mx-auto p-6 min-h-screen transition-colors ${
        darkMode ? 'bg-[#1A0F30]' : 'bg-slate-100'
      }`}>
        {/* Header Section */}
        <div className="bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 rounded-3xl p-8 mb-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-white/5 backdrop-blur-sm" />
          <div className="relative z-10 flex items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20">
              <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h1 className="text-white text-3xl font-bold mb-2">Personalización</h1>
              <p className="text-purple-100 text-lg opacity-90">Configura la apariencia de la aplicación según tus preferencias</p>
            </div>
          </div>
        </div>

        {/* Current Theme Info */}
        <div className={`rounded-2xl shadow-lg border p-6 mb-8 ${
          darkMode 
            ? 'bg-[#3A2B5A] border-purple-700/30 shadow-purple-900/20' 
            : 'bg-white border-gray-100'
        }`}>
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl text-white flex items-center justify-center ${
              darkMode ? 'bg-purple-500' : 'bg-purple-600'
            }`}>
              {themes.find(t => t.id === theme)?.icon}
            </div>
            <div>
              <h3 className={`font-semibold ${
                darkMode ? 'text-purple-200' : 'text-gray-900'
              }`}>Tema actual</h3>
              <p className={`text-sm ${
                darkMode ? 'text-purple-300' : 'text-gray-600'
              }`}>
                {themes.find(t => t.id === theme)?.name || 'Tema Claro'}
                {theme === 'auto' && (
                  <span className={`ml-2 ${
                    darkMode ? 'text-purple-400' : 'text-purple-600'
                  }`}>
                    (Sistema: {getCurrentSystemTheme() === 'dark' ? 'Oscuro' : 'Claro'})
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Theme Selection */}
        <div className={`rounded-2xl shadow-lg border overflow-hidden ${
          darkMode 
            ? 'bg-[#3A2B5A] border-purple-700/30 shadow-purple-900/20' 
            : 'bg-white border-gray-100'
        }`}>
          <div className="p-8">
            <h3 className={`text-xl font-bold mb-6 ${
              darkMode ? 'text-purple-200' : 'text-gray-900'
            }`}>Seleccionar tema</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {themes.map((themeOption) => (
                <div
                  key={themeOption.id}
                  className={`relative cursor-pointer transition-all duration-200 ${
                    selectedTheme === themeOption.id
                      ? 'ring-2 ring-purple-500 shadow-lg scale-105'
                      : 'hover:shadow-md hover:scale-102'
                  }`}
                  onClick={() => handleThemeChange(themeOption.id)}
                >
                  <div className={`border rounded-2xl overflow-hidden ${
                    darkMode ? 'border-purple-600/40' : 'border-gray-200'
                  }`}>
                    {/* Theme Preview */}
                    <div className={`h-32 relative ${
                      themeOption.id === 'dark' 
                        ? 'bg-gray-900'
                        : themeOption.id === 'auto'
                          ? 'bg-gradient-to-r from-gray-50 to-gray-900'
                          : 'bg-gray-50'
                    }`}>
                      <div className={`absolute top-3 left-3 right-3 h-6 rounded-lg shadow-sm ${
                        themeOption.id === 'dark' ? 'bg-gray-800' : 'bg-white'
                      }`}>
                        <div className="w-16 h-2 bg-purple-500 rounded-full m-2" />
                      </div>
                      <div className={`absolute bottom-3 left-3 right-3 h-12 rounded-lg shadow-sm flex items-center px-3 ${
                        themeOption.id === 'dark' ? 'bg-gray-800' : 'bg-white'
                      }`}>
                        <div className="w-8 h-8 bg-purple-500 rounded-full mr-3" />
                        <div className="flex-1 space-y-1">
                          <div className={`w-full h-2 opacity-20 rounded ${
                            themeOption.id === 'dark' ? 'bg-gray-400' : 'bg-gray-600'
                          }`} />
                          <div className={`w-3/4 h-2 opacity-10 rounded ${
                            themeOption.id === 'dark' ? 'bg-gray-400' : 'bg-gray-600'
                          }`} />
                        </div>
                      </div>
                    </div>
                    
                    {/* Theme Info */}
                    <div className="p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          selectedTheme === themeOption.id 
                            ? 'bg-purple-600 text-white' 
                            : darkMode
                              ? 'bg-purple-800/30 text-purple-300'
                              : 'bg-gray-100 text-gray-600'
                        }`}>
                          {themeOption.icon}
                        </div>
                        <h4 className={`font-semibold ${
                          darkMode ? 'text-purple-200' : 'text-gray-900'
                        }`}>{themeOption.name}</h4>
                        {selectedTheme === themeOption.id && (
                          <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center ml-auto">
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <p className={`text-sm ${
                        darkMode ? 'text-purple-300' : 'text-gray-600'
                      }`}>{themeOption.description}</p>
                    </div>
                  </div>
                  
                  {/* Selection Overlay */}
                  {selectedTheme === themeOption.id && (
                    <div className="absolute inset-0 bg-purple-500/10 rounded-2xl pointer-events-none" />
                  )}
                </div>
              ))}
            </div>

            {/* Additional Settings */}
            <div className={`border-t pt-8 ${
              darkMode ? 'border-purple-700/30' : 'border-gray-200'
            }`}>
              <h4 className={`text-lg font-semibold mb-4 ${
                darkMode ? 'text-purple-200' : 'text-gray-900'
              }`}>Configuración adicional</h4>
              
              <div className="space-y-4">
                <div className={`flex items-center justify-between p-4 rounded-xl ${
                  darkMode 
                    ? 'bg-purple-800/20 border border-purple-700/20'
                    : 'bg-gray-50'
                }`}>
                  <div>
                    <h5 className={`font-medium ${
                      darkMode ? 'text-purple-200' : 'text-gray-900'
                    }`}>Seguir tema del sistema</h5>
                    <p className={`text-sm ${
                      darkMode ? 'text-purple-300' : 'text-gray-600'
                    }`}>Cambiar automáticamente entre claro y oscuro</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={selectedTheme === 'auto'}
                      onChange={(e) => handleThemeChange(e.target.checked ? 'auto' : 'light')}
                    />
                    <div className={`w-11 h-6 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600 ${
                      darkMode 
                        ? 'bg-purple-800/50 after:border-purple-600'
                        : 'bg-gray-200 after:border-gray-300'
                    }`}></div>
                  </label>
                </div>

              </div>
            </div>

            {/* Info Box */}
            <div className={`mt-8 p-6 rounded-2xl border ${
              darkMode 
                ? 'bg-purple-900/20 border-purple-600/30'
                : 'bg-purple-50 border-purple-200'
            }`}>
              <div className="flex items-start gap-4">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  darkMode ? 'bg-purple-600' : 'bg-purple-600'
                }`}>
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className={`font-semibold mb-2 ${
                    darkMode ? 'text-purple-200' : 'text-purple-900'
                  }`}>Acerca de los temas</h4>
                  <p className={`text-sm leading-relaxed ${
                    darkMode ? 'text-purple-300' : 'text-purple-800'
                  }`}>
                    Los temas personalizan la apariencia visual de la aplicación. El tema automático 
                    detecta las preferencias de tu sistema operativo y cambia automáticamente entre 
                    claro y oscuro según la configuración del sistema.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </HeaderSidebarLayout>
  );
};

export default ThemePage;

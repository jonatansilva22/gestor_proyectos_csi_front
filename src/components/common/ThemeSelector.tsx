import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';

interface ThemeSelectorProps {
  onBack: () => void;
}

type ThemeOption = 'light' | 'dark' | 'auto';

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ onBack }) => {
  const { setTheme: updateTheme, theme, darkMode } = useTheme();
  const [selectedTheme, setSelectedTheme] = useState<ThemeOption>(theme);

  const handleThemeSelect = (themeOption: ThemeOption) => {
    setSelectedTheme(themeOption);
    updateTheme(themeOption);
  };

  const themes = [
    {
      id: 'light' as ThemeOption,
      name: 'Claro',
      description: 'Tema claro para uso diurno'
    },
    {
      id: 'dark' as ThemeOption,
      name: 'Oscuro',
      description: 'Tema oscuro para uso nocturno'
    },
    {
      id: 'auto' as ThemeOption,
      name: 'Automático',
      description: 'Se adapta a la configuración del sistema'
    }
  ];

  return (
    <div className={`relative min-h-screen ${
      darkMode ? 'bg-[#1A0F30]' : 'bg-white'
    }`}>
      {/* Back Button */}
      <button
        onClick={onBack}
        className={`absolute left-8 top-15 p-4 rounded-full transition-colors ${
          darkMode 
            ? 'hover:bg-purple-700/20' 
            : 'hover:bg-gray-100'
        }`}
        aria-label="Volver"
      >
        <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19.5625 32.5L33.5625 46.5L30 50L10 30L30 10L33.5625 13.5L19.5625 27.5H50V32.5H19.5625Z" fill={darkMode ? "#A855F7" : "#1D1B20"}/>
        </svg>
      </button>

      <div className="px-6 lg:px-15 py-15 flex flex-col items-center max-w-4xl mx-auto">
        {/* Title */}
        <div className="text-center mb-8">
          <h2 className={`text-2xl lg:text-4xl font-bold ${
            darkMode ? 'text-purple-300' : 'text-black'
          }`}>Tema de Interfaz</h2>
        </div>

        {/* Theme Options */}
        <div className="w-full max-w-3xl">
          <label className={`block text-sm font-normal mb-4 ${
            darkMode ? 'text-purple-200' : 'text-black'
          }`}>
            Tema de Interfaz
          </label>

          <div className="flex flex-col sm:flex-row gap-2 mb-4">
            {themes.map((themeOption) => (
              <button
                key={themeOption.id}
                onClick={() => handleThemeSelect(themeOption.id)}
                className={`flex-1 h-20 px-2 py-2 rounded-md text-white text-sm font-normal transition-colors min-w-34 ${
                  selectedTheme === themeOption.id
                    ? darkMode
                      ? 'bg-purple-500 shadow-lg shadow-purple-900/30'
                      : 'bg-purple-700 shadow-md'
                    : darkMode
                      ? 'bg-purple-700 hover:bg-purple-600'
                      : 'bg-purple-700 hover:bg-purple-800'
                }`}
              >
                {themeOption.name}
              </button>
            ))}
          </div>
          
          <p className={`text-xs ${
            darkMode ? 'text-purple-200' : 'text-gray-500'
          }`}>
            Elige tu preferencia
          </p>
        </div>

        {/* Theme Preview Section */}
        <div className="mt-10 w-full max-w-3xl">
          <h3 className={`text-lg font-medium mb-4 ${
            darkMode ? 'text-purple-300' : 'text-black'
          }`}>Vista previa</h3>
          <div className={`border rounded-lg p-6 ${
            darkMode 
              ? 'border-purple-700 bg-[#3A2B5A] shadow-lg shadow-purple-900/30'
              : 'border-gray-200 bg-white shadow-md'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h4 className={`font-semibold ${
                darkMode ? 'text-purple-200' : 'text-gray-900'
              }`}>Ejemplo de interfaz</h4>
              <div className="flex gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
            </div>
            <div className="space-y-3">
              <div className={`h-4 rounded w-3/4 ${
                darkMode ? 'bg-purple-700' : 'bg-gray-200'
              }`}></div>
              <div className={`h-4 rounded w-1/2 ${
                darkMode ? 'bg-purple-700' : 'bg-gray-200'
              }`}></div>
              <div className={`h-4 rounded w-2/3 ${
                darkMode ? 'bg-purple-500' : 'bg-purple-200'
              }`}></div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8">
          <p className={`text-sm mb-2 ${
            darkMode ? 'text-purple-200' : 'text-gray-600'
          }`}>
            Los cambios se guardan automáticamente
          </p>
        </div>
      </div>
    </div>
  );
};

export default ThemeSelector;

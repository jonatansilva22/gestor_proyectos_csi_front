import React, { createContext, useContext, useEffect, useState } from 'react';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { useThemePreference, ThemePreference } from '../hooks/useThemePreference';

interface ThemeContextType {
  darkMode: boolean;
  theme: ThemePreference;
  toggleTheme: () => void;
  setTheme: (theme: ThemePreference) => void;
  resetTheme: () => void;
  systemPreference: 'light' | 'dark';
  isSystemAuto: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  darkMode: false,
  theme: 'auto',
  toggleTheme: () => {},
  setTheme: () => {},
  resetTheme: () => {},
  systemPreference: 'light',
  isSystemAuto: false,
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Usar el hook useMediaQuery para detectar la preferencia del sistema
  const systemPrefersDark = useMediaQuery('(prefers-color-scheme: dark)');
  const { theme, setTheme: setThemePreference, resetTheme } = useThemePreference();
  const [darkMode, setDarkMode] = useState(false);

  // Determinar el modo oscuro basado en el tema y preferencia del sistema
  useEffect(() => {
    if (theme === 'auto') {
      setDarkMode(systemPrefersDark);
    } else {
      setDarkMode(theme === 'dark');
    }
  }, [systemPrefersDark, theme]);

  // Función para alternar entre claro, oscuro y automático
  const toggleTheme = () => {
    if (theme === 'light') {
      setThemePreference('dark');
    } else if (theme === 'dark') {
      setThemePreference('auto');
    } else {
      setThemePreference('light');
    }
  };

  // Actualizar las clases CSS en el HTML
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Aplicar o remover la clase 'dark'
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Agregar atributo data para debugging
    root.setAttribute('data-theme', theme);
    root.setAttribute('data-dark-mode', darkMode.toString());
  }, [darkMode, theme]);

  // Detectar cambios en la preferencia del sistema cuando el tema es 'auto'
  useEffect(() => {
    if (theme === 'auto') {
      // Disparar evento personalizado cuando cambie el tema automáticamente
      const event = new CustomEvent('themeAutoChange', {
        detail: { isDark: systemPrefersDark, theme: 'auto' }
      });
      window.dispatchEvent(event);
    }
  }, [systemPrefersDark, theme]);

  return (
    <ThemeContext.Provider 
      value={{ 
        darkMode, 
        theme, 
        toggleTheme, 
        setTheme: setThemePreference, 
        resetTheme,
        systemPreference: systemPrefersDark ? 'dark' : 'light',
        isSystemAuto: theme === 'auto'
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

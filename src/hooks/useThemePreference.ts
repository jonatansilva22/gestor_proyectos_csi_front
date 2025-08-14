import { useEffect, useState } from 'react';

const THEME_STORAGE_KEY = 'app-theme-preference';

export type ThemePreference = 'light' | 'dark' | 'auto';

export const useThemePreference = () => {
  const [theme, setTheme] = useState<ThemePreference>(() => {
    // Intentar obtener el tema guardado del localStorage
    try {
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme && ['light', 'dark', 'auto'].includes(savedTheme)) {
        return savedTheme as ThemePreference;
      }
    } catch (error) {
      console.warn('Error loading theme preference:', error);
    }
    return 'auto'; // Valor por defecto
  });

  // Guardar el tema en localStorage cuando cambie
  useEffect(() => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (error) {
      console.warn('Error saving theme preference:', error);
    }
  }, [theme]);

  const resetTheme = () => {
    try {
      localStorage.removeItem(THEME_STORAGE_KEY);
      setTheme('auto');
    } catch (error) {
      console.warn('Error resetting theme preference:', error);
    }
  };

  return {
    theme,
    setTheme,
    resetTheme,
  };
};
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useMediaQuery } from '../hooks/useMediaQuery';

interface ThemeContextType {
  darkMode: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  darkMode: false
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Usar el hook useMediaQuery para detectar la preferencia del sistema
  const systemPrefersDark = useMediaQuery('(prefers-color-scheme: dark)');
  const [darkMode, setDarkMode] = useState(systemPrefersDark);

  // Actualizar darkMode cuando cambie la preferencia del sistema
  useEffect(() => {
    setDarkMode(systemPrefersDark);
  }, [systemPrefersDark]);

  // Actualizar las clases en el HTML
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <ThemeContext.Provider value={{ darkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
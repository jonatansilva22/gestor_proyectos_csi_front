/**
 * Utilidades para manejo de temas
 */

export const THEME_EVENTS = {
  AUTO_CHANGE: 'themeAutoChange',
  THEME_CHANGE: 'themeChange',
} as const;

/**
 * Obtiene el tema actual del sistema operativo
 */
export const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'light';
  
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

/**
 * Verifica si el navegador soporta detección de preferencias de color
 */
export const supportsColorSchemeQuery = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  return window.matchMedia && window.matchMedia('(prefers-color-scheme)').matches !== undefined;
};

/**
 * Obtiene información detallada sobre el estado del tema
 */
export const getThemeInfo = (currentTheme: 'light' | 'dark' | 'auto') => {
  const systemTheme = getSystemTheme();
  const isDarkMode = currentTheme === 'auto' ? systemTheme === 'dark' : currentTheme === 'dark';
  
  return {
    currentTheme,
    systemTheme,
    isDarkMode,
    isAuto: currentTheme === 'auto',
    effectiveTheme: isDarkMode ? 'dark' : 'light',
    supportsSystemDetection: supportsColorSchemeQuery(),
  };
};

/**
 * Escucha cambios en las preferencias del sistema
 */
export const listenToSystemThemeChanges = (callback: (isDark: boolean) => void) => {
  if (!supportsColorSchemeQuery()) return () => {};

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  
  const handler = (e: MediaQueryListEvent) => {
    callback(e.matches);
  };

  // Verificar si el método existe (compatibilidad con navegadores más antiguos)
  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  } else {
    // Fallback para navegadores más antiguos
    mediaQuery.addListener(handler);
    return () => mediaQuery.removeListener(handler);
  }
};

/**
 * Aplica las clases CSS necesarias para el tema
 */
export const applyThemeClasses = (isDark: boolean, theme: string) => {
  const root = document.documentElement;
  
  // Aplicar/remover clase dark
  if (isDark) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
  
  // Agregar atributos de datos para debugging y CSS customizado
  root.setAttribute('data-theme', theme);
  root.setAttribute('data-color-scheme', isDark ? 'dark' : 'light');
  
  // Meta tag para el color de la barra de estado en móviles
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    metaThemeColor.setAttribute('content', isDark ? '#1f2937' : '#ffffff');
  }
};

/**
 * Obtiene los colores CSS custom properties para el tema actual
 */
export const getThemeColors = () => {
  const computedStyle = getComputedStyle(document.documentElement);
  
  return {
    primary: {
      500: `rgb(${computedStyle.getPropertyValue('--color-primary-500').trim()})`,
      600: `rgb(${computedStyle.getPropertyValue('--color-primary-600').trim()})`,
      700: `rgb(${computedStyle.getPropertyValue('--color-primary-700').trim()})`,
    },
    secondary: {
      500: `rgb(${computedStyle.getPropertyValue('--color-secondary-500').trim()})`,
      600: `rgb(${computedStyle.getPropertyValue('--color-secondary-600').trim()})`,
      700: `rgb(${computedStyle.getPropertyValue('--color-secondary-700').trim()})`,
    },
    surface: {
      primary: `rgb(${computedStyle.getPropertyValue('--color-surface-primary').trim()})`,
      secondary: `rgb(${computedStyle.getPropertyValue('--color-surface-secondary').trim()})`,
      tertiary: `rgb(${computedStyle.getPropertyValue('--color-surface-tertiary').trim()})`,
    },
    text: {
      primary: `rgb(${computedStyle.getPropertyValue('--color-text-primary').trim()})`,
      secondary: `rgb(${computedStyle.getPropertyValue('--color-text-secondary').trim()})`,
      tertiary: `rgb(${computedStyle.getPropertyValue('--color-text-tertiary').trim()})`,
    },
  };
};

/**
 * Valida si un valor es un tema válido
 */
export const isValidTheme = (theme: string): theme is 'light' | 'dark' | 'auto' => {
  return ['light', 'dark', 'auto'].includes(theme);
};

/**
 * Obtiene el nombre descriptivo del tema
 */
export const getThemeName = (theme: 'light' | 'dark' | 'auto'): string => {
  const themeNames = {
    light: 'Tema Claro',
    dark: 'Tema Oscuro',
    auto: 'Automático'
  };
  
  return themeNames[theme];
};

/**
 * Obtiene la descripción del tema
 */
export const getThemeDescription = (theme: 'light' | 'dark' | 'auto'): string => {
  const descriptions = {
    light: 'Ideal para uso durante el día con buena iluminación',
    dark: 'Perfecto para uso nocturno o en ambientes con poca luz',
    auto: 'Se adapta automáticamente según la configuración del sistema'
  };
  
  return descriptions[theme];
};
/**
 * Sistema de colores centralizado para la aplicación
 * Define colores semánticos que se adaptan automáticamente al tema
 */

export const colors = {
  // Colores principales del sistema
  primary: {
    50: 'var(--color-primary-50)',
    100: 'var(--color-primary-100)',
    200: 'var(--color-primary-200)',
    300: 'var(--color-primary-300)',
    400: 'var(--color-primary-400)',
    500: 'var(--color-primary-500)',
    600: 'var(--color-primary-600)',
    700: 'var(--color-primary-700)',
    800: 'var(--color-primary-800)',
    900: 'var(--color-primary-900)',
  },

  // Colores secundarios
  secondary: {
    50: 'var(--color-secondary-50)',
    100: 'var(--color-secondary-100)',
    200: 'var(--color-secondary-200)',
    300: 'var(--color-secondary-300)',
    400: 'var(--color-secondary-400)',
    500: 'var(--color-secondary-500)',
    600: 'var(--color-secondary-600)',
    700: 'var(--color-secondary-700)',
    800: 'var(--color-secondary-800)',
    900: 'var(--color-secondary-900)',
  },

  // Colores de superficie y fondo
  surface: {
    primary: 'var(--color-surface-primary)',
    secondary: 'var(--color-surface-secondary)',
    tertiary: 'var(--color-surface-tertiary)',
    overlay: 'var(--color-surface-overlay)',
    elevated: 'var(--color-surface-elevated)',
  },

  // Colores de texto
  text: {
    primary: 'var(--color-text-primary)',
    secondary: 'var(--color-text-secondary)',
    tertiary: 'var(--color-text-tertiary)',
    inverse: 'var(--color-text-inverse)',
    disabled: 'var(--color-text-disabled)',
  },

  // Colores de borde
  border: {
    primary: 'var(--color-border-primary)',
    secondary: 'var(--color-border-secondary)',
    focus: 'var(--color-border-focus)',
    error: 'var(--color-border-error)',
  },

  // Estados de elementos
  state: {
    hover: 'var(--color-state-hover)',
    pressed: 'var(--color-state-pressed)',
    focus: 'var(--color-state-focus)',
    disabled: 'var(--color-state-disabled)',
  },

  // Colores de estado/feedback
  feedback: {
    success: {
      bg: 'var(--color-success-bg)',
      text: 'var(--color-success-text)',
      border: 'var(--color-success-border)',
    },
    warning: {
      bg: 'var(--color-warning-bg)',
      text: 'var(--color-warning-text)',
      border: 'var(--color-warning-border)',
    },
    error: {
      bg: 'var(--color-error-bg)',
      text: 'var(--color-error-text)',
      border: 'var(--color-error-border)',
    },
    info: {
      bg: 'var(--color-info-bg)',
      text: 'var(--color-info-text)',
      border: 'var(--color-info-border)',
    },
  },

  // Gradientes del sistema
  gradients: {
    primary: 'var(--gradient-primary)',
    secondary: 'var(--gradient-secondary)',
    accent: 'var(--gradient-accent)',
    surface: 'var(--gradient-surface)',
  },

  // Sombras
  shadows: {
    sm: 'var(--shadow-sm)',
    md: 'var(--shadow-md)',
    lg: 'var(--shadow-lg)',
    xl: 'var(--shadow-xl)',
    inner: 'var(--shadow-inner)',
  },
} as const;

// Utilidades para usar los colores en componentes
export const getColor = (colorPath: string): string | undefined => {
  const paths = colorPath.split('.');
  let current: Record<string, unknown> = colors;
  
  for (const path of paths) {
    current = current[path] as Record<string, unknown>;
    if (!current) return undefined;
  }
  
  return current as unknown as string;
};

// Tipos para autocompletado
export type ColorPath = keyof typeof colors;
export type PrimaryColorShade = keyof typeof colors.primary;
export type SecondaryColorShade = keyof typeof colors.secondary;
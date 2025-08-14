/** @type {import('tailwindcss').Config} */

// Función para generar la paleta de colores con variables CSS
const withOpacity = (variableName) => {
  return ({ opacityValue }) => {
    if (opacityValue !== undefined) {
      return `rgba(var(${variableName}), ${opacityValue})`;
    }
    return `rgb(var(${variableName}))`;
  };
};

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  darkMode: 'class',

  theme: {
    extend: {
      fontFamily: {
        'roboto': ['Roboto', 'sans-serif'],
      },
      // Responsive breakpoints
      screens: {
        'xs': '475px',
        '3xl': '1600px',
      },
      // Container sizes for responsive layout
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '1.5rem',
          lg: '2rem',
          xl: '2.5rem',
          '2xl': '3rem',
        },
      },
      // Spacing utilities for mobile interfaces
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      // Paleta de colores extendida con variables CSS
      colors: {
        primary: {
          50: withOpacity('--color-primary-50'),
          100: withOpacity('--color-primary-100'),
          200: withOpacity('--color-primary-200'),
          300: withOpacity('--color-primary-300'),
          400: withOpacity('--color-primary-400'),
          500: withOpacity('--color-primary-500'),
          600: withOpacity('--color-primary-600'),
          700: withOpacity('--color-primary-700'),
          800: withOpacity('--color-primary-800'),
          900: withOpacity('--color-primary-900'),
        },
        secondary: {
          50: withOpacity('--color-secondary-50'),
          100: withOpacity('--color-secondary-100'),
          200: withOpacity('--color-secondary-200'),
          300: withOpacity('--color-secondary-300'),
          400: withOpacity('--color-secondary-400'),
          500: withOpacity('--color-secondary-500'),
          600: withOpacity('--color-secondary-600'),
          700: withOpacity('--color-secondary-700'),
          800: withOpacity('--color-secondary-800'),
          900: withOpacity('--color-secondary-900'),
        },
        surface: {
          primary: withOpacity('--color-surface-primary'),
          secondary: withOpacity('--color-surface-secondary'),
          tertiary: withOpacity('--color-surface-tertiary'),
          overlay: withOpacity('--color-surface-overlay'),
          elevated: withOpacity('--color-surface-elevated'),
        },
        text: {
          primary: withOpacity('--color-text-primary'),
          secondary: withOpacity('--color-text-secondary'),
          tertiary: withOpacity('--color-text-tertiary'),
          inverse: withOpacity('--color-text-inverse'),
          disabled: withOpacity('--color-text-disabled'),
        },
        border: {
          primary: withOpacity('--color-border-primary'),
          secondary: withOpacity('--color-border-secondary'),
          focus: withOpacity('--color-border-focus'),
          error: withOpacity('--color-border-error'),
        },
        feedback: {
          success: withOpacity('--color-success-text'),
          warning: withOpacity('--color-warning-text'),
          error: withOpacity('--color-error-text'),
          info: withOpacity('--color-info-text'),
        },
      },
      backgroundColor: {
        // Sobrescribir `bg` para usar nuestras variables
        primary: withOpacity('--color-primary-500'),
        secondary: withOpacity('--color-secondary-500'),
        surface: {
          primary: withOpacity('--color-surface-primary'),
          secondary: withOpacity('--color-surface-secondary'),
          tertiary: withOpacity('--color-surface-tertiary'),
          overlay: withOpacity('--color-surface-overlay'),
          elevated: withOpacity('--color-surface-elevated'),
        },
        feedback: {
          success: withOpacity('--color-success-bg'),
          warning: withOpacity('--color-warning-bg'),
          error: withOpacity('--color-error-bg'),
          info: withOpacity('--color-info-bg'),
        },
      },
      // Gradientes como background images
      backgroundImage: {
        'gradient-primary': 'var(--gradient-primary)',
        'gradient-secondary': 'var(--gradient-secondary)',
        'gradient-accent': 'var(--gradient-accent)',
        'gradient-surface': 'var(--gradient-surface)',
      },
      // Sombras del sistema
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        xl: 'var(--shadow-xl)',
        inner: 'var(--shadow-inner)',
      },
    },
  },
  plugins: [],
};

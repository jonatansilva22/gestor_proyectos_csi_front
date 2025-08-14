import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: '0.0.0.0', // Permite acceso desde la red local
    port: 3000,      // Puerto fijo
    open: false,     // No abrir automáticamente
    hmr: {
      port: 3001,    // Puerto diferente para HMR
    },
  },
})

// src/components/common/Header.tsx
// Componente de encabezado responsive con navegación móvil
// Muestra el logo, título de página y botón de menú hamburguesa en móvil

import { useState } from 'react';
import logo from '../../assets/logo-csi.png';
import { MobileNav } from './MobileNav';

/**
 * Props para el componente Header
 */
interface HeaderProps {
  title: string;  // Título a mostrar en el encabezado
}

/**
 * Componente de encabezado principal de la aplicación
 * Incluye logo, título y navegación móvil
 */
export const Header = ({ title }: HeaderProps) => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <>
      <header className="w-full bg-purple-700 flex items-center h-14 sm:h-16 px-4 sm:px-6">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileNavOpen(true)}
          className="lg:hidden p-2 -ml-2 mr-2 text-white hover:bg-purple-600 rounded-md transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <img src={logo} alt="Logo" className="h-6 w-6 sm:h-8 sm:w-8 mr-2 sm:mr-3 flex-shrink-0" />
        <span className="text-white text-lg sm:text-xl font-normal truncate">{title}</span>
      </header>

      <MobileNav 
        isOpen={isMobileNavOpen} 
        onClose={() => setIsMobileNavOpen(false)} 
      />
    </>
  );
};
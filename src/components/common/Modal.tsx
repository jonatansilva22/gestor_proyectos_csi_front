// src/components/common/Modal.tsx
// Componente modal reutilizable con diseño responsive
// Incluye overlay, botón de cierre y área de contenido personalizable

import React from "react";

/**
 * Props para el componente Modal
 */
interface ModalProps {
  open: boolean;                  // Estado de visibilidad del modal
  onClose: () => void;           // Función para cerrar el modal
  children: React.ReactNode;     // Contenido del modal
  title?: string;                // Título opcional del modal
}

/**
 * Componente modal reutilizable con diseño responsive
 * Incluye overlay clickeable para cerrar y botón X
 */
export const Modal = ({ open, onClose, children, title }: ModalProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Fondo oscuro */}
      <div
        className="fixed inset-0 bg-black/40 z-40"
        onClick={onClose}
      />
      {/* Modal */}
      <div
        className="relative bg-white rounded-lg shadow-lg w-full max-w-xl max-h-[90vh] overflow-y-auto z-50"
        onClick={e => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b p-4 sm:p-6 flex items-center justify-between">
          {title && (
            <h2 className="text-lg sm:text-2xl font-bold text-purple-700 pr-4 truncate">
              {title}
            </h2>
          )}
          <button
            className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-2xl text-purple-700 hover:bg-gray-100 rounded-full cursor-pointer transition-colors"
            onClick={onClose}
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>
        <div className="p-4 sm:p-6">
          {children}
        </div>
      </div>
    </div>
  );
};
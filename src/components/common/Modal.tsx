import React from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export const Modal = ({ open, onClose, children, title }: ModalProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Fondo oscuro */}
      <div
        className="fixed inset-0 bg-black/40 z-40"
        onClick={onClose}
      />
      {/* Modal */}
      <div
        className="relative bg-white rounded-lg shadow-lg w-full max-w-xl mx-4 p-6 z-50"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          {title && <h2 className="text-2xl font-bold text-purple-700">{title}</h2>}
          <button
            className="text-2xl text-purple-700 hover:bg-gray-100  cursor-pointer"
            onClick={onClose}
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};
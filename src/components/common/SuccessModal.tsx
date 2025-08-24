import React from 'react';
import { Modal } from './Modal';
import { useTheme } from '../../context/ThemeContext';

interface SuccessModalProps {
  open: boolean;
  title?: string;
  message?: React.ReactNode;
  onClose: () => void;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({ open, title = 'Operación exitosa', message, onClose }) => {
  const { darkMode } = useTheme();

  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      <div className="flex items-start gap-3">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${darkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-600'}`}>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className={darkMode ? 'text-white' : 'text-gray-800'}>
          {message}
        </div>
      </div>
      <div className="flex justify-end mt-6">
        <button
          className="bg-purple-600 text-white px-6 py-2 rounded font-semibold hover:bg-purple-700 transition cursor-pointer"
          onClick={onClose}
        >
          Cerrar
        </button>
      </div>
    </Modal>
  );
};


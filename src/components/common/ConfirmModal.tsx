import React from 'react';
import { Modal } from './Modal';
import { useTheme } from '../../context/ThemeContext';

interface ConfirmModalProps {
  open: boolean;
  title?: string;
  description?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  open,
  title = 'Confirmar acción',
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  onCancel,
  onConfirm,
}) => {
  const { darkMode } = useTheme();

  return (
    <Modal open={open} onClose={onCancel} title={title} size="md">
      <div className="p-2">
        {description && (
          <div className={darkMode ? 'text-white' : 'text-gray-800'}>{description}</div>
        )}
        <div className="flex justify-end gap-2 mt-6">
          <button
            className={`${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-800'} hover:underline cursor-pointer`}
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
          <button
            className="bg-purple-600 text-white px-6 py-2 rounded font-semibold hover:bg-purple-700 transition cursor-pointer"
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
};


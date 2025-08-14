import React from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { User } from '../../../types/user';
import { Modal } from '../../../components/common/Modal';

interface DeleteUserModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}

const DeleteUserModal: React.FC<DeleteUserModalProps> = ({
  user,
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
}) => {
  const { darkMode } = useTheme();

  if (!isOpen) return null;

  return (
    <Modal open={isOpen} onClose={onClose} title="Eliminar Usuario" size="sm">
      <div className="p-2 sm:p-0">
            {/* Warning Icon */}
            <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full ${
              darkMode ? 'bg-red-900/50' : 'bg-red-100'
            }`}>
              <svg
                className="h-6 w-6 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>

            {/* Title */}
            <div className="mt-3 text-center sm:mt-5">
              {/* Title provided by Modal header */}
              
              <div className="mt-2">
                <p className={`text-sm ${
                  darkMode ? 'text-gray-300' : 'text-gray-500'
                }`}>
                  ¿Estás seguro de que quieres eliminar al usuario{' '}
                  <span className="font-semibold text-red-500">
                    {user.username}
                  </span>
                  ? Esta acción no se puede deshacer.
                </p>
              </div>

              {/* User Info */}
              <div className={`mt-4 p-3 rounded-xl ${
                darkMode ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <div className="text-left space-y-1">
                  <p className={`text-sm font-medium ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {user.first_name} {user.last_name}
                  </p>
                  <p className={`text-sm ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {user.email}
                  </p>
                  <p className={`text-xs px-2 py-1 rounded-full inline-block ${
                    user.role === 1
                      ? darkMode 
                        ? 'bg-purple-900/50 text-purple-300' 
                        : 'bg-purple-100 text-purple-700'
                      : user.role === 2 
                      ? darkMode 
                        ? 'bg-red-900/50 text-red-300'
                        : 'bg-red-100 text-red-700'
                      : darkMode 
                        ? 'bg-gray-700 text-gray-300'
                        : 'bg-gray-100 text-gray-700'
                  }`}>
                    {user.role === 2 ? 'SuperAdmin' : user.role === 1 ? 'Admin' : 'Colaborador'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className={`px-0 sm:px-0 py-3 sm:flex sm:flex-row-reverse border-t ${
            darkMode ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                disabled={isDeleting}
                onClick={onConfirm}
                className="inline-flex justify-center rounded-xl bg-red-600 px-4 py-2 text-base font-semibold text-white shadow-sm hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isDeleting ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Eliminando...
                  </div>
                ) : (
                  'Eliminar'
                )}
              </button>
              
              <button
                type="button"
                onClick={onClose}
                disabled={isDeleting}
                className={`inline-flex justify-center rounded-xl px-4 py-2 text-base font-semibold shadow-sm transition-colors ${
                  darkMode 
                    ? 'bg-gray-700 text-white hover:bg-gray-600 border border-gray-600'
                    : 'bg-white text-gray-900 hover:bg-gray-50 border border-gray-300'
                }`}
              >
                Cancelar
              </button>
            </div>
          </div>
    </Modal>
  );
};

export default DeleteUserModal;

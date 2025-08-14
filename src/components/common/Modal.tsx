import React, { useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export const Modal = ({ open, onClose, children, title, size = 'lg' }: ModalProps) => {
  const { darkMode } = useTheme();
  
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onClose();
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open, onClose]);
  
  if (!open) return null;

  // Responsive size classes
  const sizeClasses = {
    sm: 'max-w-sm sm:max-w-md',
    md: 'max-w-md sm:max-w-lg',
    lg: 'max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-3xl',
    xl: 'max-w-xl sm:max-w-2xl md:max-w-4xl lg:max-w-5xl',
    full: 'max-w-[95vw] sm:max-w-[90vw] md:max-w-[85vw]'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 ${
          darkMode ? 'bg-black/70' : 'bg-black/50'
        }`}
        onClick={onClose}
        aria-label="Cerrar modal"
      />
      
      {/* Modal */}
      <div
        className={`relative rounded-xl shadow-2xl w-full ${sizeClasses[size]} max-h-[95vh] sm:max-h-[90vh] overflow-hidden z-50 transform transition-all duration-300 ${
          darkMode 
            ? 'bg-[#3A2B5A] border border-purple-700/30 shadow-purple-900/20' 
            : 'bg-white border border-gray-200'
        }`}
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
      >
        {/* Header */}
        <div className={`flex items-center justify-between p-4 sm:p-6 border-b ${
          darkMode ? 'border-purple-700/30' : 'border-gray-200'
        }`}>
          {title && (
            <h2 
              id="modal-title"
              className={`text-lg sm:text-xl md:text-2xl font-bold pr-4 ${
                darkMode ? 'text-purple-300' : 'text-purple-700'
              }`}
            >
              {title}
            </h2>
          )}
          
          {/* Close button - Touch optimized */}
          <button
            className={`min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-95 ${
              darkMode 
                ? 'text-purple-300 hover:bg-purple-700/20 hover:text-purple-200 focus:ring-purple-400 focus:ring-offset-gray-800'
                : 'text-purple-700 hover:bg-gray-100 hover:text-purple-800 focus:ring-purple-500 focus:ring-offset-white'
            }`}
            onClick={onClose}
            aria-label="Cerrar modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Content - Scrollable */}
        <div className="overflow-y-auto max-h-[calc(95vh-140px)] sm:max-h-[calc(90vh-140px)]">
          <div className="p-4 sm:p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
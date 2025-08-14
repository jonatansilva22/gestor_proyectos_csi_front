import React from 'react';
import { useTheme } from '../../context/ThemeContext';

interface DeleteButtonProps {
  onDelete: () => void;
  ariaLabel?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'icon' | 'text';
  children?: React.ReactNode;
}

export const DeleteButton: React.FC<DeleteButtonProps> = ({
  onDelete,
  ariaLabel = 'Eliminar',
  disabled = false,
  size = 'md',
  variant = 'icon',
  children
}) => {
  const { darkMode } = useTheme();

  const sizeClasses = {
    sm: 'min-h-[36px] min-w-[36px] p-1.5',
    md: 'min-h-[44px] min-w-[44px] p-2',
    lg: 'min-h-[48px] min-w-[48px] p-2.5'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const baseClasses = `
    rounded-lg transition-all duration-200 
    focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:ring-offset-1 
    active:scale-95 hover:shadow-md group
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
  `;

  const colorClasses = darkMode
    ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 hover:border-red-400/50'
    : 'bg-red-500/10 hover:bg-red-500/20 text-red-600 border border-red-500/20 hover:border-red-500/30';

  if (variant === 'text') {
    return (
      <button
        onClick={onDelete}
        disabled={disabled}
        className={`${baseClasses} ${colorClasses} px-3 py-2 text-sm font-medium flex items-center gap-2`}
        aria-label={ariaLabel}
      >
        <svg 
          className={`${iconSizes.sm} group-hover:scale-110 transition-transform duration-200`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
          strokeWidth={2}
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
          />
        </svg>
        {children || 'Eliminar'}
      </button>
    );
  }

  return (
    <button
      onClick={onDelete}
      disabled={disabled}
      className={`${baseClasses} ${colorClasses} ${sizeClasses[size]}`}
      aria-label={ariaLabel}
    >
      <svg 
        className={`${iconSizes[size]} group-hover:scale-110 transition-transform duration-200`} 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
        strokeWidth={2}
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
        />
      </svg>
    </button>
  );
};

export default DeleteButton;
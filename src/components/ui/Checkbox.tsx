import React from 'react';

interface CheckboxProps {
  checked: boolean;
  onChange: () => void;
  label: string;
  name?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({ 
  checked, 
  onChange, 
  label,
  name 
}) => {
  return (
    <label className="flex items-center cursor-pointer">
      <div className="relative flex items-center">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          name={name}
          className="sr-only"
          aria-label={label}
        />
        <div className={`w-4 h-4 border ${
          checked 
            ? 'bg-primary border-primary' 
            : 'border-gray-400 dark:border-gray-600'
          } rounded`}
        >
          {checked && (
            <svg className="w-4 h-4 text-white fill-current" viewBox="0 0 20 20">
              <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
            </svg>
          )}
        </div>
        <span className="ml-2 text-sm text-dark-text dark:text-gray-300">
          {label}
        </span>
      </div>
    </label>
  );
};
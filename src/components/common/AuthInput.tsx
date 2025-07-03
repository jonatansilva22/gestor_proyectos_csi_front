// src/components/ui/AuthInput.tsx
import React from 'react';

interface AuthInputProps {
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  icon: 'email' | 'password';
  required?: boolean;
  name?: string;
}

export const AuthInput: React.FC<AuthInputProps> = ({ 
  type, 
  value, 
  onChange, 
  placeholder, 
  icon, 
  required,
  name
}) => {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3">
        {icon === 'email' ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        )}
      </div>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        name={name}
        className="w-full py-2 pl-10 pr-3 border border-gray-300 rounded-md 
                  focus:ring-primary focus:border-primary focus:outline-none
                  dark:bg-secondary dark:border-gray-700 dark:text-white"
        aria-label={name}
      />
    </div>
  );
};
// src/components/common/ValidationErrorDisplay.tsx
import React from 'react';

interface ValidationErrorDisplayProps {
  errors: { [key: string]: string };
  className?: string;
}

/**
 * Component to display validation errors in a user-friendly format
 * Shows errors coming from both frontend and backend validation
 */
export const ValidationErrorDisplay: React.FC<ValidationErrorDisplayProps> = ({
  errors,
  className = ""
}) => {
  const errorKeys = Object.keys(errors);

  if (errorKeys.length === 0) {
    return null;
  }

  return (
    <div className={`bg-red-50 border border-red-200 rounded-md p-4 ${className}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-red-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">
            {errorKeys.length === 1 ? 'Error de validación' : 'Errores de validación'}
          </h3>
          <div className="mt-2 text-sm text-red-700">
            <ul className="list-disc space-y-1 pl-5">
              {errorKeys.map((field) => (
                <li key={field}>
                  <span className="font-medium capitalize">
                    {getFieldDisplayName(field)}:
                  </span>{' '}
                  {errors[field]}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Convert field names to user-friendly display names
 */
const getFieldDisplayName = (fieldName: string): string => {
  const fieldDisplayNames: { [key: string]: string } = {
    username: 'Nombre de usuario',
    first_name: 'Nombre',
    last_name: 'Apellido',
    email: 'Correo electrónico',
    password: 'Contraseña',
    role: 'Rol',
    photo: 'Foto de perfil',
    general: 'General'
  };

  return fieldDisplayNames[fieldName] || fieldName;
};

export default ValidationErrorDisplay;
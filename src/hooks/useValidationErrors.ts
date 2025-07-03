// src/hooks/useValidationErrors.ts
import { useState } from 'react';
import { toast } from 'react-toastify';

interface ValidationErrors {
  [key: string]: string | undefined;
}

export const useValidationErrors = () => {
  const [errors, setErrors] = useState<ValidationErrors>({});

  // Clear all errors
  const clearErrors = () => {
    setErrors({});
  };

  // Clear error for specific field
  const clearFieldError = (fieldName: string) => {
    if (errors[fieldName]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  // Set errors from backend response or frontend validation
  const setBackendErrors = (backendErrors: ValidationErrors) => {
    setErrors(backendErrors);
  };

  // Set a single field error
  const setFieldError = (fieldName: string, errorMessage: string) => {
    setErrors(prev => ({
      ...prev,
      [fieldName]: errorMessage
    }));
  };

  // Handle API errors with validation support
  const handleApiError = (error: any) => {
    console.error('API Error:', error);

    // Check if error has validation errors from our enhanced services
    if (error.validationErrors) {
      setBackendErrors(error.validationErrors);
      toast.error('Por favor corrige los errores en el formulario');
      return;
    }

    // Handle specific error messages
    if (error.message) {
      toast.error(error.message);
      return;
    }

    // Handle HTTP status codes
    if (error.response?.status) {
      switch (error.response.status) {
        case 400:
          toast.error('Error en los datos enviados');
          break;
        case 401:
          toast.error('Credenciales inválidas');
          break;
        case 403:
          toast.error('No tienes permisos para realizar esta acción');
          break;
        case 404:
          toast.error('Recurso no encontrado');
          break;
        case 500:
          toast.error('Error interno del servidor');
          break;
        default:
          toast.error('Error inesperado. Por favor intenta nuevamente');
      }
      return;
    }

    // Generic error message
    toast.error('Error inesperado. Por favor intenta nuevamente');
  };

  return {
    errors,
    setErrors,
    clearErrors,
    clearFieldError,
    setFieldError,
    setBackendErrors,
    handleApiError,
    hasErrors: Object.keys(errors).length > 0
  };
};

export default useValidationErrors;
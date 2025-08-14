// src/hooks/useValidationErrors.ts
import { useState } from 'react';
import { notifyError, notifyWarning } from '../components/common/ToastNotify';

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
      const fieldCount = Object.keys(error.validationErrors).length;
      notifyError(
        fieldCount === 1 
          ? 'Se encontró un error en el formulario. Por favor corrígelo.' 
          : `Se encontraron ${fieldCount} errores en el formulario. Por favor corrígelos.`,
        {
          autoClose: 5000,
          position: "top-center"
        }
      );
      return;
    }

    // Check for specific backend error messages
    if (error.response?.data?.message) {
      notifyError(error.response.data.message, {
        autoClose: 4000,
        position: "top-center"
      });
      return;
    }

    // Handle specific error messages
    if (error.message) {
      notifyError(error.message, {
        autoClose: 4000,
        position: "top-center"
      });
      return;
    }

    // Handle HTTP status codes with more specific messages
    if (error.response?.status) {
      switch (error.response.status) {
        case 400:
          // Check for specific 400 error details
          if (error.response.data?.detail) {
            notifyError(error.response.data.detail, {
              autoClose: 5000,
              position: "top-center"
            });
          } else {
            notifyError('Los datos enviados contienen errores. Verifica la información.', {
              autoClose: 4000,
              position: "top-center"
            });
          }
          break;
        case 401:
          notifyError('Credenciales inválidas o sesión expirada', {
            autoClose: 4000,
            position: "top-center"
          });
          break;
        case 403:
          notifyError('No tienes permisos suficientes para realizar esta acción', {
            autoClose: 4000,
            position: "top-center"
          });
          break;
        case 404:
          notifyError('El recurso solicitado no fue encontrado', {
            autoClose: 4000,
            position: "top-center"
          });
          break;
        case 409:
          notifyError('Ya existe un recurso con estos datos. Verifica la información.', {
            autoClose: 5000,
            position: "top-center"
          });
          break;
        case 422:
          notifyError('Los datos enviados no cumplen con los requisitos del sistema', {
            autoClose: 5000,
            position: "top-center"
          });
          break;
        case 500:
          notifyError('Error interno del servidor. El equipo técnico ha sido notificado.', {
            autoClose: 6000,
            position: "top-center"
          });
          break;
        case 502:
        case 503:
          notifyError('Servicio temporalmente no disponible. Intenta nuevamente en unos minutos.', {
            autoClose: 6000,
            position: "top-center"
          });
          break;
        default:
          notifyError(`Error inesperado (${error.response.status}). Por favor intenta nuevamente.`, {
            autoClose: 4000,
            position: "top-center"
          });
      }
      return;
    }

    // Manejo especial para timeouts que pueden ser éxitos
    if (error.possibleSuccess) {
      notifyWarning(error.message, {
        autoClose: 8000,
        position: "top-center"
      });
      return;
    }
    
    // Generic error message
    notifyError('Error de conexión. Verifica tu internet e intenta nuevamente.', {
      autoClose: 4000,
      position: "top-center"
    });
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

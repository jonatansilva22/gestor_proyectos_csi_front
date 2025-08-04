import React from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context";
import { CreateUserForm } from "../../components/user";
import { CreateUserRequest } from "../../types";

export const CreateUser: React.FC = () => {
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  const handleSuccess = (userData: CreateUserRequest) => {
    console.log('Usuario creado:', userData);
    navigate("/dashboard");
  };

  const handleClose = () => {
    navigate("/dashboard");
  };

  return (
    <div
      className={`
        min-h-screen w-full
        ${darkMode ? "bg-gray-900" : "bg-gray-50"}
      `}
    >
      {/* Header */}
      <header className="w-full bg-[#6F43D6] shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center gap-4">
              {/* Back button */}
              <button
                onClick={handleClose}
                className="p-2 text-white hover:bg-purple-600 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-white font-roboto text-lg sm:text-xl lg:text-2xl font-medium">
                Crear Usuario
              </h1>
            </div>

            {/* Close button */}
            <button
              onClick={handleClose}
              className="p-2 text-white hover:bg-purple-600 rounded-lg transition-colors"
              aria-label="Cerrar"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 max-w-7xl">
        <div className="max-w-2xl mx-auto">
          {/* Form container */}
          <div className={`rounded-lg shadow-sm border p-6 sm:p-8 ${
            darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          }`}>
            <div className="mb-6">
              <h2 className={`text-xl sm:text-2xl font-semibold mb-2 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}>
                Información del Usuario
              </h2>
              <p className={`text-sm ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}>
                Complete los siguientes campos para crear un nuevo usuario en el sistema
              </p>
            </div>
            
            <CreateUserForm mode="page" onSuccess={handleSuccess} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateUser;
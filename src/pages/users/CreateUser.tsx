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
        min-h-screen w-full flex flex-col
        ${darkMode ? "bg-[#3A2864]" : "bg-white"}
      `}
    >
      {/* Header */}
      <header className="w-full h-[100px] bg-[#6F43D6] relative flex items-center justify-between px-4 md:px-[77px]">
        <h1 className="text-white font-roboto text-2xl md:text-4xl font-normal leading-[44px]">
          Crear Usuario
        </h1>

        {/* Close button */}
        <button
          onClick={handleClose}
          className="w-6 h-6 cursor-pointer flex items-center justify-center hover:opacity-80 transition-opacity"
          aria-label="Cerrar"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.4 14L0 12.6L5.6 7L0 1.4L1.4 0L7 5.6L12.6 0L14 1.4L8.4 7L14 12.6L12.6 14L7 8.4L1.4 14Z"
              fill="#FEF7FF"
            />
          </svg>
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-6 md:px-[53px] md:py-8">
        <div className="max-w-[480px] mx-auto md:mx-0">
          <CreateUserForm mode="page" onSuccess={handleSuccess} />
        </div>
      </main>
    </div>
  );
};

export default CreateUser;
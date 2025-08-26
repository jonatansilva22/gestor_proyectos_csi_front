// src/components/permissions/PermissionsHeader.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface PermissionsHeaderProps {
  title?: string;
  onBack?: () => void;
}

export const PermissionsHeader: React.FC<PermissionsHeaderProps> = ({
  onBack,
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      // Redirigir según el rol del usuario
      const defaultPath = user?.role === 3 ? "/projects" : "/dashboard";
      navigate(defaultPath);
    }
  };

  return (
    <header className="w-full h-[120px] bg-[#6F43D6] relative flex items-center px-8">
      {/* Logo del CSI y el texto a la izquierda */}
      <div className="flex items-center text-white">
        <button onClick={handleBack} className="mr-4 hover:opacity-80">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <img
          src="/src/assets/logo.png"
          alt="CSI PRO Logo"
          className="h-18 w-18 sm:h-22 sm:w-22 mr-3 sm:mr-4"
        />
        <span className="font-bold text-2xl sm:text-3xl">CSI PRO</span>
      </div>
    </header>
  );
};

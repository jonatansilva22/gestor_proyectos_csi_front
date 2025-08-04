// src/components/permissions/TableHeader.tsx
import React from "react";
import { useTheme } from "../../context/ThemeContext";

export const TableHeader: React.FC = () => {
  const { darkMode } = useTheme();

  return (
    <div>
      {/* Título de la tabla con flecha */}
      <div className={`flex items-center justify-between py-4 px-6 ${
        darkMode 
          ? "bg-[#3A2B5A] text-white" 
          : "bg-white text-black"
      }`}>
        {/* Back button */}
        <button
          onClick={() => window.history.back()}
          className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors duration-200 ${
            darkMode ? "hover:bg-purple-500" : "hover:bg-gray-200"
          }`}
          aria-label="Volver"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 26 23"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={darkMode ? "text-white" : "text-black"}
          >
            <path
              d="M6.38926 12.875L15.2559 20.575L12.9997 22.5L0.333008 11.5L12.9997 0.5L15.2559 2.425L6.38926 10.125H25.6663V12.875H6.38926Z"
              fill="currentColor"
            />
          </svg>
        </button>

        {/* Title centrado */}
        <h1 className={`font-roboto text-2xl md:text-4xl font-normal leading-[44px] ${
          darkMode ? "text-white" : "text-black"
        }`}>
          alumnos
        </h1>

        {/* Spacer para equilibrar el layout */}
        <div className="w-10 h-10"></div>
      </div>

      {/* Header de la tabla - Grid Structure */}
      <div
        className={`grid grid-cols-12 gap-6 items-center py-4 px-8 border-b ${
          darkMode 
            ? "bg-[#3A2B5A] border-purple-700/40 text-white" 
            : "bg-white border-purple-300 text-black"
        }`}
      >
        {/* Selección */}
        <div className="col-span-1 flex justify-center">
          <span className="font-inter text-sm font-semibold">
            Sel.
          </span>
        </div>

        {/* Nombre */}
        <div className="col-span-4">
          <span className="font-inter text-sm font-semibold">
            Nombre y Permisos
          </span>
        </div>

        {/* Estado */}
        <div className="col-span-2 flex justify-center">
          <span className="font-inter text-sm font-semibold">
            Estado
          </span>
        </div>

        {/* Correo */}
        <div className="col-span-2">
          <span className="font-inter text-sm font-semibold">
            Correo Electrónico
          </span>
        </div>

        {/* Acciones */}
        <div className="col-span-3 flex justify-end pr-4">
          <span className="font-inter text-sm font-semibold">
            Acciones
          </span>
        </div>
      </div>
    </div>
  );
};

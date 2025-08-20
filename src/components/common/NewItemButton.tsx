import React from "react";
import { useTheme } from "../../context/ThemeContext";

interface NewItemButtonProps {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
}

export const NewItemButton = ({ label, onClick, icon }: NewItemButtonProps) => {
  const { darkMode } = useTheme();

  return (
    <button
      className={`px-4 py-3 sm:px-6 sm:py-2 text-base sm:text-sm font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 active:scale-95 min-h-[44px] w-full sm:w-auto flex items-center justify-center gap-2 cursor-pointer ${
        darkMode
          ? 'bg-purple-600 text-white hover:bg-purple-500 shadow-lg shadow-purple-900/30 focus:ring-purple-400 focus:ring-offset-gray-800'
          : 'bg-purple-600 text-white hover:bg-purple-700 shadow-md focus:ring-purple-500 focus:ring-offset-white'
      }`}
      onClick={onClick}
    >
      {icon}
      {label}
    </button>
  );
};
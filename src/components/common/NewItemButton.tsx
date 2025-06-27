import React from "react";

interface NewItemButtonProps {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
}

export const NewItemButton = ({ label, onClick, icon }: NewItemButtonProps) => (
  <button
    className="w-full sm:w-auto bg-purple-600 text-white px-6 py-2 rounded font-semibold hover:bg-purple-700 transition text-base sm:text-lg flex items-center gap-2 cursor-pointer"
    onClick={onClick}
  >
    {icon}
    {label}
  </button>
);
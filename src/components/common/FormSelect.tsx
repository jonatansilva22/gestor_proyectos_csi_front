// src/components/ui/FormSelect.tsx
import React, { useState } from "react";

interface Option {
  value: string;
  label: string;
}

interface FormSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  options: Option[];
  required?: boolean;
  name: string;
  error?: string;
}

export const FormSelect: React.FC<FormSelectProps> = ({
  label,
  value,
  onChange,
  placeholder,
  options,
  required = false,
  name,
  error,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (selectedValue: string) => {
    onChange(selectedValue);
    setIsOpen(false);
  };

  const selectedOption = options.find((option) => option.value === value);

  return (
    <div className="flex flex-col gap-2 w-full">
      <label
        htmlFor={name}
        className="font-inter text-base font-normal leading-[140%] text-gray-900 dark:text-white"
      >
        {label}
        {required && "*"}
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`
            flex h-12 min-w-60 px-3 py-3 items-center gap-2 self-stretch rounded-lg border
            bg-white font-inter text-base font-normal leading-[100%] text-left
            transition-colors duration-200 w-full justify-between
            ${
              error
                ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                : "border-gray-300 focus:border-[#6F43D6] focus:ring-2 focus:ring-purple-200"
            }
            focus:outline-none
          `}
        >
          <span className={selectedOption ? "text-gray-900" : "text-gray-500"}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <svg
            width="10"
            height="6"
            viewBox="0 0 10 6"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`transition-transform duration-200 flex-shrink-0 ${isOpen ? "rotate-180" : ""}`}
          >
            <path
              d="M1 1L5 5L9 1"
              stroke="#1E1E1E"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                className="w-full px-4 py-3 text-left text-gray-900 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg transition-colors duration-200"
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
      {error && <span className="text-red-500 text-sm">{error}</span>}
    </div>
  );
};
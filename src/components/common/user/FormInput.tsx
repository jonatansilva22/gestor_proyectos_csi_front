// src/components/ui/FormInput.tsx
import React from "react";

interface FormInputProps {
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  required?: boolean;
  name: string;
  error?: string;
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  type,
  value,
  onChange,
  placeholder,
  required = false,
  name,
  error,
}) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      <label
        htmlFor={name}
        className="font-inter text-base font-normal leading-[140%] text-gray-900 dark:text-white"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`
          flex min-w-60 px-4 py-3 items-center self-stretch rounded-lg border
          font-inter text-base font-normal leading-[100%]
          transition-colors duration-200 focus:outline-none
          bg-white dark:bg-gray-800 
          ${value 
            ? "text-gray-900 dark:text-white" 
            : "text-gray-500 dark:text-gray-400"
          }
          placeholder:text-gray-500 dark:placeholder:text-gray-400
          ${
            error
              ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-800"
              : "border-gray-300 dark:border-gray-600 focus:border-[#6F43D6] dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-800"
          }
        `}
      />
      {error && <span className="text-red-500 text-sm">{error}</span>}
    </div>
  );
};
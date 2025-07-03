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
        {required && "*"}
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
          bg-white font-inter text-base font-normal leading-[100%]
          transition-colors duration-200 focus:outline-none
          ${value ? "text-gray-900" : "text-gray-500"}
          ${
            error
              ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200"
              : "border-gray-300 focus:border-[#6F43D6] focus:ring-2 focus:ring-purple-200"
          }
        `}
      />
      {error && <span className="text-red-500 text-sm">{error}</span>}
    </div>
  );
};
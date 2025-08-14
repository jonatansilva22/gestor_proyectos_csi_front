import { useTheme } from "../../context/ThemeContext";

interface FormInputProps {
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  placeholder?: string;
  name?: string;
  error?: string;
  disabled?: boolean;
  autoComplete?: string;
  id?: string;
}

export const FormInput = ({
  label,
  type = "text",
  value,
  onChange,
  placeholder = "", 
  required = false,
  name,
  error,
  disabled = false,
  autoComplete,
  id,
}: FormInputProps) => {
  const { darkMode } = useTheme();
  const inputId = id || `input-${name || label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className="flex-1 min-w-0">
      <label 
        htmlFor={inputId}
        className={`block text-sm sm:text-base font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}
      >
        {label}
        {required && (
          <span className="ml-1 text-red-500" aria-label="Campo requerido">*</span>
        )}
      </label>
      
      <input
        id={inputId}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        autoComplete={autoComplete}
        className={`w-full rounded-lg px-4 py-3 sm:py-2.5 text-base sm:text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed ${darkMode ? 'bg-[#3A2B5A] text-white placeholder:text-gray-400' : 'bg-white text-gray-900 placeholder:text-gray-500'} ${
          error 
            ? 'border-2 border-feedback-error focus:ring-feedback-error focus:border-feedback-error'
            : darkMode
              ? 'border border-purple-700/30 hover:border-purple-600 focus:ring-purple-400 focus:border-purple-500 focus:ring-offset-[#1A0F30]'
              : 'border border-gray-300 hover:border-purple-500 focus:ring-purple-500 focus:border-purple-500 focus:ring-offset-white'
        }`}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${inputId}-error` : undefined}
      />
      
      {error && (
        <p 
          id={`${inputId}-error`}
          className={`mt-2 text-sm text-feedback-error`}
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
};
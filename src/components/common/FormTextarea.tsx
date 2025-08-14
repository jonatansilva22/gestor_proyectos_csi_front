import { useTheme } from "../../context/ThemeContext";

interface FormTextareaProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  required?: boolean;
  name?: string;
  error?: string;
  disabled?: boolean;
  rows?: number;
  maxLength?: number;
  id?: string;
}

export const FormTextarea = ({
  label,
  value,
  onChange,
  placeholder = "",
  required = false,
  name,
  error,
  disabled = false,
  rows = 4,
  maxLength,
  id,
}: FormTextareaProps) => {
  const { darkMode } = useTheme();
  const textareaId = id || `textarea-${name || label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className="flex flex-col gap-2 w-full min-w-0">
      <label 
        htmlFor={textareaId}
        className={`text-sm sm:text-base font-semibold ${
          darkMode ? 'text-white' : 'text-gray-700'
        }`}
      >
        {label}
        {required && (
          <span className="ml-1 text-red-500" aria-label="Campo requerido">*</span>
        )}
      </label>
      
      <textarea
        id={textareaId}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        rows={rows}
        maxLength={maxLength}
        className={`w-full rounded-lg px-4 py-3 sm:py-2.5 text-base sm:text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed resize-none ${
          error 
            ? darkMode
              ? 'border-2 border-red-400 bg-[#1A0F30] text-white placeholder:text-purple-300 focus:ring-red-400 focus:border-red-400 focus:ring-offset-gray-800'
              : 'border-2 border-red-500 bg-white text-gray-900 placeholder:text-gray-400 focus:ring-red-500 focus:border-red-500 focus:ring-offset-white'
            : darkMode
              ? 'border border-purple-700/30 bg-[#1A0F30] text-white placeholder:text-purple-300 hover:border-purple-400 focus:ring-purple-400 focus:border-purple-400 focus:ring-offset-gray-800'
              : 'border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 hover:border-purple-400 focus:ring-purple-500 focus:border-purple-500 focus:ring-offset-white'
        }`}
        style={{ 
          minHeight: '44px',
          height: `${Math.max(44, rows * 20)}px`
        }}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error || maxLength ? `${textareaId}-info` : undefined}
      />
      
      {/* Character count and error message */}
      <div className="flex justify-between items-start gap-2">
        {error && (
          <span 
            id={`${textareaId}-info`}
            className={`text-sm flex-1 ${
              darkMode ? 'text-red-400' : 'text-red-600'
            }`}
            role="alert"
          >
            {error}
          </span>
        )}
        
        {maxLength && (
          <span 
            id={!error ? `${textareaId}-info` : undefined}
            className={`text-xs sm:text-sm flex-shrink-0 ${
              value.length > maxLength * 0.9
                ? darkMode ? 'text-yellow-400' : 'text-yellow-600'
                : darkMode ? 'text-purple-300' : 'text-gray-500'
            }`}
            aria-live="polite"
          >
            {value.length}/{maxLength}
          </span>
        )}
      </div>
    </div>
  );
};
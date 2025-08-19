import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "../../context/ThemeContext";

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
  disabled?: boolean;
  id?: string;
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
  disabled = false,
  id,
}) => {
  const { darkMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const selectRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const selectId = id || `select-${name || label.toLowerCase().replace(/\s+/g, '-')}`;

  const filteredOptions = options.filter(o =>
    o.label.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        setIsOpen(!isOpen);
        break;
      case 'Escape':
        setIsOpen(false);
        buttonRef.current?.focus();
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) setIsOpen(true);
        break;
    }
  };

  const handleSelect = (selectedValue: string) => {
    onChange(selectedValue);
    setIsOpen(false);
    setSearch("");
    buttonRef.current?.focus();
  };

  const selectedOption = options.find((option) => option.value === value);

  return (
    <div className="flex flex-col gap-2 w-full min-w-0" ref={selectRef}>
      <label
        htmlFor={selectId}
        className={`text-sm sm:text-base font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}
      >
        {label}{required && <span className="ml-1 text-red-500">*</span>}
      </label>

      <div className="relative">
        <button
          ref={buttonRef}
          id={selectId}
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className={`w-full min-h-[44px] h-12 sm:h-10 px-4 py-3 sm:py-2.5 rounded-lg border text-base sm:text-sm text-left transition-all duration-200 flex items-center justify-between gap-2 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed ${darkMode ? 'bg-[#3A2B5A] text-white border-purple-600/50' : 'bg-white text-gray-900 border-gray-300'} ${error ? 'border-2 border-feedback-error focus:ring-feedback-error focus:border-feedback-error' : darkMode ? 'border-purple-700/30 hover:border-purple-600 focus:ring-purple-400 focus:border-purple-500 focus:ring-offset-[#1A0F30]' : 'border-gray-300 hover:border-purple-500 focus:ring-purple-500 focus:border-purple-500 focus:ring-offset-white'}`}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${selectId}-error` : undefined}
        >
          <span className={`flex-1 truncate ${selectedOption ? (darkMode ? 'text-white' : 'text-gray-900') : (darkMode ? 'text-gray-400' : 'text-gray-500')}`}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>

          <svg className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200 flex-shrink-0 ${isOpen ? "rotate-180" : ""} ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && !disabled && (
          <div className={`absolute top-full left-0 right-0 mt-1 py-1 rounded-lg shadow-xl border z-50 max-h-60 overflow-y-auto ${darkMode ? 'bg-[#3A2B5A] border-purple-700/30' : 'bg-white border-gray-300'} ${darkMode ? 'shadow-purple-900/20' : 'shadow-purple-300/50'}`}>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar..."
              className={`w-full px-3 py-2 mb-1 rounded border ${darkMode ? 'bg-[#2C1F4B] border-purple-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
            />
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={`w-full px-4 py-2 text-left text-sm transition-colors duration-200 focus:outline-none ${value === option.value ? (darkMode ? 'bg-purple-600/20 text-purple-300' : 'bg-purple-600/20 text-purple-600') : (darkMode ? 'text-white hover:bg-purple-700/20' : 'text-gray-900 hover:bg-gray-50')}`}
                  role="option"
                  aria-selected={value === option.value}
                >
                  {option.label}
                </button>
              ))
            ) : (
              <div className={`px-4 py-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                No hay opciones
              </div>
            )}
          </div>
        )}
      </div>

      {error && <span id={`${selectId}-error`} className={`text-sm text-feedback-error`} role="alert">{error}</span>}
    </div>
  );
};

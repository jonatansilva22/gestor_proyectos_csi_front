import React, { useState } from "react";
import { useTheme } from "../../context/ThemeContext";

interface Option {
  value: string;
  label: string;
}

interface Props {
  label: string;
  options: Option[];
  selectedValues: string[];
  onChange: (selected: string[]) => void;
}

export const FormSelectMultiple: React.FC<Props> = ({ label, options, selectedValues, onChange }) => {
  const { darkMode } = useTheme();
  const [search, setSearch] = useState("");

  const filteredOptions = options.filter(o =>
    o.label.toLowerCase().includes(search.toLowerCase())
  );

  const toggleValue = (value: string) => {
    const newSelected = selectedValues.includes(value)
      ? selectedValues.filter(v => v !== value)
      : [...selectedValues, value];
    onChange(newSelected);
  };

  return (
    <div className="space-y-1 w-full">
      <label className={`block font-semibold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{label}</label>

      <div className={`flex flex-col gap-2 max-h-60 overflow-y-auto rounded p-2 shadow-sm transition-colors ${darkMode ? 'bg-[#3A2B5A] border border-purple-700/40' : 'bg-white border border-gray-300'}`}>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar..."
          className={`w-full px-3 py-2 mb-1 rounded border ${darkMode ? 'bg-[#2C1F4B] border-purple-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
        />
        {filteredOptions.map(opt => (
          <div key={opt.value} className={`flex items-center justify-between px-2 py-1 rounded transition-colors ${darkMode ? 'hover:bg-purple-700/20' : 'hover:bg-gray-100'}`}>
            <span className={`text-sm ${darkMode ? 'text-white' : 'text-gray-700'}`}>{opt.label}</span>
            <input
              type="checkbox"
              checked={selectedValues.includes(opt.value)}
              onChange={() => toggleValue(opt.value)}
              className="accent-purple-600 w-4 h-4"
            />
          </div>
        ))}
        {filteredOptions.length === 0 && (
          <div className={`px-2 py-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            No hay opciones
          </div>
        )}
      </div>
    </div>
  );
};

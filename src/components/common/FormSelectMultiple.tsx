
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

export const FormSelectMultiple = ({ label, options, selectedValues, onChange }: Props) => {
  const { darkMode } = useTheme();
  const toggleValue = (value: string) => {
    const newSelected = selectedValues.includes(value)
      ? selectedValues.filter(v => v !== value)
      : [...selectedValues, value];
    onChange(newSelected);
  };

  return (
    <div className="space-y-1 w-full">
      <label className={`block font-semibold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{label}</label>
      <div className={`flex flex-col gap-2 max-h-60 overflow-y-auto rounded p-2 shadow-sm transition-colors ${
        darkMode
          ? 'bg-[#3A2B5A] border border-purple-700/40'
          : 'bg-white border border-gray-300'
      }`}>
        {options.map(opt => (
          <div
            key={opt.value}
            className={`flex items-center justify-between px-2 py-1 rounded transition-colors ${
              darkMode ? 'hover:bg-purple-700/20' : 'hover:bg-gray-100'
            }`}
          >
            <span className={`text-sm ${darkMode ? 'text-white' : 'text-gray-700'}`}>{opt.label}</span>
            <input
              type="checkbox"
              checked={selectedValues.includes(opt.value)}
              onChange={() => toggleValue(opt.value)}
              className="accent-purple-600 w-4 h-4"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

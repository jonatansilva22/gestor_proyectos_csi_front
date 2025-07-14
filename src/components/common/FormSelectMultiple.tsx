import React from "react";

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
  const toggleValue = (value: string) => {
    const newSelected = selectedValues.includes(value)
      ? selectedValues.filter(v => v !== value)
      : [...selectedValues, value];
    onChange(newSelected);
  };

  return (
    <div className="space-y-1">
      <label className="block font-semibold mb-1">{label}</label>
      <div className="flex flex-col gap-2 max-h-60 overflow-y-auto border border-gray-300 rounded p-2 bg-white shadow-sm">
        {options.map(opt => (
          <div
            key={opt.value}
            className="flex items-center justify-between px-2 py-1 rounded hover:bg-gray-100 transition"
          >
            <span className="text-sm text-gray-700">{opt.label}</span>
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

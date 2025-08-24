import { useState } from "react";
import { useTheme } from "../../context/ThemeContext";

interface InlineEditProps {
  value: string | string[];
  onSave: (newValue: string | string[]) => Promise<void> | void;
  renderDisplay?: (value: string | string[]) => React.ReactNode;
  inputType?: "text" | "textarea" | "select" | "date" | "multiselect";
  options?: { value: string; label: string }[];
  className?: string;
}

export const InlineEdit = ({
  value,
  onSave,
  renderDisplay,
  inputType = "text",
  options = [],
  className = "",
}: InlineEditProps) => {
  const { darkMode } = useTheme();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<string | string[]>(value);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    await onSave(draft);
    setEditing(false);
    setLoading(false);
  };

  return editing ? (
    <div className={className}>
      {inputType === "multiselect" ? (
        <div className="flex flex-col gap-1">
          {options.map((opt) => (
            <label key={opt.value} className={`flex items-center gap-2 ${
              darkMode ? 'text-purple-300' : 'text-gray-700'
            }`}>
              <input
                type="checkbox"
                value={opt.value}
                checked={(draft as string[]).includes(opt.value)}
                onChange={(e) => {
                  const val = e.target.value;
                  setDraft((prevDraft) => {
                    const draftArray = Array.isArray(prevDraft) ? [...prevDraft] : [];
                    if (e.target.checked) {
                      return [...draftArray, val];
                    } else {
                      return draftArray.filter((v) => v !== val);
                    }
                  });
                }}
              />
              {opt.label}
            </label>
          ))}
        </div>
      ) : inputType === "select" ? (
        <select
          className={`border rounded px-2 py-1 w-full ${
            darkMode 
              ? 'bg-gray-800 border-purple-600 text-purple-100' 
              : 'bg-white border-gray-300 text-gray-900'
          }`}
          value={draft as string}
          onChange={(e) => setDraft(e.target.value)}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : inputType === "textarea" ? (
        <textarea
          className={`border rounded px-2 py-1 w-full ${
            darkMode 
              ? 'bg-gray-800 border-purple-600 text-purple-100' 
              : 'bg-white border-gray-300 text-gray-900'
          }`}
          value={draft as string}
          onChange={(e) => setDraft(e.target.value)}
        />
      ) : inputType === "date" ? (
        <input
          type="date"
          className={`border rounded px-2 py-1 w-full ${
            darkMode 
              ? 'bg-gray-800 border-purple-600 text-purple-100' 
              : 'bg-white border-gray-300 text-gray-900'
          }`}
          value={draft as string}
          onChange={(e) => setDraft(e.target.value)}
        />
      ) : (
        <input
          className={`border rounded px-2 py-1 w-full ${
            darkMode 
              ? 'bg-gray-800 border-purple-600 text-purple-100' 
              : 'bg-white border-gray-300 text-gray-900'
          }`}
          value={draft as string}
          onChange={(e) => setDraft(e.target.value)}
        />
      )}
      <div className="mt-1 flex gap-2">
        <button
          className={`px-3 py-1 rounded ${
            darkMode 
              ? 'bg-purple-600 hover:bg-purple-700 text-white' 
              : 'bg-purple-600 hover:bg-purple-700 text-white'
          }`}
          onClick={handleSave}
          disabled={loading}
        >
          Guardar
        </button>
        <button
          className={`hover:underline ${
            darkMode 
              ? 'text-purple-400 hover:text-purple-300' 
              : 'text-gray-600 hover:text-gray-800'
          }`}
          onClick={() => setEditing(false)}
          disabled={loading}
        >
          Cancelar
        </button>
      </div>
    </div>
  ) : (
    <div className={className}>
      <span className={darkMode ? 'text-white' : 'text-gray-900'}>
        {renderDisplay ? renderDisplay(value) : String(value)}
      </span>
      <button
        className={`ml-2 text-xs underline ${
          darkMode 
            ? 'text-purple-400 hover:text-purple-300' 
            : 'text-purple-600 hover:text-purple-800'
        }`}
        onClick={() => setEditing(true)}
      >
        Editar
      </button>
    </div>
  );
};
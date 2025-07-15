import { useState } from "react";

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
            <label key={opt.value} className="flex items-center gap-2">
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
          className="border rounded px-2 py-1 w-full"
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
          className="border rounded px-2 py-1 w-full"
          value={draft as string}
          onChange={(e) => setDraft(e.target.value)}
        />
      ) : inputType === "date" ? (
        <input
          type="date"
          className="border rounded px-2 py-1 w-full"
          value={draft as string}
          onChange={(e) => setDraft(e.target.value)}
        />
      ) : (
        <input
          className="border rounded px-2 py-1 w-full"
          value={draft as string}
          onChange={(e) => setDraft(e.target.value)}
        />
      )}
      <div className="mt-1 flex gap-2">
        <button
          className="bg-purple-600 text-white px-3 py-1 rounded"
          onClick={handleSave}
          disabled={loading}
        >
          Guardar
        </button>
        <button
          className="text-gray-600 hover:underline"
          onClick={() => setEditing(false)}
          disabled={loading}
        >
          Cancelar
        </button>
      </div>
    </div>
  ) : (
    <div className={className}>
      <span>{renderDisplay ? renderDisplay(value) : String(value)}</span>
      <button
        className="ml-2 text-xs text-purple-600 underline"
        onClick={() => setEditing(true)}
      >
        Editar
      </button>
    </div>
  );
};
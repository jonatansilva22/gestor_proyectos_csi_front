import { useState } from "react";

interface InlineEditProps {
  value: string;
  onSave: (newValue: string) => Promise<void> | void;
  renderDisplay?: (value: string) => React.ReactNode;
  inputType?: "text" | "textarea" | "select" | "date";
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
  const [draft, setDraft] = useState(value);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    await onSave(draft);
    setEditing(false);
    setLoading(false);
  };

  return editing ? (
    <div className={className}>
      {inputType === "select" ? (
        <select
          className="border rounded px-2 py-1 w-full"
          value={draft}
          onChange={e => setDraft(e.target.value)}
        >
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : inputType === "textarea" ? (
        <textarea
          className="border rounded px-2 py-1 w-full"
          value={draft}
          onChange={e => setDraft(e.target.value)}
        />
      ) : inputType === "date" ? (
        <input
          type="date"
          className="border rounded px-2 py-1 w-full"
          value={draft}
          onChange={e => setDraft(e.target.value)}
        />
      ) : (
        <input
          className="border rounded px-2 py-1 w-full"
          value={draft}
          onChange={e => setDraft(e.target.value)}
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
      <span>{renderDisplay ? renderDisplay(value) : value}</span>
      <button
        className="ml-2 text-xs text-purple-600 underline"
        onClick={() => setEditing(true)}
      >
        Editar
      </button>
    </div>
  );
};
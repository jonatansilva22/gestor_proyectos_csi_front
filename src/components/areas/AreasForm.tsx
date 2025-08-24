import { useState } from "react";
import { FormInput } from "../../components/common/FormInput";
import { Area } from "../../types/areas/Area";
import { useTheme } from "../../context/ThemeContext";

interface AreaFormProps {
  onSubmit: (data: Omit<Area, "id" | "createdAt" | "updatedAt">) => void;
  onCancel: () => void;
  initialData?: Partial<Area>;
}

export const AreaForm = ({ onSubmit, onCancel, initialData }: AreaFormProps) => {
  const { darkMode } = useTheme();
  const [name, setName] = useState(initialData?.name || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, created_at: initialData?.created_at || "", updated_at: initialData?.updated_at || "" });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <FormInput
        label="Nombre"
        value={name}
        onChange={e => setName(e.target.value)}
        required
        placeholder="Nombre del área"
      />
      <div className="flex gap-2 justify-end">
        <button type="button" onClick={onCancel} className={`${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-800'} hover:underline cursor-pointer`}>
          Cancelar
        </button>
        <button type="submit" className="px-6 py-2 rounded bg-purple-600 text-white hover:bg-purple-700 cursor-pointer">
          Crear
        </button>
      </div>
    </form>
  );
};
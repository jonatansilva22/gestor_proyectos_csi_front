import { useState } from "react";
import { FormInput } from "../../components/common/FormInput";
import { Repository } from "../../types/repositories/Repository";
import { useTheme } from "../../context/ThemeContext";

interface RepositoryFormProps {
  onSubmit: (data: Omit<Repository, "id" | "created_at" | "updated_at">) => void;
  onCancel: () => void;
  initialData?: Partial<Repository>;
}

export const RepositoryForm = ({ onSubmit, onCancel, initialData }: RepositoryFormProps) => {
  const { darkMode } = useTheme();
  const [name, setName] = useState(initialData?.name || "");
  const [repositoryUrl, setRepositoryUrl] = useState(initialData?.repository_url || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      repository_url: repositoryUrl,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <FormInput
        label="Nombre del repositorio"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        placeholder="Nombre descriptivo"
      />
      <FormInput
        label="URL del repositorio"
        value={repositoryUrl}
        onChange={(e) => setRepositoryUrl(e.target.value)}
        required
        placeholder="https://abc/123.com"
      />
  
      <div className="flex gap-2 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className={`${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-800'} hover:underline cursor-pointer`}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-6 py-2 rounded bg-purple-600 text-white hover:bg-purple-700 cursor-pointer"
        >
          Guardar
        </button>
      </div>
    </form>
  );
};

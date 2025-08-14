import { useState } from "react";
import { FormInput } from "../../components/common/FormInput";
import { FormImageUpload } from "../../components/common/FormImageUpload";
import { Tool } from "../../types/tools/Tool";

interface ToolFormProps {
  onSubmit: (data: { name: string; image: File | null }) => void;
  onCancel: () => void;
  initialData?: Partial<Tool>;
}

export const ToolForm = ({ onSubmit, onCancel, initialData }: ToolFormProps) => {
  const [name, setName] = useState(initialData?.name || "");
  const [image, setImage] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar que se haya seleccionado una imagen (solo para creación)
    if (!initialData?.id && !image) {
      alert('Por favor selecciona una imagen para la herramienta');
      return;
    }
    
    onSubmit({ name, image });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <FormInput
        label="Nombre"
        value={name}
        onChange={e => setName(e.target.value)}
        required
        placeholder="Nombre de la herramienta"
      />
      <FormImageUpload 
        image={image} 
        onChange={setImage} 
        required={!initialData?.id}
        label={!initialData?.id ? "Imagen (obligatoria)" : "Imagen"}
      />
      <div className="flex gap-2 justify-end">
        <button type="button" onClick={onCancel} className="text-gray-600 hover:underline cursor-pointer">
          Cancelar
        </button>
        <button type="submit" className="px-6 py-2 rounded bg-purple-600 text-white hover:bg-purple-700 cursor-pointer">
          Guardar
        </button>
      </div>
    </form>
  );
};

import { FormLayout } from "../common/FormLayout";
import { FormInput } from "../common/FormInput";
import { FormTextarea } from "../common/FormTextarea";
import { FormImageUpload } from "../common/FormImageUpload";
import { useProjectForm } from "../../hooks/projects/useProjectForm";
import { objectToFormData } from "../../utils/projects/objectToFormData";

interface ProjectFormProps {
  onCancel: () => void;
  onSubmit: (data: FormData) => void;
  projectOwnerId?: number;
  groupId?: number;
  statusId?: number;
}

export const ProjectForm = ({
  onCancel,
  onSubmit,
  projectOwnerId = 1,
  groupId = 1,
  statusId = 1,
}: ProjectFormProps) => {
  const {
    name, setName,
    description, setDescription,
    startDate, setStartDate,
    endDate, setEndDate,
    image, setImage,
    error, setError,
  } = useProjectForm(projectOwnerId, groupId, statusId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (startDate && endDate && startDate > endDate) {
      setError("La fecha final no puede ser menor que la fecha de inicio.");
      return;
    }

    const data = {
      name,
      description,
      project_owner: String(projectOwnerId),
      group: String(groupId),
      status_id: String(statusId),
      start_date: startDate,
      end_date: endDate,
      image,
    };

    const formData = objectToFormData(data);
    onSubmit(formData);
  };

  return (
    <FormLayout
      title="Nuevo Proyecto"
      error={error}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      submitLabel="Crear"
      cancelLabel="Cancelar"
    >
      <div className="flex flex-col md:flex-row gap-4">
        <FormInput
          label="Nombre"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          placeholder="Ingrese el nombre del proyecto"
        />
      </div>
      <FormTextarea
        label="Descripción"
        value={description}
        onChange={e => setDescription(e.target.value)}
        placeholder="Descripción del proyecto"
      />
      <div className="flex flex-col md:flex-row gap-4">
        <FormInput
          label="Fecha de inicio"
          type="date"
          value={startDate}
          onChange={e => setStartDate(e.target.value)}
          required
        />
        <FormInput
          label="Fecha final"
          type="date"
          value={endDate}
          onChange={e => setEndDate(e.target.value)}
          required
        />
      </div>
      <FormImageUpload image={image} onChange={setImage} />
    </FormLayout>
  );
};
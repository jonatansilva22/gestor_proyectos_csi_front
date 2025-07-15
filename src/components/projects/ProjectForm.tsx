import React, { useEffect, useState } from "react";
import {
  getStatusTypes,
  getAreas,
  getTools,
  getGroups,
  getRepositories,
} from "../../services/projects/projectService";

import {
  FormInput,
  FormSelect,

  FileUpload,
} from "../common/"; // o tus rutas reales

import { useProjectForm } from "../../hooks/projects/useProjectForm";
import { FormLayout } from "../common/FormLayout";
import { FormTextarea } from "../common/FormTextarea";
import { FormSelectMultiple } from "../common/FormSelectMultiple"; // Asegúrate de que este componente exista

interface ProjectFormProps {
  project?: any; // o tipo Project si quieres
  onSubmit: (formData: FormData) => Promise<void>;
  onCancel?: () => void;
}

export const ProjectForm = ({ project, onSubmit, onCancel }: ProjectFormProps) => {
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [optionsError, setOptionsError] = useState<string | null>(null);

  // Opciones para selects
  const [owners, setOwners] = useState<{ id: number; name: string }[]>([]);
  const [statuses, setStatuses] = useState<{ id: number; name: string }[]>([]);
  const [groups, setGroups] = useState<{ id: number; name: string }[]>([]);
  const [areas, setAreas] = useState<{ id: number; name: string }[]>([]);
  const [tools, setTools] = useState<{ id: number; name: string }[]>([]);
  const [repositories, setRepositories] = useState<{ id: number; name: string }[]>([]);

  // Cargar opciones al montar
  useEffect(() => {
    async function fetchOptions() {
      try {
        setLoadingOptions(true);
        // Si tienes endpoint para dueños, añádelo aquí también
        // Ejemplo hardcodeado para owner 1 si no hay endpoint:
        const ownersData = [{ id: 1, name: "Owner 1" }]; 

        const [
          statusesData,
          groupsData,
          areasData,
          toolsData,
          repositoriesData,
        ] = await Promise.all([
          getStatusTypes(),
          getGroups(),
          getAreas(),
          getTools(),
          getRepositories(),
        ]);

        setOwners(ownersData);
        setStatuses(statusesData);
        setGroups(groupsData);
        setAreas(areasData);
        setTools(toolsData);
        setRepositories(repositoriesData);
        setOptionsError(null);
      } catch (error: any) {
        setOptionsError(error.message || "Error cargando opciones");
      } finally {
        setLoadingOptions(false);
      }
    }
    fetchOptions();
  }, []);

  // Prepara los datos iniciales para useProjectForm a partir de project (editar)
  const initialFormData = project
    ? {
        name: project.name,
        description: project.description || "",
        startDate: project.start_date ? project.start_date.split("T")[0] : "",
        endDate: project.end_date ? project.end_date.split("T")[0] : "",
        image: null, // para imagen no cargamos archivo, solo cambia si suben uno nuevo
        projectOwner: project.project_owner_id,
        groupId: project.group?.id,
        statusId: project.status?.id,
        areaIds: project.areas?.map((a: any) => a.id) || [],
        toolIds: project.tools?.map((t: any) => t.id) || [],
        repositoryIds: project.repositories?.map((z: any) => z.id) || [],
      }
    : undefined;

  // Usa hook form con valores iniciales
  const {
    name,
    setName,
    description,
    setDescription,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    image,
    setImage,
    groupId,
    setGroupId,
    statusId,
    setStatusId,
    areaIds,
    setAreaIds,
    toolIds,
    setToolIds,
    repositoryIds,
    setRepositoryIds,
    error,
    setError,
  } = useProjectForm(owners[0]?.id || 1, groups[0]?.id || 1, statuses[0]?.id || 1, initialFormData);

  // Convierte arrays y valores a formato FormData para enviar
  const buildFormData = () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    if (image) {
      formData.append("image", image);
    }
    formData.append("project_owner_id", "1"); // aquí deberías tener un select para elegir dueño real si aplica
    formData.append("status_id", statusId.toString());
    if (groupId) formData.append("group_id", groupId.toString());
    formData.append("start_date", startDate);
    formData.append("end_date", endDate);
    areaIds.forEach((id) => formData.append("area_ids", id.toString()));
    toolIds.forEach((id) => formData.append("tool_ids", id.toString()));
    repositoryIds.forEach((id) => formData.append("repository_ids", id.toString()));
    return formData;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones básicas aquí: fechas, nombre, imagen tipo...
    if (name.trim().length < 3) {
      setError("El nombre debe tener al menos 3 caracteres");
      return;
    }
    if (description.length > 500) {
      setError("La descripción debe tener máximo 500 caracteres");
      return;
    }
    if (startDate && endDate && startDate > endDate) {
      setError("La fecha final no puede ser anterior a la fecha inicial");
      return;
    }
    if (image && !["image/jpeg", "image/png"].includes(image.type)) {
      setError("La imagen debe ser JPG o PNG");
      return;
    }

    setError(null);
    const formData = buildFormData();
    await onSubmit(formData);
  };

  if (loadingOptions) return <div>Cargando opciones...</div>;
  if (optionsError) return <div className="text-red-600">{optionsError}</div>;

  // Mapea opciones para selects (value:string, label:string)
  const mapOptions = (arr: { id: number; name: string }[]) =>
    arr.map((o) => ({ value: o.id.toString(), label: o.name }));

  return (
    <div className="max-h-[80vh] overflow-y-auto p-4">
    <FormLayout 
  onSubmit={handleSubmit}
  onCancel={onCancel}
  error={error}
>
  <FormInput
    label="Nombre del proyecto"
    placeholder="Ingrese el nombre del proyecto"
    value={name}
    onChange={(e) => setName(e.target.value)}
    required
  />

  <FormTextarea
    label="Descripción del proyecto"
    placeholder="Ingrese una descripción breve del proyecto (opcional)"
    value={description}
    onChange={(e) => setDescription(e.target.value)}
  />

  <FormSelect
    label="Estado del proyecto"
    value={statusId.toString()}
    onChange={(val) => setStatusId(parseInt(val))}
    placeholder="Seleccione un estado del proyecto"
    options={mapOptions(statuses)}
    required
    name="status"
  />

  <FormSelect
    label="Grupo de trabajo"
    value={groupId?.toString() || ""}
    onChange={(val) => setGroupId(parseInt(val))}
    placeholder="Seleccione un grupo de trabajo (opcional)"
    options={mapOptions(groups)}
    required
    name="group"
  />

  <FormInput
    label="Fecha de inicio"
    type="date"
    placeholder="Seleccione la fecha de inicio"
    value={startDate}
    onChange={(e) => setStartDate(e.target.value)}
    required
  />

  <FormInput
    label="Fecha de finalización"
    type="date"
    placeholder="Seleccione la fecha de finalización"
    value={endDate}
    onChange={(e) => setEndDate(e.target.value)}
    required
  />

  <FormSelectMultiple
    label="Áreas relacionadas"
    options={mapOptions(areas)}
    selectedValues={areaIds.map(String)}
    onChange={(vals: string[]) => setAreaIds(vals.map(Number))}
  />

  <FormSelectMultiple
    label="Herramientas utilizadas"
    options={mapOptions(tools)}
    selectedValues={toolIds.map(String)}
    onChange={(vals: string[]) => setToolIds(vals.map(Number))}
  />

  <FormSelectMultiple
    label="Repositorios asociados"
    options={mapOptions(repositories)}
    selectedValues={repositoryIds.map(String)}
    onChange={(vals: string[]) => setRepositoryIds(vals.map(Number))}
  />

  <FileUpload
    label="Imagen del proyecto (opcional)"
    onFileSelect={(file) => setImage(file)}
    accept="image/jpeg, image/png"
    error={error?.includes("imagen") ? error : undefined}
  />
</FormLayout>

</div>
  );
};

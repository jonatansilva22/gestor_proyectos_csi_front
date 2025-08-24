import { useState } from "react";
import { Project } from '../../types/projects/Project';
import { InlineEdit } from '../common/InlineEdit';
import { updateProject } from '../../services/projects/projectService';
import { notifySuccess, notifyError } from '../common/ToastNotify';
import { getBackendErrorMsg } from '../../utils/projects/getBackendErrorMsg';
import { FormImageUpload } from '../common/FormImageUpload';
import { useTheme } from '../../context/ThemeContext';

interface ProjectImageAndDescriptionProps {
  project: Project;
  onProjectUpdate: (p: Project) => void;
  canEdit?: boolean;
}

export const ProjectImageAndDescription = ({
  project,
  onProjectUpdate,
  canEdit = true,
}: ProjectImageAndDescriptionProps) => {
  const { darkMode } = useTheme();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const handleImageChange = async (file: File | null) => {
    setSelectedImage(file);
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("image", file);

      const updated = await updateProject(project.id, formData);
      onProjectUpdate(updated);
      notifySuccess("Imagen actualizada");
    } catch (e: any) {
      notifyError(getBackendErrorMsg(e));
    }
  };

  return (
    <div className="flex gap-8 mb-8 items-start">
      <div>
        <div className={`border rounded w-[400px] h-[250px] flex items-center justify-center p-4 ${
          darkMode ? 'bg-gray-800 border-gray-600' : 'bg-gray-100 border-gray-300'
        }`}>
          {project.image ? (
            <img
              src={project.image}
              alt={project.name}
              className="max-h-full max-w-full object-contain"
            />
          ) : (
            <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Sin imagen</span>
          )}
        </div>

        {canEdit && (
          <div className="mt-2">
            <FormImageUpload
              image={selectedImage}
              onChange={handleImageChange}
            />
          </div>
        )}
      </div>

      <div className="flex-1">
        {canEdit ? (
          <InlineEdit
            value={project.name}
            onSave={async (newName) => {
              try {
                const updated = await updateProject(project.id, { name: newName });
                onProjectUpdate(updated);
                notifySuccess("Nombre actualizado");
              } catch (e: any) {
                notifyError(getBackendErrorMsg(e));
              }
            }}
            className="font-bold text-lg mb-2"
          />
        ) : (
          <div className={`font-bold text-lg mb-2 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>{project.name}</div>
        )}
        <div>
  <span className={`font-semibold ${
    darkMode ? 'text-white' : 'text-gray-900'
  }`}>Descripción:</span>
  {canEdit ? (
    <InlineEdit
      value={project.description || ""}
      onSave={async (newDesc) => {
        try {
          const updated = await updateProject(project.id, { description: newDesc });
          onProjectUpdate(updated);
          notifySuccess("Descripción actualizada");
        } catch (e: any) {
          notifyError(getBackendErrorMsg(e));
        }
      }}
      inputType="textarea"
      className="whitespace-pre-line break-words text-sm"
    />
  ) : (
    <div className={`whitespace-pre-line break-words text-sm ${
      darkMode ? 'text-gray-200' : 'text-gray-700'
    }`}>
      {project.description || ""}
    </div>
  )}
</div>
      </div>
    </div>
  );
};

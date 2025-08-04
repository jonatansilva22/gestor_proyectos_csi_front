import { Project } from '../../types/projects/Project';
import { InlineEdit } from '../common/InlineEdit';
import { updateProject } from '../../services/projects/projectService';
import { notifySuccess, notifyError } from '../common/ToastNotify';
import { getBackendErrorMsg } from '../../utils/projects/getBackendErrorMsg';

interface ProjectImageAndDescriptionProps {
  project: Project;
  onProjectUpdate: (p: Project) => void;
}

export const ProjectImageAndDescription = ({
  project,
  onProjectUpdate,
}: ProjectImageAndDescriptionProps) => (
  <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
    <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
      {/* Image container */}
      <div className="w-full lg:w-80 xl:w-96 flex-shrink-0">
        <div className="border rounded-lg w-full h-48 sm:h-56 lg:h-64 flex items-center justify-center bg-gray-100">
          {project.image ? (
            <img 
              src={project.image} 
              alt={project.name} 
              className="max-h-full max-w-full object-contain rounded"
            />
          ) : (
            <span className="text-gray-400 text-sm sm:text-base">Imagen</span>
          )}
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 min-w-0 space-y-4">
        {/* Project name */}
        <div>
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
            className="font-bold text-xl sm:text-2xl text-gray-900 leading-tight"
          />
        </div>
        
        {/* Description */}
        <div className="space-y-2">
          <span className="font-semibold text-gray-700 text-sm sm:text-base">Descripción:</span>
          <InlineEdit
            value={project.description || "Sin descripción"}
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
            className="whitespace-pre-line text-sm sm:text-base text-gray-600 leading-relaxed"
          />
        </div>
      </div>
    </div>
  </div>
);
// src/components/projects/ProjectCard.tsx
// Tarjeta de proyecto responsive que muestra información básica
// Incluye imagen, nombre, descripción, fechas y estado visual

import { useNavigate } from "react-router-dom";
import { Project } from "../../types/projects/Project";
import { PROJECT_STATUS_COLORS_BG } from '../../const/projectsStatusColors';
import { formatDate } from "../../utils/projects/formatDate";

/**
 * Props para el componente ProjectCard
 */
interface ProjectCardProps {
  project: Project;  // Datos del proyecto a mostrar
}

/**
 * Componente de tarjeta de proyecto con diseño responsive
 * Muestra información básica del proyecto en formato de tarjeta
 */
export const ProjectCard = ({ project }: ProjectCardProps) => {
  const navigate = useNavigate();

  return (
    <div className="border rounded-xl w-full sm:w-80 lg:w-72 bg-white shadow flex flex-col overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-24 sm:h-28 bg-gray-100 flex items-center justify-center rounded-t-xl">
        {project.image ? (
          <img
            src={project.image}
            alt={project.name}
            className="max-h-20 sm:max-h-24 max-w-full object-contain"
          />
        ) : (
          <span className="text-gray-400 text-sm">Imagen</span>
        )}
      </div>
      <div className="p-3 sm:p-4 flex flex-col gap-2 flex-1">
        <div className="flex justify-between items-start gap-2">
          <strong className="text-sm sm:text-base leading-tight">{project.name}</strong>
          <span
            className={`w-3 h-3 rounded-full flex-shrink-0 ${PROJECT_STATUS_COLORS_BG[project.status.name] || 'bg-gray-400'}`}
          />
        </div>
        <div className="text-sm text-gray-600 border-b pb-1"></div>
        <div className="text-xs sm:text-sm text-gray-600 h-12 sm:h-16 overflow-hidden text-ellipsis line-clamp-2 sm:line-clamp-3">
          {project.description}
        </div>
        <div className="flex flex-col gap-1 text-xs text-gray-500 mt-1">
          <div className="flex items-center gap-1">
            <span role="img" aria-label="calendar" className="text-xs">📅</span>
            <strong className="text-xs leading-tight">
              {formatDate(project.start_date)} - {formatDate(project.end_date)}
            </strong>
          </div>
        </div>
        <div className="flex gap-1 mt-1 flex-wrap">
          <span className="border rounded px-2 py-0.5 text-xs whitespace-nowrap">
            Herramienta
          </span>
        </div>
        <div className="text-sm text-gray-600 border-b pb-1"></div>
        <button
          className="bg-purple-700 text-white rounded mt-2 py-2 px-4 hover:bg-purple-500 cursor-pointer transition text-sm font-medium active:bg-purple-800"
          onClick={() => navigate(`/projects/${project.id}`)}
        >
          Ver detalles
        </button>
      </div>
    </div>
  );
};
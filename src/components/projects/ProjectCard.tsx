import { useNavigate } from "react-router-dom";
import { Project } from "../../types/projects/Project";
import { PROJECT_STATUS_COLORS_BG } from '../../const/projectsStatusColors';
import { formatDate } from "../../utils/projects/formatDate";

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
  const navigate = useNavigate();

  return (
    <div className="border rounded-xl w-72 bg-white shadow flex flex-col overflow-hidden">
      <div className="h-28 bg-gray-100 flex items-center justify-center rounded-t-xl">
        {project.image ? (
          <img
            src={project.image}
            alt={project.name}
            className="max-h-24 max-w-full object-contain"
          />
        ) : (
          <span className="text-gray-400">Imagen</span>
        )}
      </div>
      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex justify-between items-center">
          <strong>{project.name}</strong>
          <span
            className={`w-3 h-3 rounded-full ${PROJECT_STATUS_COLORS_BG[project.status.name] || 'bg-gray-400'}`}
          />
        </div>
        <div className="text-sm text-gray-600 border-b pb-1"></div>
        <div className="text-sm text-gray-600 h-16 overflow-hidden text-ellipsis line-clamp-3">
          {project.description}
        </div>
        <div className="flex flex-col gap-1 text-xs text-gray-500 mt-1">
          <div className="flex items-center gap-1">
            <span role="img" aria-label="calendar">📅</span>
            <strong>
              {formatDate(project.start_date)} - {formatDate(project.end_date)}
            </strong>
          </div>
        </div>
        <div className="flex gap-1 mt-1">
          <span className="border rounded px-2 py-0.5 text-xs">
            Herramienta
          </span>
        </div>
        <div className="text-sm text-gray-600 border-b pb-1"></div>
        <button
          className="bg-purple-700 text-white rounded mt-2 py-1 hover:bg-purple-500 cursor-pointer transition"
          onClick={() => navigate(`/projects/${project.id}`)}
        >
          Ver detalles
        </button>
      </div>
    </div>
  );
};
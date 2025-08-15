import { useNavigate } from "react-router-dom";
import { Project } from "../../types/projects/Project";
import { 
  PROJECT_STATUS_COLORS_BG, 
  PROJECT_STATUS_COLORS_BG_LIGHT,
  PROJECT_STATUS_COLORS_BG_DARK,
  PROJECT_STATUS_COLORS_TEXT,
  PROJECT_STATUS_COLORS_TEXT_DARK
} from '../../const/projectsStatusColors';
import { formatDate } from "../../utils/projects/formatDate";
import placeholder from "../../assets/placeholder.png";
import { useTheme } from "../../context/ThemeContext";

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const statusName = project.status?.name || '';

  const containerClasses = `
      group cursor-pointer transition-all duration-300 
      transform hover:scale-105
      border rounded-2xl flex flex-col overflow-hidden
      w-full h-[450px]
      ${darkMode 
        ? 'bg-[#3A2B5A] border-purple-700/30 shadow-lg hover:shadow-xl hover:border-purple-500/40' 
        : 'bg-surface-primary border-primary hover:border-secondary shadow-none'}
    `;

  return (
    <div className={containerClasses}>
      {/* Image Header */}
      <div className="
        h-32 flex items-center justify-center
        rounded-t-2xl transition-colors
        bg-surface-secondary
        flex-shrink-0
      ">
        {project.image ? (
          <img
            src={project.image}
            alt={project.name}
            className="max-h-20 max-w-full object-contain 
                       transition-transform duration-300 group-hover:scale-110"
            onError={(e) => {
              e.currentTarget.src = placeholder;
            }}
          />
        ) : (
          <img
            src={placeholder}
            alt="Imagen del proyecto"
            className="h-16 w-16 opacity-50"
          />
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col gap-3 flex-1 min-h-0">
        {/* Title and Status */}
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-bold text-lg leading-tight truncate flex-1 text-text-primary">
            {project.name}
          </h3>
          <div className="flex items-center gap-1 flex-shrink-0">
            <span
              className={`w-3 h-3 rounded-full ${
                PROJECT_STATUS_COLORS_BG[project.status.name] || 'bg-gray-400'
              }`}
              title={project.status.name}
            />
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
              statusName && PROJECT_STATUS_COLORS_BG_LIGHT[statusName]
                ? `${PROJECT_STATUS_COLORS_BG_LIGHT[statusName]} ${PROJECT_STATUS_COLORS_TEXT[statusName]} dark:${PROJECT_STATUS_COLORS_BG_DARK[statusName]} dark:${PROJECT_STATUS_COLORS_TEXT_DARK[statusName]}`
                : 'bg-gray-500/10 text-gray-700 dark:bg-gray-700/30 dark:text-gray-300'
            }`}>
              {project.status.name}
            </span>
          </div>
        </div>

        {/* Description */}
        {project.description && (
          <div className="text-base leading-relaxed line-clamp-3 text-text-secondary overflow-hidden">
            {project.description}
          </div>
        )}

        {/* Project Details */}
        <div className="space-y-2 mt-auto">
          {/* Dates */}
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <span className="text-base">📅</span>
            <div className="flex items-center gap-1 truncate">
              <span className="font-medium truncate">
                {formatDate(project.start_date)}
              </span>
              <span>-</span>
              <span className="font-medium truncate">
                {formatDate(project.end_date)}
              </span>
            </div>
          </div>

          {/* Additional Info - Tools, Area, etc. */}
          <div className="flex flex-wrap gap-2 text-sm">
            {project.tools && project.tools.length > 0 && (
              <span className="px-2 py-0.5 rounded-full border border-primary text-primary-600 bg-primary-50 truncate">
                🔧 {project.tools[0].name}
                {project.tools.length > 1 && ` +${project.tools.length - 1}`}
              </span>
            )}
            {project.area && (
              <span className="px-2 py-0.5 rounded-full border bg-surface-secondary border-secondary text-text-primary truncate">
                🏢 {project.area.name}
              </span>
            )}
          </div>
        </div>

        {/* Action Button */}
        <button
          className="
            w-full mt-3 py-3 px-6 rounded-xl font-semibold text-base
            transition-all duration-200 transform active:scale-95
            bg-primary-600 hover:bg-primary-700 text-white
            shadow-none dark:shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-primary-500/50
            flex-shrink-0
          "
          onClick={() => navigate(`/projects/${project.id}`)}
        >
          Ver detalles
        </button>
      </div>
    </div>
  );
};

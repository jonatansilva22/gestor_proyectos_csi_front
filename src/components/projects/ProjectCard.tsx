import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { Project } from "../../types/projects/Project";
import { PROJECT_STATUS_COLORS_BG, PROJECT_STATUS_COLORS_TEXT } from '../../const/projectsStatusColors';
import { formatDate } from "../../utils/projects/formatDate";
import placeholder from "../../assets/placeholder.png";

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  return (
    <div className={`
      group cursor-pointer transition-all duration-300 
      transform hover:scale-105 hover:shadow-xl
      border rounded-2xl shadow-lg flex flex-col overflow-hidden
      w-full min-h-[400px] sm:min-h-[420px]
      ${
        darkMode 
          ? 'bg-[#3A2B5A] border-purple-700/30' 
          : 'bg-white border-gray-200'
      }
      ${darkMode 
        ? 'hover:border-primary-500/70 hover:shadow-primary-900/30' 
        : 'hover:border-border-secondary hover:shadow-primary-300/50'
      }
    `}>
      {/* Image Header */}
      <div className={`
        h-32 sm:h-36 md:h-40 flex items-center justify-center
        rounded-t-2xl transition-colors
        ${
          darkMode 
            ? 'bg-[#1A0F30]' 
            : 'bg-gray-100'
        }
      `}>
        {project.image ? (
          <img
            src={project.image}
            alt={project.name}
            className="max-h-24 sm:max-h-28 md:max-h-32 max-w-full object-contain 
                       transition-transform duration-300 group-hover:scale-110"
            onError={(e) => {
              e.currentTarget.src = placeholder;
            }}
          />
        ) : (
          <img
            src={placeholder}
            alt="Imagen del proyecto"
            className="h-16 w-16 sm:h-20 sm:w-20 opacity-50"
          />
        )}
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 flex flex-col gap-3 flex-1">
        {/* Title and Status */}
        <div className="flex justify-between items-start gap-3">
          <h3 className={`font-bold text-base sm:text-lg leading-tight line-clamp-2 flex-1 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {project.name}
          </h3>
          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            <span
              className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full ${
                PROJECT_STATUS_COLORS_BG[project.status.name] || 'bg-gray-400'
              }`}
              title={project.status.name}
            />
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
              PROJECT_STATUS_COLORS_TEXT[project.status.name] || 'text-gray-600'
            } ${darkMode ? 'bg-opacity-20' : 'bg-opacity-10'} bg-current`}>
              {project.status.name}
            </span>
          </div>
        </div>

        {/* Description */}
        {project.description && (
          <div className={`text-sm leading-relaxed line-clamp-3 flex-1 ${
            darkMode ? 'text-purple-100' : 'text-gray-600'
          }`}>
            {project.description}
          </div>
        )}

        {/* Project Details */}
        <div className="space-y-2 mt-auto">
          {/* Dates */}
          <div className={`flex items-center gap-2 text-xs ${
            darkMode ? 'text-purple-200' : 'text-gray-500'
          }`}>
            <span className="text-base">📅</span>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
              <span className="font-medium">
                {formatDate(project.start_date)}
              </span>
              <span className="hidden sm:inline">-</span>
              <span className="font-medium">
                {formatDate(project.end_date)}
              </span>
            </div>
          </div>

          {/* Additional Info - Tools, Area, etc. */}
          <div className="flex flex-wrap gap-1.5">
            {project.tools && project.tools.length > 0 && (
              <span className={`text-xs px-2 py-1 rounded-full border border-primary-300 text-primary-600 ${
                darkMode 
                  ? 'bg-primary-600/10'
                  : 'bg-primary-50'
              }`}>
                🔧 {project.tools[0].name}
                {project.tools.length > 1 && ` +${project.tools.length - 1}`}
              </span>
            )}
            {project.area && (
              <span className={`text-xs px-2 py-1 rounded-full border ${
                darkMode 
                  ? 'bg-[#1A0F30] border-purple-700/30 text-purple-200'
                  : 'bg-gray-100 border-gray-300 text-gray-600'
              }`}>
                🏢 {project.area.name}
              </span>
            )}
          </div>
        </div>

        {/* Action Button */}
        <button
          className={`
            w-full mt-4 py-2.5 sm:py-3 px-4 rounded-xl font-semibold text-sm sm:text-base
            transition-all duration-200 transform active:scale-95
            bg-primary-600 hover:bg-primary-700 text-white
            ${darkMode
              ? 'shadow-lg shadow-primary-600/25'
              : 'shadow-lg shadow-primary-700/25'
            }
            hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-primary-500/50
          `}
          onClick={() => navigate(`/projects/${project.id}`)}
        >
          Ver detalles
        </button>
      </div>
    </div>
  );
};

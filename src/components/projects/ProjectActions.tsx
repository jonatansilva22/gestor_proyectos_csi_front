import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import DeleteButton from "../common/DeleteButton";

interface ProjectActionsProps {
  projectId: number;
  onDelete: () => void;
}

export const ProjectActions = ({ projectId, onDelete }: ProjectActionsProps) => {
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-center justify-center w-full sm:w-auto">
      {/* Primary Action Button - Ver Detalles */}
      <button
        className={`w-full sm:w-auto min-w-[120px] px-4 py-3 sm:px-6 sm:py-2 rounded-lg font-medium text-sm sm:text-base transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-95 ${
          darkMode 
            ? 'bg-purple-500 hover:bg-purple-600 text-white focus:ring-purple-400 focus:ring-offset-gray-800' 
            : 'bg-purple-600 hover:bg-purple-700 text-white focus:ring-purple-500 focus:ring-offset-white'
        }`}
        onClick={() => navigate(`/projects/${projectId}`)}
        aria-label={`Ver detalles del proyecto ${projectId}`}
      >
        <span className="sm:hidden">Ver</span>
        <span className="hidden sm:inline">Ver Detalles</span>
      </button>
      
      {/* Delete Button */}
      <div className="w-full sm:w-auto flex justify-center">
        <DeleteButton
          onDelete={onDelete}
          ariaLabel={`Eliminar proyecto ${projectId}`}
          size="md"
        />
      </div>
    </div>
  );
};
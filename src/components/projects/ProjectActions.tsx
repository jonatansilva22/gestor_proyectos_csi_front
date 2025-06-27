import { useNavigate } from "react-router-dom";
import trash from "../../assets/borrar-icon.png";

interface ProjectActionsProps {
  projectId: number;
  onDelete: () => void;
}

export const ProjectActions = ({ projectId, onDelete }: ProjectActionsProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex gap-3 items-center justify-center">
      <button
        className="bg-purple-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-purple-700 transition cursor-pointer"
        onClick={() => navigate(`/projects/${projectId}`)}
      >
        Ver Detalles
      </button>
      <button
        className="rounded-full p-1 hover:bg-red-100 transition flex items-center justify-center cursor-pointer"
        onClick={onDelete}
      >
        <img src={trash} alt="Eliminar" className="w-10 h-10" />
      </button>
    </div>
  );
};
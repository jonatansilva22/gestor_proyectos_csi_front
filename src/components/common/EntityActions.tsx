import { useNavigate } from "react-router-dom";

interface EntityActionsProps {
  onDelete: () => void;
  detailsPath?: string;
  detailsLabel?: string;
  deleteIcon?: string;
  onDetails?: () => void; 
}

export const EntityActions = ({
  onDelete,
  detailsPath,
  detailsLabel = "Ver Detalles",
  deleteIcon,
  onDetails,
}: EntityActionsProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex gap-3 items-center justify-center">
      <button
        className="bg-purple-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-purple-700 transition cursor-pointer"
        onClick={onDetails ? onDetails : () => detailsPath && navigate(detailsPath)}
      >
        {detailsLabel}
      </button>
      <button
        className="rounded-full p-1 hover:bg-red-100 transition flex items-center justify-center cursor-pointer"
        onClick={onDelete}
      >
        {deleteIcon ? (
          <img src={deleteIcon} alt="Eliminar" className="w-10 h-10" />
        ) : (
          <span role="img" aria-label="Eliminar" className="text-2xl">🗑️</span>
        )}
      </button>
    </div>
  );
};
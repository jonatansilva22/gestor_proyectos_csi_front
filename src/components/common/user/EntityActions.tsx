import { useNavigate } from 'react-router-dom';

interface EntityActionsProps {
  id?: string | number;
  onEdit?: () => void;
  onDelete?: () => void;
  detailsPath?: string;
  detailsLabel?: string;
  deleteIcon?: string;
  showDetails?: boolean;
  showEdit?: boolean;
  showDelete?: boolean;
}

export const EntityActions = ({
  onEdit,
  onDelete,
  detailsPath,
  detailsLabel = "Ver Detalles",
  deleteIcon = "🗑️",
  showDetails = false,
  showEdit = true,
  showDelete = true,
}: EntityActionsProps) => {
  const navigate = useNavigate();

  const handleDetailsClick = () => {
    if (detailsPath) {
      navigate(detailsPath);
    }
  };

  return (
    <div className="flex space-x-2">
      {showDetails && (
        <button
          onClick={handleDetailsClick}
          className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-md text-sm transition-colors"
        >
          {detailsLabel}
        </button>
      )}
      
      {showEdit && onEdit && (
        <button
          onClick={onEdit}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm transition-colors"
        >
          Editar
        </button>
      )}
      
      {showDelete && onDelete && (
        <button
          onClick={onDelete}
          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm transition-colors"
        >
          {deleteIcon}
        </button>
      )}
    </div>
  );
};
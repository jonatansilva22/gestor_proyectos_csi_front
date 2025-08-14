import { useNavigate } from 'react-router-dom';
import DeleteButton from '../DeleteButton';

interface EntityActionsProps {
  id?: string | number;
  onEdit?: () => void;
  onDelete?: () => void;
  detailsPath?: string;
  detailsLabel?: string;
  showDetails?: boolean;
  showEdit?: boolean;
  showDelete?: boolean;
}

export const EntityActions = ({
  id,
  onEdit,
  onDelete,
  detailsPath,
  detailsLabel = "Ver Detalles",
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
    <div className="flex flex-col sm:flex-row gap-2 items-center justify-center">
      {showDetails && (
        <button
          onClick={handleDetailsClick}
          className="w-full sm:w-auto px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-1 active:scale-95"
        >
          {detailsLabel}
        </button>
      )}
      
      {showEdit && onEdit && (
        <button
          onClick={onEdit}
          className="w-full sm:w-auto px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-1 active:scale-95"
        >
          Editar
        </button>
      )}
      
      {showDelete && onDelete && (
        <div className="w-full sm:w-auto flex justify-center">
          <DeleteButton
            onDelete={onDelete}
            ariaLabel={`Eliminar elemento ${id || ''}`}
            size="md"
          />
        </div>
      )}
    </div>
  );
};
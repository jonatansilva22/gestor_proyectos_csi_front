import { useNavigate } from "react-router-dom";
import DeleteButton from "./DeleteButton";

interface EntityActionsProps {
  id: number;
  onDelete: () => void;
  detailsPath?: string;
  detailsLabel?: string;
  onDetails?: () => void;
}

export const EntityActions = ({
  id,
  onDelete,
  detailsPath,
  detailsLabel = "Ver Detalles",
  onDetails,
}: EntityActionsProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-center justify-center w-full sm:w-auto">
      <button
        className="w-full sm:w-auto min-w-[120px] px-4 py-3 sm:px-6 sm:py-2 text-base sm:text-sm font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 active:scale-95 min-h-[44px] bg-purple-600 text-white hover:bg-purple-700 
                   focus:ring-purple-500 focus:ring-offset-white dark:focus:ring-purple-400 
                   dark:focus:ring-offset-gray-800 font-semibold"
        onClick={onDetails ? onDetails : () => detailsPath && navigate(detailsPath)}
        aria-label={`${detailsLabel} para elemento ${id}`}
      >
        {detailsLabel}
      </button>
      <div className="w-full sm:w-auto flex justify-center">
        <DeleteButton
          onDelete={onDelete}
          ariaLabel={`Eliminar elemento ${id}`}
          size="md"
        />
      </div>
    </div>
  );
};
import { Modal } from "../common/Modal"; 
import { Project } from "../../types/projects/Project";
import { useTheme } from "../../context/ThemeContext";

export interface DeleteProjectModalProps {
  open: boolean;
  project: Project | null;
  onCancel: () => void;
  onConfirm: () => void;
}

export const DeleteProjectModal = ({
  open,
  project,
  onCancel,
  onConfirm,
}: DeleteProjectModalProps) => {
  const { darkMode } = useTheme();
  
  return (
    <Modal open={open} onClose={onCancel} title="Eliminar Proyecto">
      <div className="p-4">
        <p className={`mb-8 text-center ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          ¿Estás seguro de que deseas eliminar el proyecto{" "}
          <span className="font-bold">&quot;{project?.name}&quot;</span>?
        </p>
        <div className="flex justify-end gap-4">
          <button
            className={`hover:underline cursor-pointer transition-colors ${
              darkMode 
                ? 'text-gray-300 hover:text-gray-100' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
            onClick={onCancel}
          >
            Cancelar
          </button>
          <button
            className="bg-red-600 text-white px-6 py-2 rounded font-semibold hover:bg-red-700 transition cursor-pointer"
            onClick={onConfirm}
          >
            Eliminar
          </button>
        </div>
      </div>
    </Modal>
  );
};
import { Modal } from "../common/Modal"; 
import { Project } from "../../types/projects/Project";

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
}: DeleteProjectModalProps) => (
  <Modal open={open} onClose={onCancel} title="Confirmar eliminación">
    <div className="p-4">
      <p className="mb-8 text-center">
        ¿Estás seguro de que deseas borrar el proyecto{" "}
        <span className="font-bold">&quot;{project?.name}&quot;</span>?
      </p>
      <div className="flex justify-end gap-4">
        <button
          className="text-gray-600 hover:underline cursor-pointer"
          onClick={onCancel}
        >
          Cancelar
        </button>
        <button
          className="bg-red-600 text-white px-6 py-2 rounded font-semibold hover:bg-red-700 transition cursor-pointer"
          onClick={onConfirm}
        >
          Borrar
        </button>
      </div>
    </div>
  </Modal>
);
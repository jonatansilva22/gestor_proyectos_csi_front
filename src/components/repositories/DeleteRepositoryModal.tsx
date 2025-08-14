import { Modal } from "../../components/common/Modal";
import { Repository } from "../../types/repositories/Repository";

interface DeleteRepositoryModalProps {
  open: boolean;
  repository?: Repository | null;
  onCancel: () => void;
  onConfirm: () => void;
}

export const DeleteRepositoryModal = ({
  open,
  repository,
  onCancel,
  onConfirm,
}: DeleteRepositoryModalProps) => (
  <Modal open={open} onClose={onCancel} title="Eliminar Repositorio">
    <div className="p-4">
      <p>
        ¿Estás seguro que deseas eliminar el repositorio{" "}
        <span className="font-bold">{repository?.name}</span>?
      </p>
      <div className="flex justify-end gap-2 mt-6">
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
          Eliminar
        </button>
      </div>
    </div>
  </Modal>
);

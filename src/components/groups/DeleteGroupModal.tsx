import { Modal } from "../../components/common/Modal";
import { Group } from "../../types/groups/Group";

interface DeleteGroupModalProps {
  open: boolean;
  group?: Group | null;
  onCancel: () => void;
  onConfirm: () => void;
}

export const DeleteGroupModal = ({
  open,
  group,
  onCancel,
  onConfirm,
}: DeleteGroupModalProps) => (
  <Modal open={open} onClose={onCancel} title="Eliminar Grupo">
    <div className="p-4">
      <p>
        ¿Estás seguro que deseas eliminar el grupo{" "}
        <span className="font-bold">{group?.name}</span>?
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

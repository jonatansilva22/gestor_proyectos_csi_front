// src/components/tools/DeleteToolModal.tsx
import { Modal } from "../../components/common/Modal";
import { Tool } from "../../types/tools/Tool";

interface DeleteToolModalProps {
  open: boolean;
  tool?: Tool | null;
  onCancel: () => void;
  onConfirm: () => void;
}

export const DeleteToolModal = ({ open, tool, onCancel, onConfirm }: DeleteToolModalProps) => (
  <Modal open={open} onClose={onCancel} title="Eliminar Herramienta">
    <div className="p-4">
      <p>
        ¿Estás seguro que deseas eliminar la herramienta{" "}
        <span className="font-bold">{tool?.name}</span>?
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

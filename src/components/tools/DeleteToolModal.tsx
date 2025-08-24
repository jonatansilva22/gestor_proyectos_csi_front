// src/components/tools/DeleteToolModal.tsx
import { Modal } from "../../components/common/Modal";
import { Tool } from "../../types/tools/Tool";
import { useTheme } from "../../context/ThemeContext";

interface DeleteToolModalProps {
  open: boolean;
  tool?: Tool | null;
  onCancel: () => void;
  onConfirm: () => void;
}

export const DeleteToolModal = ({ open, tool, onCancel, onConfirm }: DeleteToolModalProps) => {
  const { darkMode } = useTheme();
  
  return (
  <Modal open={open} onClose={onCancel} title="Eliminar Herramienta">
    <div className="p-4">
      <p className={`mb-8 text-center ${
        darkMode ? 'text-white' : 'text-gray-900'
      }`}>
        ¿Estás seguro que deseas eliminar la herramienta{" "}
        <span className="font-bold">{tool?.name}</span>?
      </p>
      <div className="flex justify-end gap-2 mt-6">
        <button
          className={`hover:underline cursor-pointer ${
            darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-800'
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

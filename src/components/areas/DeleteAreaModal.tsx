import { Modal } from "../../components/common/Modal";
import { Area } from "../../types/areas/Area";
import { useTheme } from "../../context/ThemeContext";

interface DeleteAreaModalProps {
  open: boolean;
  area?: Area | null;
  onCancel: () => void;
  onConfirm: () => void;
}

export const DeleteAreaModal = ({
  open,
  area,
  onCancel,
  onConfirm,
}: DeleteAreaModalProps) => {
  const { darkMode } = useTheme();
  
  return (
  <Modal open={open} onClose={onCancel} title="Eliminar Área">
    <div className="p-4">
      <p className={`mb-8 text-center ${
        darkMode ? 'text-white' : 'text-gray-900'
      }`}>
        ¿Estás seguro que deseas eliminar el área{" "}
        <span className="font-bold">{area?.name}</span>?
      </p>
      <div className="flex justify-end gap-2 mt-6">
        <button
          className={`${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-800'} hover:underline cursor-pointer`}
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
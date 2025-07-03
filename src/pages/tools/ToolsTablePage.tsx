// src/pages/tools/ToolsTablePage.tsx
import { useNavigate } from "react-router-dom";
import { useTools } from "../../hooks/tools/useTools";
import { useEntityModals } from "../../hooks/projects/useEntityModal";
import { Header } from "../../components/common/Header";
import { Modal } from "../../components/common/Modal";
import { NewItemButton } from "../../components/common/NewItemButton";
import { DeleteToolModal } from "../../components/tools/DeleteToolModal";
import { ToolsTable } from "../../components/tools/ToolsTable";
import { ToolForm } from "../../components/tools/ToolForm";
import { createTool, deleteTool, updateTool } from "../../services/tools/toolsServices";
import { notifySuccess, notifyError } from "../../components/common/ToastNotify";
import { getBackendErrorMsg } from "../../utils/projects/getBackendErrorMsg";
import volver from "../../assets/volver.png";
import { Tool } from "../../types/tools/Tool";

export const ToolsTablePage = () => {
  const navigate = useNavigate();
  const { tools, refreshTools } = useTools();

  const {
    showModal,
    openCreateModal,
    closeCreateModal,
    editModalOpen,
    openEditModal,
    closeEditModal,
    entityToEdit,
    deleteModalOpen,
    openDeleteModal,
    closeDeleteModal,
    entityToDelete: toolToDelete,
  } = useEntityModals<Tool>();

  interface ToolFormData {
  name: string;
  image: File | null;
}

  const handleCreateSubmit = async (data: ToolFormData) => {
    try {
      await createTool(data);
      notifySuccess("Herramienta creada exitosamente");
      await refreshTools();
      closeCreateModal();
    } catch (error: any) {
      notifyError(getBackendErrorMsg(error));
    }
  };

  const handleEditSubmit = async (updatedData: ToolFormData) => {
    if (!entityToEdit) return;
    try {
      await updateTool(entityToEdit.id, updatedData);
      notifySuccess("Herramienta actualizada exitosamente");
      await refreshTools();
      closeEditModal();
    } catch (error: any) {
      notifyError(getBackendErrorMsg(error));
    }
  };

  const handleConfirmDelete = async () => {
    if (!toolToDelete) return;
    try {
      await deleteTool(toolToDelete.id);
      notifySuccess("Herramienta eliminada exitosamente");
      await refreshTools();
    } catch (error: any) {
      notifyError(getBackendErrorMsg(error));
    } finally {
      closeDeleteModal();
    }
  };

  return (
    <>
      <Header title="CSI PRO" />
      <div className="p-4 w-full h-full min-h-screen flex justify-center bg-white">
        <div className="w-full max-w-7xl">
          <button
            onClick={() => navigate(-1)}
            className="mb-4 rounded-full p-1 hover:bg-gray-200 cursor-pointer transition"
          >
            <img src={volver} alt="Volver" className="w-7 h-7" />
          </button>
          <h2 className="text-2xl font-bold text-center text-purple-600 mb-6">
            Herramientas
          </h2>
          <div className="overflow-y-auto max-h-[750px]">
            <ToolsTable
              tools={tools}
              onDeleteClick={openDeleteModal}
              onEditClick={openEditModal}
            />
          </div>
          <div className="mt-6">
            <NewItemButton label="Nueva Herramienta" onClick={openCreateModal} />
          </div>
        </div>
      </div>

      <Modal open={showModal} onClose={closeCreateModal} title="Crear Herramienta">
        <ToolForm onSubmit={handleCreateSubmit} onCancel={closeCreateModal} />
      </Modal>

      <Modal open={editModalOpen} onClose={closeEditModal} title="Editar Herramienta">
        {entityToEdit && (
          <ToolForm
            initialData={entityToEdit}
            onCancel={closeEditModal}
            onSubmit={handleEditSubmit}
          />
        )}
      </Modal>

      <DeleteToolModal
        open={deleteModalOpen}
        tool={toolToDelete}
        onCancel={closeDeleteModal}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};

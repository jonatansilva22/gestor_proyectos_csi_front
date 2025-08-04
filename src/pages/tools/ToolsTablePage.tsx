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
    <div className="min-h-screen bg-gray-50">
      <Header title="CSI PRO" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 max-w-7xl">
        {/* Header section */}
        <div className="mb-6">
          {/* Back button */}
          <div className="mb-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-white transition-colors shadow-sm"
            >
              <img src={volver} alt="Volver" className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="text-sm sm:text-base font-medium">Volver</span>
            </button>
          </div>
          
          {/* Page title and new button */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Gestión de Herramientas
            </h1>
            <NewItemButton
              label="Nueva Herramienta"
              onClick={openCreateModal}
            />
          </div>
        </div>
        
        {/* Tools count */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            {tools.length} herramienta{tools.length !== 1 ? 's' : ''} registrada{tools.length !== 1 ? 's' : ''}
          </p>
        </div>
        
        {/* Table container */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-y-auto max-h-[70vh]">
            <ToolsTable
              tools={tools}
              onDeleteClick={openDeleteModal}
              onEditClick={openEditModal}
            />
          </div>
        </div>
        
        {/* Empty state */}
        {tools.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay herramientas registradas</h3>
            <p className="text-gray-500 mb-4">Comienza creando tu primera herramienta</p>
            <NewItemButton
              label="Crear Primera Herramienta"
              onClick={openCreateModal}
            />
          </div>
        )}
      </div>

      {/* Create Modal */}
      <Modal open={showModal} onClose={closeCreateModal} title="Crear Herramienta">
        <ToolForm onSubmit={handleCreateSubmit} onCancel={closeCreateModal} />
      </Modal>

      {/* Edit Modal */}
      <Modal open={editModalOpen} onClose={closeEditModal} title="Editar Herramienta">
        {entityToEdit && (
          <ToolForm
            initialData={entityToEdit}
            onCancel={closeEditModal}
            onSubmit={handleEditSubmit}
          />
        )}
      </Modal>

      {/* Delete Modal */}
      <DeleteToolModal
        open={deleteModalOpen}
        tool={toolToDelete}
        onCancel={closeDeleteModal}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

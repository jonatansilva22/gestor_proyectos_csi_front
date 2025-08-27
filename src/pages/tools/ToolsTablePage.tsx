import { useNavigate } from "react-router-dom";
import { useTools } from "../../hooks/tools/useTools";
import { useEntityModals } from "../../hooks/projects/useEntityModal";
import { useTheme } from "../../context/ThemeContext";
import HeaderSidebarLayout from "../../components/common/HeaderSidebarLayout";
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
import Filters from "../../features/admin/components/Filters";
import { useState } from "react";

export const ToolsTablePage = () => {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
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

  // 🔹 Estado para búsqueda
  const [searchTerm, setSearchTerm] = useState("");

  // 🔹 Filtrar herramientas según búsqueda
  const filteredTools = tools.filter((tool) =>
    tool.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    <HeaderSidebarLayout headerTitle="CSI PRO - Herramientas">
      <div
        className={`p-4 w-full h-full min-h-screen flex justify-center ${
          darkMode ? "bg-[#1A0F30]" : "bg-white"
        }`}
      >
        <div className="w-full max-w-7xl">
          <button
            onClick={() => navigate(-1)}
            className={`mb-4 rounded-full p-2 cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              darkMode 
                ? "bg-gray-800 hover:bg-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 focus:ring-purple-400 focus:ring-offset-[#1A0F30] active:bg-gray-600" 
                : "bg-white hover:bg-gray-200 focus:ring-gray-400 focus:ring-offset-white active:bg-gray-300 border border-gray-300"
            }`}
          >
            <img src={volver} alt="Volver" className="w-7 h-7" />
          </button>
          <h2
            className={`text-2xl font-bold text-center mb-6 ${
              darkMode ? "text-purple-300" : "text-purple-600"
            }`}
          >
            Herramientas
          </h2>

          {/* 🔹 Barra de búsqueda */}
          <Filters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            filterValue=""
            onFilterChange={() => {}}
            filterOptions={[]} // ⬅️ vacío, no se muestra select
            filterLabel=""
            totalCount={filteredTools.length}
            itemName="herramienta"
          />

          <div className="overflow-y-auto max-h-[750px]">
            <ToolsTable
              tools={filteredTools}
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
    </HeaderSidebarLayout>
  );
};

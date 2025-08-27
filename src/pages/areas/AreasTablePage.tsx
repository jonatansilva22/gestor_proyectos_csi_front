import { useNavigate } from "react-router-dom";
import { useAreas } from "../../hooks/areas/useAreas";
import { useEntityModals } from "../../hooks/projects/useEntityModal";
import { useTheme } from "../../context/ThemeContext";
import HeaderSidebarLayout from "../../components/common/HeaderSidebarLayout";
import { Modal } from "../../components/common/Modal";
import { NewItemButton } from "../../components/common/NewItemButton";
import { DeleteAreaModal } from "../../components/areas/DeleteAreaModal";
import { AreasTable } from "../../components/areas/AreasTable";
import { AreaForm } from "../../components/areas/AreasForm";
import { createArea, deleteArea, updateArea } from "../../services/areas/areasServices";
import { notifySuccess, notifyError } from "../../components/common/ToastNotify";
import { getBackendErrorMsg } from "../../utils/projects/getBackendErrorMsg";
import volver from "../../assets/volver.png";
import { Area } from "../../types/areas/Area";
import  Filters  from "../../features/admin/components/Filters";
import { useState } from "react";


export const AreasTablePage = () => {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const { areas, refreshAreas } = useAreas();

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
    entityToDelete: areaToDelete,
  } = useEntityModals<Area>();

  // 🔹 Estado para búsqueda
  const [searchTerm, setSearchTerm] = useState("");

  // 🔹 Filtrar áreas por nombre
  const filteredAreas = areas.filter((area) =>
    area.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateSubmit = async (data: { name: string }) => {
    try {
      await createArea(data);
      notifySuccess("Área creada exitosamente");
      await refreshAreas();
      closeCreateModal();
    } catch (error: any) {
      notifyError(getBackendErrorMsg(error));
    }
  };

  const handleEditSubmit = async (updatedData: { name: string }) => {
    if (!entityToEdit) return;
    try {
      await updateArea(entityToEdit.id, updatedData);
      notifySuccess("Área actualizada exitosamente");
      await refreshAreas();
      closeEditModal();
    } catch (error: any) {
      notifyError(getBackendErrorMsg(error));
    }
  };

  const handleConfirmDelete = async () => {
    if (!areaToDelete) return;
    try {
      await deleteArea(areaToDelete.id);
      notifySuccess("Área eliminada exitosamente");
      await refreshAreas();
    } catch (error: any) {
      notifyError(getBackendErrorMsg(error));
    } finally {
      closeDeleteModal();
    }
  };

  return (
    <HeaderSidebarLayout headerTitle="CSI PRO - Áreas">
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
            Áreas
          </h2>

          {/* 🔹 Barra de búsqueda (sin filtro) */}
          <Filters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            filterValue=""
            onFilterChange={() => {}}
            filterOptions={[]} // ⬅️ vacío, no muestra select
            filterLabel=""
            totalCount={filteredAreas.length}
            itemName="área"
          />

          <div className="overflow-y-auto max-h-[750px]">
            <AreasTable
              areas={filteredAreas}
              onDeleteClick={openDeleteModal}
              onEditClick={openEditModal}
            />
          </div>

          <div className="mt-6">
            <NewItemButton label="Nueva Área" onClick={openCreateModal} />
          </div>
        </div>
      </div>

      <Modal open={showModal} onClose={closeCreateModal} title="Nueva Área">
        <AreaForm onSubmit={handleCreateSubmit} onCancel={closeCreateModal} />
      </Modal>

      <Modal open={editModalOpen} onClose={closeEditModal} title="Editar Área">
        {entityToEdit && (
          <AreaForm
            initialData={entityToEdit}
            onCancel={closeEditModal}
            onSubmit={handleEditSubmit}
          />
        )}
      </Modal>

      <DeleteAreaModal
        open={deleteModalOpen}
        area={areaToDelete}
        onCancel={closeDeleteModal}
        onConfirm={handleConfirmDelete}
      />
    </HeaderSidebarLayout>
  );
};
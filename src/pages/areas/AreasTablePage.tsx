import { useNavigate } from "react-router-dom";
import { useAreas } from "../../hooks/areas/useAreas";
import { useEntityModals } from "../../hooks/projects/useEntityModal";
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

export const AreasTablePage = () => {
  const navigate = useNavigate();
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
      <div className="p-4 w-full h-full min-h-screen flex justify-center bg-white">
        <div className="w-full max-w-7xl">
          <button
            onClick={() => navigate(-1)}
            className="mb-4 rounded-full p-1 hover:bg-gray-200 cursor-pointer transition"
          >
            <img src={volver} alt="Volver" className="w-7 h-7" />
          </button>
          <h2 className="text-2xl font-bold text-center text-purple-600 mb-6">
            Áreas
          </h2>
          <div className="overflow-y-auto max-h-[750px]">
            <AreasTable
              areas={areas}
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

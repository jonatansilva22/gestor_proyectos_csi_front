import { useNavigate } from "react-router-dom";
import { useAreas } from "../../hooks/areas/useAreas";
import { useEntityModals } from "../../hooks/projects/useEntityModal";
import { Header } from "../../components/common/Header";
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
              Gestión de Áreas
            </h1>
            <NewItemButton
              label="Nueva Área"
              onClick={openCreateModal}
            />
          </div>
        </div>
        
        {/* Areas count */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            {areas.length} área{areas.length !== 1 ? 's' : ''} registrada{areas.length !== 1 ? 's' : ''}
          </p>
        </div>
        
        {/* Table container */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-y-auto max-h-[70vh]">
            <AreasTable
              areas={areas}
              onDeleteClick={openDeleteModal}
              onEditClick={openEditModal}
            />
          </div>
        </div>
        
        {/* Empty state */}
        {areas.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay áreas registradas</h3>
            <p className="text-gray-500 mb-4">Comienza creando tu primera área</p>
            <NewItemButton
              label="Crear Primera Área"
              onClick={openCreateModal}
            />
          </div>
        )}
      </div>

      {/* Create Modal */}
      <Modal
        open={showModal}
        onClose={closeCreateModal}
        title="Nueva Área"
      >
        <AreaForm
          onSubmit={handleCreateSubmit}
          onCancel={closeCreateModal}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        open={editModalOpen}
        onClose={closeEditModal}
        title="Editar Área"
      >
        {entityToEdit && (
          <AreaForm
            initialData={entityToEdit}
            onCancel={closeEditModal}
            onSubmit={handleEditSubmit}
          />
        )}
      </Modal>

      {/* Delete Modal */}
      <DeleteAreaModal
        open={deleteModalOpen}
        area={areaToDelete}
        onCancel={closeDeleteModal}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

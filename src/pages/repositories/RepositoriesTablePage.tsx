import { useNavigate } from "react-router-dom";
import { useRepositories } from "../../hooks/repositories/useRepositories";
import { useEntityModals } from "../../hooks/projects/useEntityModal";
import { Header } from "../../components/common/Header";
import { Modal } from "../../components/common/Modal";
import { NewItemButton } from "../../components/common/NewItemButton";
import { DeleteRepositoryModal } from "../../components/repositories/DeleteRepositoryModal";
import { RepositoriesTable } from "../../components/repositories/RepositoriesTable";
import { RepositoryForm } from "../../components/repositories/RepositoriesForm";
import { createRepository, deleteRepository, updateRepository } from "../../services/repositories/repositoriesServices";
import { notifySuccess, notifyError } from "../../components/common/ToastNotify";
import { getBackendErrorMsg } from "../../utils/projects/getBackendErrorMsg";
import volver from "../../assets/volver.png";
import { Repository } from "../../types/repositories/Repository";

export const RepositoriesTablePage = () => {
  const navigate = useNavigate();
  const { repositories, refreshRepositories } = useRepositories();

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
    entityToDelete: repositoryToDelete,
  } = useEntityModals<Repository>();

  const handleCreateSubmit = async (data: Omit<Repository, "id" | "created_at" | "updated_at">) => {
    try {
      await createRepository(data);
      notifySuccess("Repositorio creado exitosamente");
      await refreshRepositories();
      closeCreateModal();
    } catch (error: any) {
      notifyError(getBackendErrorMsg(error));
    }
  };

  const handleEditSubmit = async (updatedData: Omit<Repository, "id" | "created_at" | "updated_at">) => {
    if (!entityToEdit) return;
    try {
      await updateRepository(entityToEdit.id, updatedData);
      notifySuccess("Repositorio actualizado exitosamente");
      await refreshRepositories();
      closeEditModal();
    } catch (error: any) {
      notifyError(getBackendErrorMsg(error));
    }
  };

  const handleConfirmDelete = async () => {
    if (!repositoryToDelete) return;
    try {
      await deleteRepository(repositoryToDelete.id);
      notifySuccess("Repositorio eliminado exitosamente");
      await refreshRepositories();
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
              Gestión de Repositorios
            </h1>
            <NewItemButton
              label="Nuevo Repositorio"
              onClick={openCreateModal}
            />
          </div>
        </div>
        
        {/* Repositories count */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            {repositories.length} repositorio{repositories.length !== 1 ? 's' : ''} registrado{repositories.length !== 1 ? 's' : ''}
          </p>
        </div>
        
        {/* Table container */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-y-auto max-h-[70vh]">
            <RepositoriesTable
              repositories={repositories}
              onDeleteClick={openDeleteModal}
              onEditClick={openEditModal}
            />
          </div>
        </div>
        
        {/* Empty state */}
        {repositories.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay repositorios registrados</h3>
            <p className="text-gray-500 mb-4">Comienza creando tu primer repositorio</p>
            <NewItemButton
              label="Crear Primer Repositorio"
              onClick={openCreateModal}
            />
          </div>
        )}
      </div>

      {/* Create Modal */}
      <Modal open={showModal} onClose={closeCreateModal} title="Nuevo Repositorio">
        <RepositoryForm onSubmit={handleCreateSubmit} onCancel={closeCreateModal} />
      </Modal>

      {/* Edit Modal */}
      <Modal open={editModalOpen} onClose={closeEditModal} title="Editar Repositorio">
        {entityToEdit && (
          <RepositoryForm
            initialData={entityToEdit}
            onCancel={closeEditModal}
            onSubmit={handleEditSubmit}
          />
        )}
      </Modal>

      {/* Delete Modal */}
      <DeleteRepositoryModal
        open={deleteModalOpen}
        repository={repositoryToDelete}
        onCancel={closeDeleteModal}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

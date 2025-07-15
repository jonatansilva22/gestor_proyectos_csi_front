import { useNavigate } from "react-router-dom";
import { useRepositories } from "../../hooks/repositories/useRepositories";
import { useEntityModals } from "../../hooks/projects/useEntityModal";
import HeaderSidebarLayout from "../../components/common/HeaderSidebarLayout"; // <-- importar el layout
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
    <HeaderSidebarLayout headerTitle="CSI PRO - Repositorios">
      <div className="p-4 w-full h-full min-h-screen flex justify-center bg-white">
        <div className="w-full max-w-7xl">
          <button
            onClick={() => navigate(-1)}
            className="mb-4 rounded-full p-1 hover:bg-gray-200 cursor-pointer transition"
          >
            <img src={volver} alt="Volver" className="w-7 h-7" />
          </button>
          <h2 className="text-2xl font-bold text-center text-purple-600 mb-6">
            Repositorios
          </h2>
          <div className="overflow-y-auto max-h-[750px]">
            <RepositoriesTable
              repositories={repositories}
              onDeleteClick={openDeleteModal}
              onEditClick={openEditModal}
            />
          </div>
          <div className="mt-6">
            <NewItemButton label="Nuevo Repositorio" onClick={openCreateModal} />
          </div>
        </div>
      </div>

      <Modal open={showModal} onClose={closeCreateModal} title="Nuevo Repositorio">
        <RepositoryForm onSubmit={handleCreateSubmit} onCancel={closeCreateModal} />
      </Modal>

      <Modal open={editModalOpen} onClose={closeEditModal} title="Editar Repositorio">
        {entityToEdit && (
          <RepositoryForm
            initialData={entityToEdit}
            onCancel={closeEditModal}
            onSubmit={handleEditSubmit}
          />
        )}
      </Modal>

      <DeleteRepositoryModal
        open={deleteModalOpen}
        repository={repositoryToDelete}
        onCancel={closeDeleteModal}
        onConfirm={handleConfirmDelete}
      />
    </HeaderSidebarLayout>
  );
};

import { useNavigate } from "react-router-dom";
import { useRepositories } from "../../hooks/repositories/useRepositories";
import { useEntityModals } from "../../hooks/projects/useEntityModal";
import { useTheme } from "../../context/ThemeContext";
import HeaderSidebarLayout from "../../components/common/HeaderSidebarLayout";
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
import Filters from "../../features/admin/components/Filters";
import {useState} from "react";

export const RepositoriesTablePage = () => {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
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

  // 🔹 Estado para búsqueda
  const [searchTerm, setSearchTerm] = useState("");

  // 🔹 Filtrar repositorios según búsqueda
  const filteredRepositories = repositories.filter((repo) =>
    repo.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      <div
        className={`p-4 w-full h-full min-h-screen flex justify-center ${
          darkMode ? "bg-[#1A0F30]" : "bg-white"
        }`}
      >
        <div className="w-full max-w-7xl">
          <button
            onClick={() => navigate(-1)}
            className={`mb-4 rounded-full p-1 cursor-pointer transition ${
              darkMode ? "hover:bg-purple-700/20" : "hover:bg-gray-200"
            }`}
          >
            <img src={volver} alt="Volver" className="w-7 h-7" />
          </button>
          <h2
            className={`text-2xl font-bold text-center mb-6 ${
              darkMode ? "text-purple-300" : "text-purple-600"
            }`}
          >
            Repositorios
          </h2>

          {/* 🔹 Barra de búsqueda */}
          <Filters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            filterValue=""
            onFilterChange={() => {}}
            filterOptions={[]} // ⬅️ vacío, no se muestra select
            filterLabel=""
            totalCount={filteredRepositories.length}
            itemName="repositorios"
          />

          <div className="overflow-y-auto max-h-[750px]">
            <RepositoriesTable
              repositories={filteredRepositories}
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

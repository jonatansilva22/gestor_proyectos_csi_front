import { useProjects } from "../../hooks/projects/useProjects";
import { useEntityModals } from "../../hooks/projects/useEntityModal";
import { useTheme } from "../../context/ThemeContext";
import { ProjectsTable } from "../../components/projects/ProjectsTable";
import { ProjectForm } from "../../components/projects/ProjectForm";
import { Modal } from "../../components/common/Modal";
import { NewItemButton } from "../../components/common/NewItemButton";
import { DeleteProjectModal } from "../../components/projects/DeleteModal";
import { createProject, deleteProject } from "../../services/projects/projectService";
import { notifySuccess, notifyError } from "../../components/common/ToastNotify";
import { getBackendErrorMsg } from "../../utils/projects/getBackendErrorMsg";
import { Project } from "../../types/projects/Project";
import HeaderSidebarLayout from "../../components/common/HeaderSidebarLayout";
import Filters from "../../features/admin/components/Filters";
import { useState} from "react";

export const ProjectsTablePage = () => {
  const { darkMode } = useTheme();
  const { projects, refreshProjects } = useProjects();
  const {
    showModal,
    openCreateModal,
    closeCreateModal,
    deleteModalOpen,
    openDeleteModal,
    closeDeleteModal,
    entityToDelete: projectToDelete,
  } = useEntityModals<Project>();

  // 🔹 Estados para filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<number | null>(null);

  // 🔹 Filtrar proyectos según búsqueda y estado
  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter ? project.status.id === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  const handleConfirmDelete = async () => {
    if (!projectToDelete) return;
    try {
      await deleteProject(projectToDelete.id);
      notifySuccess("Proyecto eliminado exitosamente");
      await refreshProjects();
    } catch (error: any) {
      notifyError(getBackendErrorMsg(error));
    } finally {
      closeDeleteModal();
    }
  };

  return (
    <HeaderSidebarLayout headerTitle="CSI PRO - Proyectos">
      <div className="max-w-7xl mx-auto">
        <h2
          className={`text-2xl font-bold mb-6 text-center ${
            darkMode ? "text-purple-300" : "text-purple-600"
          }`}
        >
          Proyectos
        </h2>

        {/* 🔹 Barra de filtros */}
        <Filters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filterValue={statusFilter?.toString() ?? ""}
          onFilterChange={(val) => setStatusFilter(val ? Number(val) : null)}
          filterOptions={[
            { value: "1", label: "✅ Activo" },
            { value: "2", label: "⏸️ Inactivo" },
            { value: "3", label: "🏁 Completado" },
          ]}
          filterLabel="estados"
          totalCount={filteredProjects.length}
          itemName="proyecto"
        />

        {/* 🔹 Tabla de proyectos */}
        <ProjectsTable projects={filteredProjects} onDeleteClick={openDeleteModal} />

        <div className="mt-6">
          <NewItemButton label="Nuevo Proyecto" onClick={openCreateModal} />
        </div>

        <Modal open={showModal} onClose={closeCreateModal} title="Crear Proyecto">
          <ProjectForm
            onCancel={closeCreateModal}
            onSubmit={async (data) => {
              try {
                await createProject(data);
                closeCreateModal();
                notifySuccess("Proyecto creado exitosamente");
                await refreshProjects();
              } catch (error: any) {
                notifyError(getBackendErrorMsg(error));
              }
            }}
          />
        </Modal>

        <DeleteProjectModal
          open={deleteModalOpen}
          project={projectToDelete}
          onCancel={closeDeleteModal}
          onConfirm={handleConfirmDelete}
        />
      </div>
    </HeaderSidebarLayout>
  );
};

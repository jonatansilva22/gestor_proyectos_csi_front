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
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import volver from "../../assets/volver.png";

export const ProjectsTablePage = () => {
  const { darkMode } = useTheme();
  const { projects, refreshProjects } = useProjects();
  const navigate = useNavigate();

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

  // 🔹 Función segura para volver
  const handleBack = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate("/"); // fallback a inicio si no hay historial
    }
  };

  return (
    <HeaderSidebarLayout headerTitle="CSI PRO - Proyectos">
      <div className="max-w-7xl mx-auto">
        {/* 🔹 Botón volver */}
        <button
          onClick={handleBack}
          className={`mb-4 flex items-center space-x-2 rounded-full px-3 py-2 cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            darkMode 
              ? "bg-gray-800 hover:bg-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 focus:ring-purple-400 focus:ring-offset-[#1A0F30] active:bg-gray-600" 
              : "bg-white hover:bg-gray-200 focus:ring-gray-400 focus:ring-offset-white active:bg-gray-300 border border-gray-300"
          }`}
        >
          <img src={volver} alt="Volver" className="w-7 h-7" />
          <span className={darkMode ? "text-purple-300" : "text-gray-700"}>
          </span>
        </button>

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
            { value: "4", label: "🛠️ Mantenimiento" },
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

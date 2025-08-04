import { useNavigate } from "react-router-dom";
import { useProjects } from "../../hooks/projects/useProjects";
import { useEntityModals } from "../../hooks/projects/useEntityModal";
import { Header } from "../../components/common/Header";
import { ProjectsTable } from "../../components/projects/ProjectsTable";
import { ProjectForm } from "../../components/projects/ProjectForm";
import { Modal } from "../../components/common/Modal";
import { NewItemButton } from "../../components/common/NewItemButton";
import { DeleteProjectModal } from "../../components/projects/DeleteModal";
import { createProject, deleteProject } from "../../services/projects/projectService";
import { notifySuccess, notifyError } from "../../components/common/ToastNotify";
import { getBackendErrorMsg } from "../../utils/projects/getBackendErrorMsg";
import volver from "../../assets/volver.png";
import { Project } from "../../types/projects/Project";


export const ProjectsTablePage = () => {
  const navigate = useNavigate();
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
              Tabla de Proyectos
            </h1>
            <NewItemButton
              label="Nuevo Proyecto"
              onClick={openCreateModal}
            />
          </div>
        </div>
        
        {/* Projects count */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            {projects.length} proyecto{projects.length !== 1 ? 's' : ''} encontrado{projects.length !== 1 ? 's' : ''}
          </p>
        </div>
        
        {/* Table container */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-y-auto max-h-[70vh]">
            <ProjectsTable
              projects={projects}
              onDeleteClick={openDeleteModal}
            />
          </div>
        </div>
        
        {/* Empty state */}
        {projects.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay proyectos</h3>
            <p className="text-gray-500 mb-4">Comienza creando tu primer proyecto</p>
            <NewItemButton
              label="Crear Primer Proyecto"
              onClick={openCreateModal}
            />
          </div>
        )}
      </div>
      
      <Modal
        open={showModal}
        onClose={closeCreateModal}
        title="Crear Proyecto"
      >
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
  );
};
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
    <>
      <Header title="CSI PRO" />
      <div className="p-4 w-full h-full min-h-screen flex justify-center bg-white">
        <div className="w-full max-w-7xl">
          <button
            onClick={() => navigate(-1)}
            className="mb-4 rounded-full p-1 hover:bg-gray-200 cursor-pointer transition"
          >
            <img src={volver} alt="Volver" className="w-7 h-7" />
          </button>
          <h2 className="text-2xl font-bold text-center text-purple-600 mb-6">
            Proyectos
          </h2>
          <div className="overflow-y-auto max-h-[750px]">
            <ProjectsTable
              projects={projects}
              onDeleteClick={openDeleteModal}
            />
          </div>
          <div className="mt-6">
            <NewItemButton
              label="Nuevo Proyecto"
              onClick={openCreateModal}
            />
          </div>
        </div>
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
    </>
  );
};
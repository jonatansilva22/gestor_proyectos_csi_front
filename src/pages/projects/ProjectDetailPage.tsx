import { useParams, useNavigate } from "react-router-dom";
import { ProjectImageAndDescription } from "../../components/projects/ProjectDetailHeader";
import { ProjectDataTable } from "../../components/projects/ProjectDetailDataTable";
import HeaderSidebarLayout from "../../components/common/HeaderSidebarLayout";
import volver from "../../assets/volver.png";
import { useProjectDetail } from "../../hooks/projects/useProjectDetail";

export const ProjectDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { project, setProject } = useProjectDetail(id);

  if (!project) {
    return <div className="p-8">Cargando...</div>;
  }

  return (
    <HeaderSidebarLayout headerTitle="CSI PRO - Detalle del Proyecto">
      <div className="p-8 max-w-5xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 rounded-full p-1 hover:bg-gray-200 cursor-pointer transition"
        >
          <img src={volver} alt="Volver" className="w-7 h-7" />
        </button>
        <ProjectImageAndDescription
          project={project}
          onProjectUpdate={setProject}
        />
        <ProjectDataTable project={project} onProjectUpdate={setProject} />
      </div>
    </HeaderSidebarLayout>
  );
};

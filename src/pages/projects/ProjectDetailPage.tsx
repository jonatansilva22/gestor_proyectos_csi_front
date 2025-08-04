import { useParams, useNavigate } from "react-router-dom";
import { ProjectImageAndDescription } from "../../components/projects/ProjectDetailHeader";
import { ProjectDataTable } from "../../components/projects/ProjectDetailDataTable";
import { Header } from "../../components/common/Header";
import volver from "../../assets/volver.png";
import { useProjectDetail } from "../../hooks/projects/useProjectDetail";

export const ProjectDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { project, setProject } = useProjectDetail(id);

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header title="CSI PRO" />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Cargando proyecto...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="CSI PRO" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 max-w-7xl">
        {/* Back button */}
        <div className="mb-4 sm:mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-white transition-colors shadow-sm"
          >
            <img src={volver} alt="Volver" className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="text-sm sm:text-base font-medium">Volver</span>
          </button>
        </div>
        
        {/* Content */}
        <div className="space-y-6 sm:space-y-8">
          <ProjectImageAndDescription
            project={project}
            onProjectUpdate={setProject}
          />
          <ProjectDataTable project={project} onProjectUpdate={setProject} />
        </div>
      </div>
    </div>
  );
};

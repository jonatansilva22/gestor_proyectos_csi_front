import { useParams, useNavigate } from "react-router-dom";
import { ProjectImageAndDescription } from "../../components/projects/ProjectDetailHeader";
import { ProjectDataTable } from "../../components/projects/ProjectDetailDataTable";
import { useTheme } from "../../context/ThemeContext";
import { useMobileNavigation } from "../../hooks/useMobileNavigation";
import { useTouchButton } from "../../hooks/useTouchInteractions";
import HeaderSidebarLayout from "../../components/common/HeaderSidebarLayout";
import MobileNavigationShortcuts from "../../components/navigation/MobileNavigationShortcuts";
import volver from "../../assets/volver.png";
import { useProjectDetail } from "../../hooks/projects/useProjectDetail";

export const ProjectDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const { isMobile } = useMobileNavigation();
  const { project, setProject } = useProjectDetail(id);
  
  // Enhanced touch interactions for back button
  const backButtonTouch = useTouchButton(
    () => navigate(-1),
    {
      hapticFeedback: true,
      tapHapticPattern: 'medium',
    }
  );

  if (!project) {
    return <div className={`p-8 ${
      darkMode ? 'text-purple-300' : 'text-gray-800'
    }`}>Cargando...</div>;
  }

  return (
    <HeaderSidebarLayout headerTitle="CSI PRO - Detalle del Proyecto">
      <div className="p-4 sm:p-6 md:p-8 max-w-full sm:max-w-5xl mx-auto">
        <button
          ref={backButtonTouch.elementRef as React.Ref<HTMLButtonElement>}
          onClick={() => navigate(-1)}
          className={`
            mb-4 btn-icon touch-manipulation min-h-[44px] min-w-[44px]
            flex items-center justify-center rounded-lg transition-all duration-200
            ${darkMode 
              ? 'hover:bg-purple-700/20 focus:ring-purple-400 focus:ring-offset-gray-800 active:bg-purple-700/30' 
              : 'hover:bg-gray-200 focus:ring-gray-400 focus:ring-offset-white active:bg-gray-300'
            }
            ${isMobile ? 'p-3' : 'p-2'}
          `}
          aria-label="Volver a la página anterior"
        >
          <img 
            src={volver} 
            alt="" 
            className={`${isMobile ? 'w-6 h-6' : 'w-5 h-5 sm:w-6 sm:h-6'}`} 
          />
        </button>
        <div className={`rounded-2xl border shadow-lg mb-6 ${
          darkMode ? 'bg-[#3A2B5A] border-purple-700/30 shadow-purple-900/20' : 'bg-white border-gray-200'
        }`}>
          <div className="p-4 sm:p-6">
            <ProjectImageAndDescription
              project={project}
              onProjectUpdate={setProject}
            />
          </div>
        </div>

        <div className={`rounded-2xl border shadow-lg ${
          darkMode ? 'bg-[#3A2B5A] border-purple-700/30 shadow-purple-900/20' : 'bg-white border-gray-200'
        }`}>
          <div className="p-4 sm:p-6">
            <ProjectDataTable project={project} onProjectUpdate={setProject} />
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation Shortcuts */}
      <MobileNavigationShortcuts position="bottom" maxShortcuts={4} />
    </HeaderSidebarLayout>
  );
};

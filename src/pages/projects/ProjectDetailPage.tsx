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
import { useAuth } from "../../context/AuthContext";

export const ProjectDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const { isMobile } = useMobileNavigation();
  const { project, setProject } = useProjectDetail(id);
  const { user } = useAuth();
  const userRole = user?.role ?? user?.role_id;
  const canEdit = userRole !== 3; // Colaborador (3) solo lectura
  
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
            mb-4 btn-icon touch-manipulation min-h-[44px] min-w-[44px] cursor-pointer
            flex items-center justify-center rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
            ${darkMode 
              ? 'bg-gray-800 hover:bg-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 focus:ring-purple-400 focus:ring-offset-[#1A0F30] active:bg-gray-600' 
              : 'bg-white hover:bg-gray-200 focus:ring-gray-400 focus:ring-offset-white active:bg-gray-300 border border-gray-300'
            }
            ${isMobile ? 'p-3' : 'p-2'}
          `}
          aria-label="Volver a la página anterior"
        >
          <img 
            src={volver} 
            alt="Volver" 
            className={`${isMobile ? 'w-7 h-7' : 'w-6 h-6 sm:w-7 sm:h-7'}`} 
          />
        </button>
        <div className={`rounded-2xl border shadow-lg mb-6 ${
          darkMode ? 'bg-[#3A2B5A] border-purple-700/30 shadow-purple-900/20' : 'bg-white border-gray-200'
        }`}>
          <div className="p-4 sm:p-6">
            <ProjectImageAndDescription
              project={project}
              onProjectUpdate={setProject}
              canEdit={canEdit}
            />
          </div>
        </div>

        <div className={`rounded-2xl border shadow-lg ${
          darkMode ? 'bg-[#3A2B5A] border-purple-700/30 shadow-purple-900/20' : 'bg-white border-gray-200'
        }`}>
          <div className="p-4 sm:p-6">
            <ProjectDataTable project={project} onProjectUpdate={setProject} canEdit={canEdit} />
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation Shortcuts */}
      <MobileNavigationShortcuts position="bottom" maxShortcuts={4} />
    </HeaderSidebarLayout>
  );
};

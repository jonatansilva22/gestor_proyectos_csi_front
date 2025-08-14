import { ProjectCard } from "../../components/projects/ProjectCard";
import { useProjects } from "../../hooks/projects/useProjects";
import HeaderSidebarLayout from "../../components/common/HeaderSidebarLayout";

export const ProjectsPage = () => {
  const { projects } = useProjects();

  return (
    <HeaderSidebarLayout headerTitle="CSI PRO - Proyectos">
      <div className="w-full max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Proyectos
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-white">
            Explora todos los proyectos disponibles
          </p>
        </div>

        {/* Projects Grid - Responsive */}
        {projects.length === 0 ? (
          <div className="bg-white dark:bg-[#2A1B4A] rounded-2xl shadow-lg border border-gray-200 dark:border-purple-600/50 p-8 text-center">
            <div className="mb-4">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No hay proyectos disponibles
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Aún no se han creado proyectos en el sistema.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 3xl:grid-cols-5 gap-4 sm:gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </HeaderSidebarLayout>
  );
};

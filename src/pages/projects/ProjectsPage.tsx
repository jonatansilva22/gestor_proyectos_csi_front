import { ProjectCard } from "../../components/projects/ProjectCard";
import { Header } from "../../components/common/Header";
import { useProjects } from "../../hooks/projects/useProjects";

export const ProjectsPage = () => {
  const { projects } = useProjects();

  return (
    <>
      <div className="pb-4 sm:pb-6">
        <Header title="CSI PRO" />
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </>
  );
};
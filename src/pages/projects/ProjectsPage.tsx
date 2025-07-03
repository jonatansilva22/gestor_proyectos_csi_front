import { ProjectCard } from "../../components/projects/ProjectCard";
import { Header } from "../../components/common/Header";
import { useProjects } from "../../hooks/projects/useProjects";

export const ProjectsPage = () => {
  const { projects } = useProjects();

  return (
    <>
      <div className="pb-14">
        <Header title="CSI PRO" />
      </div>
      <div className="container mx-auto">
        <div className="flex flex-wrap gap-4 px-10">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </>
  );
};
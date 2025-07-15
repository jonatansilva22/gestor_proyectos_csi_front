import React from "react";
import { ProjectCard } from "../../components/projects/ProjectCard";
import { useProjects } from "../../hooks/projects/useProjects";
import HeaderSidebarLayout from "../../components/common/HeaderSidebarLayout";

export const ProjectsPage = () => {
  const { projects } = useProjects();

  return (
    <HeaderSidebarLayout headerTitle="CSI PRO - Proyectos">
      <div className="container mx-auto">
        <div className="flex flex-wrap gap-4 px-10">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </HeaderSidebarLayout>
  );
};

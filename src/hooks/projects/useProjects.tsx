import { useEffect, useState } from "react";
import { Project } from "../../types/projects/Project";
import { getProjects } from "../../services/projects/projectService";

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);

  const refreshProjects = async () => {
    const data = await getProjects();
    setProjects(data);
  };

  useEffect(() => {
    refreshProjects();
  }, []);

  return { projects, setProjects, refreshProjects };
}
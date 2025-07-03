import { useEffect, useState } from "react";
import { Project } from "../../types/projects/Project";
import { getProjectById } from "../../services/projects/projectService";

export function useProjectDetail(id?: string) {
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    if (id) {
      getProjectById(Number(id)).then(setProject);
    }
  }, [id]);

  return { project, setProject };
}
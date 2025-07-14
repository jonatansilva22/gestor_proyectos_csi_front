import { useEffect, useState } from "react";
import { getRepositories } from "../../services/projects/projectService";

export const useRepositoriesOptions = () => {
  const [options, setOptions] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    getRepositories().then(data => {
      const mapped = data.map((r: any) => ({
        value: r.id.toString(),
        label: r.name,
      }));
      setOptions(mapped);
    });
  }, []);

  return options;
};
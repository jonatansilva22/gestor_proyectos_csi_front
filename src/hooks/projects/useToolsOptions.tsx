import { useEffect, useState } from "react";
import { getTools } from "../../services/projects/projectService";

export const useToolsOptions = () => {
  const [options, setOptions] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    getTools().then(data => {
      const mapped = data.map((t: any) => ({
        value: t.id.toString(),
        label: t.name,
      }));
      setOptions(mapped);
    });
  }, []);

  return options;
};

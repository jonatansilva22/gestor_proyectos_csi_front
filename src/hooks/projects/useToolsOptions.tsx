import { useEffect, useState } from "react";
import { getTools } from "../../services/projects/projectService";

export const useToolsOptions = () => {
  const [options, setOptions] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    getTools().then(data => {
      if (data && Array.isArray(data)) {
        const mapped = data.map((t: any) => ({
          value: t.id.toString(),
          label: t.name,
        }));
        setOptions(mapped);
      }
    }).catch(() => {
      // Si falla, mantener array vacío
      setOptions([]);
    });
  }, []);

  return options;
};

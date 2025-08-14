// hooks/projects/useGroupOptions.ts
import { useEffect, useState } from "react";
import { getGroups } from "../../services/projects/projectService";

export function useGroupsOptions() {
  const [options, setOptions] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    getGroups().then(data => {
      if (data && Array.isArray(data)) {
        setOptions(data.map((g: any) => ({ value: g.id.toString(), label: g.name })));
      }
    }).catch(() => {
      // Si falla, mantener array vacío
      setOptions([]);
    });
  }, []);

  return options;
}

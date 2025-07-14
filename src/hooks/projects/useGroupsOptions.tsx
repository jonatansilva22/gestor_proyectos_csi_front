// hooks/projects/useGroupOptions.ts
import { useEffect, useState } from "react";
import { getGroups } from "../../services/projects/projectService";

export function useGroupsOptions() {
  const [options, setOptions] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    getGroups().then(data => {
      setOptions(data.map((g: any) => ({ value: g.id.toString(), label: g.name })));
    });
  }, []);

  return options;
}

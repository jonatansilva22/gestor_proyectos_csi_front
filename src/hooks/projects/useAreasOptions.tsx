// useAreaOptions.ts
import { useEffect, useState } from "react";
import { getAreas } from "../../services/projects/projectService";

export const useAreasOptions = () => {
  const [options, setOptions] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    getAreas().then((data) => {
      const mapped = data.map((a: any) => ({ value: a.id.toString(), label: a.name }));
      setOptions(mapped);
    });
  }, []);

  return options;
};

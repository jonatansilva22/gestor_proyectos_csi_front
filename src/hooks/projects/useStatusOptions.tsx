import { useEffect, useState } from "react";
import { getStatusTypes } from "../../services/projects/projectService";

export function useStatusOptions() {
  const [options, setOptions] = useState<{ value: string; label: string }[]>([]);
  useEffect(() => {
    getStatusTypes().then(data =>
      setOptions(data.map((s: any) => ({ value: s.id.toString(), label: s.name })))
    );
  }, []);
  return options;
}
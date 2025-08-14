import { useEffect, useState } from "react";
import { Area } from "../../types/areas/Area";
import { getAreas } from "../../services/areas/areasServices";

export function useAreas() {
  const [areas, setAreas] = useState<Area[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshAreas = async () => {
    setLoading(true);
    const data = await getAreas();
    setAreas(data);
    setLoading(false);
  };

  useEffect(() => {
    refreshAreas();
  }, []);

  return { areas, setAreas, refreshAreas, loading };
}
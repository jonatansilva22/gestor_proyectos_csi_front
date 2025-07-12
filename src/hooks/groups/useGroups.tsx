import { useState, useEffect } from "react";
import { Group } from "../../types/groups/Group";
import { getGroups } from "../../services/groups/groupsServices";

export const useGroups = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGroups = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getGroups();
      setGroups(data);
    } catch (err: any) {
      setError(err.message || "Error cargando grupos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  return { groups, loading, error, fetchGroups };
};

import { useState, useEffect } from "react";
import { Repository } from "../../types/repositories/Repository";
import { getRepositories } from "../../services/repositories/repositoriesServices";

export function useRepositories() {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshRepositories = async () => {
    setLoading(true);
    try {
      const data = await getRepositories();
      setRepositories(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Error al obtener repositorios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshRepositories();
  }, []);

  return {
    repositories,
    loading,
    error,
    refreshRepositories,
    setRepositories,  
  };
}

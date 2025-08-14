// src/hooks/tools/useTools.ts
import { useEffect, useState } from "react";
import { Tool } from "../../types/tools/Tool";
import { getTools } from "../../services/tools/toolsServices";

export function useTools() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshTools = async () => {
    setLoading(true);
    const data = await getTools();
    setTools(data);
    setLoading(false);
  };

  useEffect(() => {
    refreshTools();
  }, []);

  return { tools, setTools, refreshTools, loading };
}
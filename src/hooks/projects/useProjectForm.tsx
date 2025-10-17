import { useState } from "react";

export const useProjectForm = (
  initialStatus = 1,
  initialData?: Partial<{
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    image: File | null;
    groupId: number;
    statusId: number;
    areaIds: number[];
    toolIds: number[];
    repositoryIds: number[];
  }>
) => {
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [startDate, setStartDate] = useState(initialData?.startDate || "");
  const [endDate, setEndDate] = useState(initialData?.endDate || "");
  const [image, setImage] = useState<File | null>(initialData?.image || null);
  const [groupId, setGroupId] = useState<number | undefined>(
    initialData?.groupId
  );
  const [statusId, setStatusId] = useState(
    initialData?.statusId || initialStatus
  );
  const [areaIds, setAreaIds] = useState<number[]>(initialData?.areaIds || []);
  const [toolIds, setToolIds] = useState<number[]>(initialData?.toolIds || []);
  const [repositoryIds, setRepositoryIds] = useState<number[]>(
    initialData?.repositoryIds || []
  );
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setName("");
    setDescription("");
    setStartDate("");
    setEndDate("");
    setImage(null);
    setGroupId(undefined);
    setStatusId(initialStatus);
    setAreaIds([]);
    setToolIds([]);
    setRepositoryIds([]);
    setError(null);
  };

  return {
    name,
    setName,
    description,
    setDescription,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    image,
    setImage,
    groupId,
    setGroupId,
    statusId,
    setStatusId,
    areaIds,
    setAreaIds,
    toolIds,
    setToolIds,
    repositoryIds,
    setRepositoryIds,
    error,
    setError,
    reset,
  };
};

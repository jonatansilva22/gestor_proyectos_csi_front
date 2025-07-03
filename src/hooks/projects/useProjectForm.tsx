import { useState } from "react";

export const useProjectForm = (initialOwner = 1, initialGroup = 1, initialStatus = 1) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setName("");
    setDescription("");
    setStartDate("");
    setEndDate("");
    setImage(null);
    setError(null);
  };

  return {
    name, setName,
    description, setDescription,
    startDate, setStartDate,
    endDate, setEndDate,
    image, setImage,
    error, setError,
    reset,
    initialOwner,
    initialGroup,
    initialStatus,
  };
};
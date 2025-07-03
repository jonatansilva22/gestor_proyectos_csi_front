import { Area } from "../../types/areas/Area";
import { AreaForm } from "./AreasForm";
import { updateArea } from "../../services/areas/areasServices";
import { notifySuccess, notifyError } from "../../components/common/ToastNotify";
import { getBackendErrorMsg } from "../../utils/projects/getBackendErrorMsg";

interface AreasEditProps {
  initialData: Area;
  onCancel: () => void;
  onSuccess: () => void;
}

export const AreasEdit = ({ initialData, onCancel, onSuccess }: AreasEditProps) => {
  const handleEditSubmit = async (data: Omit<Area, "id" | "createdAt" | "updatedAt">) => {
    try {
      await updateArea(initialData.id, data);
      notifySuccess("Área actualizada exitosamente");
      onSuccess(); 
    } catch (error: any) {
      notifyError(getBackendErrorMsg(error));
    }
  };

  return (
    <AreaForm
      initialData={initialData}
      onCancel={onCancel}
      onSubmit={handleEditSubmit}
    />
  );
};

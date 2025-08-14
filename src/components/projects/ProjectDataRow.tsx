import editar from "../../assets/editar-line.png";
import { formatDate } from "../../utils/projects/formatDate";

interface DataRowProps {
  label: string;
  value: string;
  icon: string;
  editable?: boolean;
  editing?: boolean;
  tempValue?: string;
  onEdit?: () => void;
  onChange?: (v: string) => void;
  onSave?: () => void;
  onCancel?: () => void;
}

export const ProjectDataRow = ({
  label,
  value,
  icon,
  editable = false,
  editing = false,
  tempValue = "",
  onEdit,
  onChange,
  onSave,
  onCancel,
}: DataRowProps) => (
  <div className="flex items-center gap-x-12 py-2">
    <img src={icon} alt={label} className="w-6 h-6 mr-2" />
    <span className="w-56 font-semibold">{label}</span>
    {editing ? (
      <>
        <input
          type={label.includes("Fecha") ? "date" : "text"}
          className="border rounded px-2 py-1 text-sm"
          value={tempValue}
          onChange={e => onChange?.(e.target.value)}
        />
        <button className="ml-2 text-green-600" onClick={onSave}>Guardar</button>
        <button className="ml-2 text-gray-600" onClick={onCancel}>Cancelar</button>
      </>
    ) : (
      <>
        <span className="text-sm">
          {label.includes("Fecha") ? formatDate(value) : value}
        </span>
        {editable && (
          <img
            src={editar}
            alt="Editar"
            className="w-5 h-5 ml-auto cursor-pointer"
            onClick={onEdit}
          />
        )}
      </>
    )}
    {!editable && !editing && <span className="w-5 h-5 ml-auto" />}
  </div>
);
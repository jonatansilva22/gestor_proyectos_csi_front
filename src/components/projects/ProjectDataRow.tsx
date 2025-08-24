import editar from "../../assets/editar-line.png";
import { formatDate } from "../../utils/projects/formatDate";
import { useTheme } from "../../context/ThemeContext";

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
}: DataRowProps) => {
  const { darkMode } = useTheme();
  
  return (
    <div className={`flex items-center gap-x-12 py-2 ${
      darkMode ? 'text-white' : 'text-gray-900'
    }`}>
    <img src={icon} alt={label} className="w-6 h-6 mr-2" />
    <span className="w-56 font-semibold">{label}</span>
    {editing ? (
      <>
        <input
          type={label.includes("Fecha") ? "date" : "text"}
          className={`border rounded px-2 py-1 text-sm ${
            darkMode 
              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
              : 'bg-white border-gray-300 text-gray-900'
          }`}
          value={tempValue}
          onChange={e => onChange?.(e.target.value)}
        />
        <button className={`ml-2 ${
          darkMode ? 'text-green-400 hover:text-green-300' : 'text-green-600 hover:text-green-700'
        } transition-colors`} onClick={onSave}>Guardar</button>
        <button className={`ml-2 ${
          darkMode ? 'text-gray-300 hover:text-gray-100' : 'text-gray-600 hover:text-gray-800'
        } transition-colors`} onClick={onCancel}>Cancelar</button>
      </>
    ) : (
      <>
        <span className={`text-sm ${
          darkMode ? 'text-gray-200' : 'text-gray-700'
        }`}>
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
};
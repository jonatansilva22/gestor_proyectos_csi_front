import { InlineEdit } from '../common/InlineEdit';
import { useTheme } from '../../context/ThemeContext';

interface DataRowProps {
  label: string;
  value: string | string[]; // ← puede ser array para multiselect
  icon?: string;
  editable?: boolean;
  inputType?: "text" | "textarea" | "select" | "date" | "multiselect"; // ← agrega multiselect
  onSave?: (newValue: string | string[]) => Promise<void>; // ← soporte para arrays
  renderDisplay?: (value: string | string[]) => React.ReactNode;
  options?: { value: string; label: string }[];
  colorDot?: string;
}

export const DataRow = ({
  label,
  value,
  icon,
  editable = false,
  inputType = "text",
  options,
  onSave,
  renderDisplay,
  colorDot,
}: DataRowProps) => {
  const { darkMode } = useTheme();
  
  return (
  <div className={`flex items-center gap-x-12 py-2 ${
    darkMode ? 'text-purple-300' : 'text-gray-900'
  }`}>
    <img src={icon} alt={label} className="w-6 h-6 mr-2" />
    <span className={`w-56 font-semibold ${
      darkMode ? 'text-purple-300' : 'text-gray-900'
    }`}>{label}</span>
    {colorDot && <span className={`w-4 h-4 rounded-full inline-block ${colorDot} mr-2`} />}
    {editable && onSave ? (
  <InlineEdit
    value={value}
    inputType={inputType}
    onSave={onSave}
    renderDisplay={renderDisplay}
    options={options}
    className="flex-1"
  />
) : (
  <div className="flex-1">
  {renderDisplay ? renderDisplay(value) : <span className={darkMode ? 'text-purple-200' : 'text-gray-700'}>{String(value)}</span>}
</div>
    )}
  </div>
  );
};

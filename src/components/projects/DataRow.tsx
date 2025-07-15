import {  ProjectLabel } from '../../const/projectIcons';
import { InlineEdit } from '../common/InlineEdit';

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
}: DataRowProps) => (
  <div className="flex items-center gap-x-12 py-2">
    <img src={icon} alt={label} className="w-6 h-6 mr-2" />
    <span className="w-56 font-semibold">{label}</span>
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
  {renderDisplay ? renderDisplay(value) : <span>{String(value)}</span>}
</div>
    )}
  </div>
);

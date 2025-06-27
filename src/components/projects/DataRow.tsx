import {  ProjectLabel } from '../../const/projectIcons';
import { InlineEdit } from '../common/InlineEdit';

interface DataRowProps {
  label: ProjectLabel;
  value: string;
  icon: string;
  editable?: boolean;
  inputType?: "text" | "date" | "select";
  options?: { value: string; label: string }[];
  onSave?: (newValue: string) => Promise<void> | void;
  renderDisplay?: (value: string) => React.ReactNode;
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
        options={options}
        onSave={onSave}
        renderDisplay={renderDisplay}
        className="text-sm"
      />
    ) : (
      <span className="text-sm">{renderDisplay ? renderDisplay(value) : value}</span>
    )}
  </div>
);
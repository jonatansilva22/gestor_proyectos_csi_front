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
  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 px-4 sm:px-6 py-4">
    {/* Mobile layout: Icon + Label on top */}
    <div className="flex items-center gap-3 sm:min-w-0 sm:flex-1">
      <img src={icon} alt={label} className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
      <span className="font-semibold text-sm sm:text-base text-gray-700 min-w-0">
        {label}
      </span>
      {colorDot && (
        <span className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full flex-shrink-0 ${colorDot}`} />
      )}
    </div>
    
    {/* Value section */}
    <div className="flex-1 sm:flex-initial sm:min-w-0 pl-8 sm:pl-0">
      {editable && onSave ? (
        <InlineEdit
          value={value}
          inputType={inputType}
          options={options}
          onSave={onSave}
          renderDisplay={renderDisplay}
          className="text-sm sm:text-base text-gray-900"
        />
      ) : (
        <span className="text-sm sm:text-base text-gray-900 block">
          {renderDisplay ? renderDisplay(value) : value}
        </span>
      )}
    </div>
  </div>
);
interface FormInputProps {
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  placeholder?: string; 
}
export const FormInput = ({
  label,
  type = "text",
  value,
  onChange,
  placeholder = "", 
  required = false,
}: FormInputProps) => (
  <div className="flex-1">
    <label className="block font-semibold mb-1">
      {label}
      {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      className="w-full border rounded px-3 py-2"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
    />
  </div>
);
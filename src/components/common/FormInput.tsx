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
    <label className="block font-semibold mb-1 text-sm sm:text-base">
      {label}
      {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      className="w-full border rounded px-3 py-2 text-sm sm:text-base focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
    />
  </div>
);
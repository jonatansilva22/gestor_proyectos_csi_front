interface FormTextareaProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string; 
}

export const FormTextarea = ({
  label,
  value,
  onChange,
  placeholder = "",
}: FormTextareaProps) => (
  <div>
    <label className="block font-semibold mb-1">{label}</label>
    <textarea
      className="w-full border rounded px-3 py-2 min-h-[42px]"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  </div>
);
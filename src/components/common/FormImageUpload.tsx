import subirIcon from "../../assets/subir.png";

interface FormImageUploadProps {
  image: File | null;
  onChange: (file: File | null) => void;
  required?: boolean;
  label?: string;
}

export const FormImageUpload = ({
  image,
  onChange,
  required = false,
  label = "Imagen"
}: FormImageUploadProps) => (
  <div>
    <label className="block font-semibold mb-1">{label}{required && ' *'}</label>
    <label className="flex items-center gap-2 cursor-pointer w-fit bg-gray-100 px-4 py-2 rounded hover:bg-gray-200">
      <img src={subirIcon} alt="Subir" className="w-5 h-5" />
      <span>Imagen</span>
      <input
        type="file"
        accept="image/*"
        onChange={e => onChange(e.target.files?.[0] || null)}
        className="hidden"
      />
    </label>
    {image && (
      <span className="block mt-1 text-sm text-gray-600">{image.name}</span>
    )}
  </div>
);

import subirIcon from "../../assets/subir.png";
import { useTheme } from "../../context/ThemeContext";

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
}: FormImageUploadProps) => {
  const { darkMode } = useTheme();
  
  return (
    <div>
      <label className={`block font-semibold mb-1 ${
        darkMode ? 'text-white' : 'text-gray-900'
      }`}>
        {label}{required && ' *'}
      </label>
      <label className={`flex items-center gap-2 cursor-pointer w-fit px-4 py-2 rounded transition-colors ${
        darkMode 
          ? 'bg-gray-700 hover:bg-gray-600 text-white' 
          : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
      }`}>
        <img src={subirIcon} alt="Subir" className="w-5 h-5" />
        <span className={darkMode ? 'text-white' : 'text-gray-900'}>Imagen</span>
        <input
          type="file"
          accept="image/*"
          onChange={e => onChange(e.target.files?.[0] || null)}
          className="hidden"
        />
      </label>
      {image && (
        <span className={`block mt-1 text-sm ${
          darkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>
          {image.name}
        </span>
      )}
    </div>
  );
};

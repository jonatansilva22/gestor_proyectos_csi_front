import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useTheme } from "../../context";
import { FormInput, FormSelect, FileUpload } from "../ui";
import { CreateUserRequest, UserRole } from "../../types";

interface FormErrors {
  username?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  role?: string;
  photo?: string;
}

interface CreateUserFormProps {
  mode?: 'page' | 'modal';
  onSuccess?: (userData: CreateUserRequest) => void; // userData es requerido
  onCancel?: () => void;
}

const USER_ROLES = [
  { value: "user", label: "Usuario" },
  { value: "admin", label: "Administrador" },
];

export const CreateUserForm: React.FC<CreateUserFormProps> = ({
  mode = 'page',
  onSuccess,
  onCancel
}) => {
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  const [formData, setFormData] = useState<CreateUserRequest>({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "" as UserRole,
    photo: undefined,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleRoleChange = (value: string) => {
    setFormData((prev) => ({ ...prev, role: value as UserRole }));
    if (errors.role) {
      setErrors((prev) => ({ ...prev, role: undefined }));
    }
  };

  const handleFileSelect = (file: File | null) => {
    setFormData((prev) => ({ ...prev, photo: file || undefined }));
    if (errors.photo) {
      setErrors((prev) => ({ ...prev, photo: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "El nombre de usuario es requerido";
    }

    if (!formData.firstName.trim()) {
      newErrors.firstName = "El nombre es requerido";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "El apellido es requerido";
    }

    if (!formData.email.trim()) {
      newErrors.email = "El correo es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "El correo no tiene un formato válido";
    }

    if (!formData.password.trim()) {
      newErrors.password = "La contraseña es requerida";
    } else if (formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    }

    if (!formData.role) {
      newErrors.role = "El rol es requerido";
    }

    if (!formData.photo) {
      newErrors.photo = "La foto del usuario es requerida";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Aquí iría la llamada al userService
      console.log("Creating user:", formData);
      toast.success("Usuario creado exitosamente");
      
      // Call the success callback with the user data
      if (onSuccess) {
        onSuccess(formData);
      }
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error("Error al crear el usuario. Por favor intente nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelClick = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate(-1);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Username Field */}
      <FormInput
        label="Nombre de usuario"
        type="text"
        value={formData.username}
        onChange={handleInputChange}
        placeholder="Ingrese el nombre de usuario"
        required
        name="username"
        error={errors.username}
      />

      {/* First Name Field */}
      <FormInput
        label="Nombre"
        type="text"
        value={formData.firstName}
        onChange={handleInputChange}
        placeholder="Ingrese el nombre"
        required
        name="firstName"
        error={errors.firstName}
      />

      {/* Last Name Field */}
      <FormInput
        label="Apellido"
        type="text"
        value={formData.lastName}
        onChange={handleInputChange}
        placeholder="Ingrese el apellido"
        required
        name="lastName"
        error={errors.lastName}
      />

      {/* Email Field */}
      <FormInput
        label="Correo"
        type="email"
        value={formData.email}
        onChange={handleInputChange}
        placeholder="Ingrese el correo institucional"
        required
        name="email"
        error={errors.email}
      />

      {/* Password Field */}
      <FormInput
        label="Contraseña"
        type="password"
        value={formData.password}
        onChange={handleInputChange}
        placeholder="Ingrese una contraseña"
        required
        name="password"
        error={errors.password}
      />

      {/* Role Select */}
      <FormSelect
        label="Rol"
        value={formData.role}
        onChange={handleRoleChange}
        placeholder="Seleccione el rol del usuario"
        options={USER_ROLES}
        required
        name="role"
        error={errors.role}
      />

      {/* Photo Upload */}
      <FileUpload
        label="Foto del Usuario"
        onFileSelect={handleFileSelect}
        required
        error={errors.photo}
      />

      {/* Action Buttons */}
      <div className={`flex ${mode === 'modal' ? 'justify-end gap-3' : 'flex-col-reverse sm:flex-row items-center justify-between gap-4'} pt-8`}>
        {/* Cancel Button */}
        <button
          type="button"
          onClick={handleCancelClick}
          className={`
            font-inter text-base font-normal leading-[100%] cursor-pointer 
            transition-colors duration-200
            ${mode === 'modal' 
              ? 'px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50'
              : `${darkMode ? "text-white hover:text-gray-300" : "text-black hover:text-gray-700"} hover:underline`
            }
          `}
        >
          Cancelar
        </button>

        {/* Create Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`
            flex justify-center items-center gap-2 
            ${mode === 'modal' 
              ? 'px-4 py-2' 
              : 'w-full sm:w-[124px] px-3 py-3'
            }
            rounded-lg border border-gray-800 bg-[#6F43D6] text-gray-100 
            font-inter text-base font-normal leading-[100%] cursor-pointer 
            transition-all duration-200
            ${
              isLoading
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-[#5A359A] hover:shadow-lg transform hover:-translate-y-0.5"
            }
          `}
        >
          {isLoading ? "Creando..." : mode === 'modal' ? "Crear Usuario" : "Crear"}
        </button>
      </div>
    </form>
  );
};

export default CreateUserForm;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useTheme } from "../../context";
import { FormInput, FormSelect, FileUpload } from "../common";
import { CreateUserRequest } from "../../types";
import { userService } from "../../services";
import { validateUserForm } from "../../utils/validation";
import { useValidationErrors } from "../../hooks/useValidationErrors";

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
  const { errors, clearErrors, clearFieldError, handleApiError, setBackendErrors } = useValidationErrors();

  const [formData, setFormData] = useState<CreateUserRequest>({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    role: "user", // Default to user role
    photo: undefined,
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    clearFieldError(name);
  };

  const handleRoleChange = (value: string) => {
    setFormData((prev) => ({ ...prev, role: value as any }));
    clearFieldError('role');
  };

  const handleFileSelect = (file: File | null) => {
    setFormData((prev) => ({ ...prev, photo: file || undefined }));
    clearFieldError('photo');
  };

  const validateForm = (): boolean => {
    // Use comprehensive backend validation
    const validationResult = validateUserForm({
      username: formData.username,
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
      photo: formData.photo
    });

    if (!validationResult.isValid) {
      setBackendErrors(validationResult.errors);
    }
    return validationResult.isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Llamada real al userService
      const createdUser = await userService.createUser(formData);
      console.log("User created:", createdUser);
      toast.success("Usuario creado exitosamente");
      
      // Call the success callback with the user data
      if (onSuccess) {
        onSuccess(formData);
      }
      
      // Reset form
      setFormData({
        username: "",
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        role: "user",
        photo: undefined,
      });
    } catch (error: any) {
      console.error("Error creating user:", error);
      
      // Enhanced error handling with backend validation support
      handleApiError(error);
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
        value={formData.first_name}
        onChange={handleInputChange}
        placeholder="Ingrese el nombre"
        required
        name="first_name"
        error={errors.first_name}
      />

      {/* Last Name Field */}
      <FormInput
        label="Apellido"
        type="text"
        value={formData.last_name}
        onChange={handleInputChange}
        placeholder="Ingrese el apellido"
        required
        name="last_name"
        error={errors.last_name}
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
        value={formData.role.toString()}
        onChange={handleRoleChange}
        placeholder="Seleccione el rol del usuario"
        options={USER_ROLES}
        required
        name="role"
        error={errors.role}
      />

      {/* Photo Upload */}
      <FileUpload
        label="Foto del Usuario (Opcional)"
        onFileSelect={handleFileSelect}
        required={false}
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

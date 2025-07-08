import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useTheme } from "../../context";
import { FormSelect, FileUpload } from "../common";
import { FormInput } from "../common/user/FormInput";
import { CreateUserRequest, UserRole } from "../../types";
import { userService } from "../../services";
import { validateUserForm } from "../../utils/validation";
import { useValidationErrors } from "../../hooks/useValidationErrors";

interface CreateUserFormProps {
  mode?: 'page' | 'modal';
  onSuccess?: (userData: CreateUserRequest) => void;
  onCancel?: () => void;
}

// Interfaz de datos del formulario interno con rol string para componentes de UI
interface CreateUserFormData {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: UserRole; // Mantener como string para la UI
  photo?: File;
}


// Mapeo de roles para compatibilidad con backend
const ROLE_MAPPING = {
  "user": 2,
  "admin": 1
} as const;

export const CreateUserForm: React.FC<CreateUserFormProps> = ({
  mode = 'page',
  onSuccess,
  onCancel
}) => {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const { errors, clearErrors, clearFieldError, handleApiError, setBackendErrors } = useValidationErrors();

  const [formData, setFormData] = useState<CreateUserFormData>({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    role: "user", // Rol por defecto: usuario
    photo: undefined,
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Limpiar error cuando el usuario comienza a escribir
    clearFieldError(name);
  };

  const handleRoleChange = (value: string) => {
    setFormData((prev) => ({ ...prev, role: value as UserRole }));
    clearFieldError('role');
  };

  const handleFileSelect = (file: File | null) => {
    setFormData((prev) => ({ ...prev, photo: file || undefined }));
    clearFieldError('photo');
  };

  const validateForm = (): boolean => {
    // Usar validación completa del backend
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
      // Convertir rol string a entero para compatibilidad con backend
      const roleAsNumber = ROLE_MAPPING[formData.role];
      const formDataWithIntRole: CreateUserRequest = {
        ...formData,
        role: roleAsNumber
      };
      
      // Llamada real al userService
      const createdUser = await userService.createUser(formDataWithIntRole);
      console.log("User created:", createdUser);
      toast.success("Usuario creado exitosamente");
      
      // Llamar callback de éxito con los datos del usuario
      if (onSuccess) {
        onSuccess(formDataWithIntRole);
      }
      
      // Resetear formulario solo si no está en modo modal o si no hay callback onSuccess
      if (mode !== 'modal' || !onSuccess) {
        setFormData({
          username: "",
          first_name: "",
          last_name: "",
          email: "",
          password: "",
          role: "user",
          photo: undefined,
        });
      }
    } catch (error: unknown) {
      console.error("Error creating user:", error);
      
      // Manejo mejorado de errores con soporte para validación del backend
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
      {/* Campo Nombre de Usuario */}
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

      {/* Campo Nombre */}
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

      {/* Campo Apellido */}
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

      {/* Campo Email */}
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

      {/* Campo Contraseña */}
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

      {/* Selector de Rol */}
      <FormSelect
        label="Rol"
        value={formData.role}
        onChange={handleRoleChange}
        placeholder="Seleccione el rol del usuario"
        options={[
          { value: "user", label: "Usuario" },
          { value: "admin", label: "Administrador" },
        ]}
        required
        name="role"
        error={errors.role}
      />

      {/* Subida de Foto */}
      <FileUpload
        label="Foto del Usuario (Opcional)"
        onFileSelect={handleFileSelect}
        required={false}
        error={errors.photo}
      />

      {/* Botones de Acción */}
      <div className={`flex ${mode === 'modal' ? 'justify-end gap-3' : 'flex-col-reverse sm:flex-row items-center justify-between gap-4'} pt-8`}>
        {/* Botón Cancelar */}
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

        {/* Botón Crear */}
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

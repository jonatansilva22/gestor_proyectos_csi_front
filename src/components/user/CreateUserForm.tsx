import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { notifySuccess, notifyError } from "../common/ToastNotify";
import { useTheme } from "../../context/ThemeContext";
import { FormSelect } from "../common/FormSelect";
import { FileUpload } from "../common/FileUpload";
import { FormInput } from "../common/FormInput";
import { CreateUserRequest, UserRole} from "../../types/user";
import { userService } from "../../services/users/userService";
import { validateUserForm } from "../../utils/validation";
import { useValidationErrors } from "../../hooks/useValidationErrors";
import { ROLE_MAPPING } from "../../const/index";

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
  confirmPassword: string;
  role: UserRole; // Mantener como string para la UI
  photo?: File;
}


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
    confirmPassword: "",
    role: "colaborador", // Rol por defecto: colaborador
    photo: undefined,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
    // Validar que las contraseñas coincidan
    if (formData.password !== formData.confirmPassword) {
      setBackendErrors({ confirmPassword: 'Las contraseñas no coinciden.' });
      notifyError('Las contraseñas no coinciden', {
        position: "top-center",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
      });
      return false;
    }

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

    // Bloquear creación de superusuarios desde la UI
    if (formData.role === 'superadmin') {
      setBackendErrors({ role: 'No está permitido crear usuarios con rol SuperAdmin desde esta pantalla.' });
      notifyError('No está permitido crear usuarios con rol SuperAdmin desde esta pantalla', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
      });
      return false;
    }

    if (!validationResult.isValid) {
      setBackendErrors(validationResult.errors);
      // Don't show generic toast here since specific validation functions already show toast notifications
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
      
      // Mostrar notificación de éxito más específica
      const userName = `${formData.first_name} ${formData.last_name}`.trim();
      
      // Verificar si se incluye información del email en la respuesta
      if (createdUser.email_info) {
        if (createdUser.email_info.enviado) {
          // Email enviado exitosamente
          notifySuccess(
            `¡Usuario ${userName ? userName : formData.username} creado exitosamente! Las credenciales fueron enviadas por email.`, 
            {
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
            }
          );
        } else {
          // Usuario creado pero email no enviado
          if (createdUser.email_info.error === 'configuracion_faltante') {
            notifyError(
              `Usuario ${userName ? userName : formData.username} creado exitosamente. ❌ Error: Configuración de correo no encontrada en .env`, 
              {
                position: "top-center",
                autoClose: 8000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
              }
            );
          } else {
            notifyError(
              `Usuario ${userName ? userName : formData.username} creado exitosamente. ❌ Error al enviar email: ${createdUser.email_info.mensaje}`, 
              {
                position: "top-center",
                autoClose: 8000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
              }
            );
          }
        }
      } else {
        // Respuesta sin información de email (caso anterior)
        notifySuccess(
          `¡Usuario ${userName ? userName : formData.username} creado exitosamente!`, 
          {
            position: "top-center",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
          }
        );
      }
      
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
          confirmPassword: "",
          role: "colaborador",
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
        placeholder="Ingrese un correo personal/institucional"
        required
        name="email"
        error={errors.email}
      />

      {/* Campo Contraseña */}
      <div className="relative">
        <FormInput
          label="Contraseña"
          type={showPassword ? "text" : "password"}
          value={formData.password}
          onChange={handleInputChange}
          placeholder="Ingrese una contraseña"
          required
          name="password"
          error={errors.password}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-[38px] text-gray-500 hover:text-gray-700 focus:outline-none cursor-pointer"
        >
          {showPassword ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464m1.414 1.414L21.75 21.75m-12.606-12.606L6.637 6.637m0 0a9.97 9.97 0 00-3.172 4.638c0 .887.157 1.739.449 2.527m2.723-7.165a9.97 9.97 0 00-2.723 7.165m9.896-3.172L19.07 8.464m-9.896 3.172a3 3 0 003.172 3.172M9.174 11.828a3 3 0 003.172-3.172" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          )}
        </button>
      </div>

      {/* Campo Confirmar Contraseña */}
      <div className="relative">
        <FormInput
          label="Confirmar Contraseña"
          type={showConfirmPassword ? "text" : "password"}
          value={formData.confirmPassword}
          onChange={handleInputChange}
          placeholder="Confirme la contraseña"
          required
          name="confirmPassword"
          error={errors.confirmPassword}
        />
        <button
          type="button"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          className="absolute right-3 top-[38px] text-gray-500 hover:text-gray-700 focus:outline-none cursor-pointer"
        >
          {showConfirmPassword ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464m1.414 1.414L21.75 21.75m-12.606-12.606L6.637 6.637m0 0a9.97 9.97 0 00-3.172 4.638c0 .887.157 1.739.449 2.527m2.723-7.165a9.97 9.97 0 00-2.723 7.165m9.896-3.172L19.07 8.464m-9.896 3.172a3 3 0 003.172 3.172M9.174 11.828a3 3 0 003.172-3.172" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          )}
        </button>
      </div>

      {/* Selector de Rol */}
      <FormSelect
        label="Rol"
        value={formData.role}
        onChange={handleRoleChange}
        placeholder="Seleccione el rol del usuario"
        options={[
          { value: "colaborador", label: "Colaborador" },
          { value: "admin", label: "Admin" },
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
              : `${darkMode ? "text-white hover:text-purple-200" : "text-gray-700 hover:text-gray-900"} hover:underline`
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
            rounded-lg border border-gray-800 bg-[#6F43D6] text-white 
            font-inter text-base font-normal leading-[100%] cursor-pointer 
            transition-all duration-200
            ${
              isLoading
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-[#5A359A] hover:shadow-lg transform hover:-translate-y-0.5"
            }
          `}
        >
          {isLoading && (
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
          {isLoading ? "Creando usuario..." : mode === 'modal' ? "Crear Usuario" : "Crear"}
        </button>
      </div>
    </form>
  );
};

export default CreateUserForm;

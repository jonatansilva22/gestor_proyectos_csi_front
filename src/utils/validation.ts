/**
 * Frontend validation utilities based on backend Django validation logic
 * Mirrors the validation rules from RamaAlanBack/users/Crear_Usuario/validations.py
 */

export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

/**
 * Username validation - mirrors Django validate_username function
 * Rules:
 * - 3-30 characters
 * - Only letters, numbers, hyphens, dots and underscores
 * - Pattern: ^[a-zA-Z0-9_.-]{3,30}$
 */
export const validateUsername = (username: string): ValidationResult => {
  if (!username.trim()) {
    return { isValid: false, message: 'El nombre de usuario es requerido' };
  }

  const usernameRegex = /^[a-zA-Z0-9_.-]{3,30}$/;
  if (!usernameRegex.test(username)) {
    return { 
      isValid: false, 
      message: 'El nombre de usuario debe tener entre 3 y 30 caracteres y solo puede contener letras, números, guiones, puntos y guiones bajos.' 
    };
  }

  return { isValid: true };
};

/**
 * Email validation - mirrors Django validate_email function
 * Rules:
 * - Valid email format
 * - Maximum 50 characters (backend constraint)
 */
export const validateEmail = (email: string): ValidationResult => {
  if (!email.trim()) {
    return { isValid: false, message: 'El correo electrónico es requerido' };
  }

  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, message: 'Por favor, ingrese un correo electrónico válido' };
  }

  // Length validation (backend constraint)
  if (email.length > 50) {
    return { isValid: false, message: 'El correo electrónico no debe exceder los 50 caracteres.' };
  }

  return { isValid: true };
};

/**
 * Password validation - mirrors Django validate_password function
 * Rules:
 * - Minimum 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 */
export const validatePassword = (password: string): ValidationResult => {
  if (!password.trim()) {
    return { isValid: false, message: 'La contraseña es requerida' };
  }

  if (password.length < 8) {
    return { isValid: false, message: 'La contraseña debe tener al menos 8 caracteres.' };
  }

  if (!/[A-Z]/.test(password)) {
    return { isValid: false, message: 'La contraseña debe contener al menos una letra mayúscula.' };
  }

  if (!/[a-z]/.test(password)) {
    return { isValid: false, message: 'La contraseña debe contener al menos una letra minúscula.' };
  }

  if (!/[0-9]/.test(password)) {
    return { isValid: false, message: 'La contraseña debe contener al menos un número.' };
  }

  if (!/[\W_]/.test(password)) {
    return { isValid: false, message: 'La contraseña debe contener al menos un carácter especial.' };
  }

  return { isValid: true };
};

/**
 * Name validation (first_name, last_name) - based on Django model constraints
 * Rules:
 * - Required field
 * - Maximum 50 characters (Django model max_length)
 * - Only letters and spaces allowed
 */
export const validateName = (name: string, fieldName: string = 'campo'): ValidationResult => {
  if (!name.trim()) {
    return { isValid: false, message: `El ${fieldName} es requerido` };
  }

  if (name.length > 50) {
    return { isValid: false, message: `El ${fieldName} no debe exceder los 50 caracteres` };
  }

  // Only letters, spaces, and common name characters
  const nameRegex = /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s'-]+$/;
  if (!nameRegex.test(name)) {
    return { 
      isValid: false, 
      message: `El ${fieldName} solo puede contener letras, espacios y caracteres especiales de nombres` 
    };
  }

  return { isValid: true };
};

/**
 * Role validation - mirrors Django UserSerializer.validate_role
 * Rules:
 * - Must be 'user' or 'admin'
 * - Supports legacy format (1, 2) for backward compatibility
 */
export const validateRole = (role: string | number): ValidationResult => {
  if (!role) {
    return { isValid: false, message: 'El rol es requerido' };
  }

  // Handle legacy format (ID numbers)
  if (typeof role === 'number' || (typeof role === 'string' && /^\d+$/.test(role))) {
    const roleId = typeof role === 'string' ? parseInt(role) : role;
    if (roleId === 1 || roleId === 2) {
      return { isValid: true };
    }
  }

  // Handle new string format
  const validRoles = ['user', 'admin'];
  if (typeof role === 'string' && validRoles.includes(role)) {
    return { isValid: true };
  }

  return { 
    isValid: false, 
    message: `Rol inválido. Debe ser uno de: ${validRoles.join(', ')}` 
  };
};

/**
 * File validation for profile photos
 * Rules:
 * - Optional field
 * - Must be image file (jpg, jpeg, png, gif, webp)
 * - Maximum file size (5MB)
 */
export const validateProfilePhoto = (file: File | null): ValidationResult => {
  // Photo is optional
  if (!file) {
    return { isValid: true };
  }

  // Check file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return { 
      isValid: false, 
      message: 'Solo se permiten archivos de imagen (JPG, PNG, GIF, WebP)' 
    };
  }

  // Check file size (5MB max)
  const maxSize = 5 * 1024 * 1024; // 5MB in bytes
  if (file.size > maxSize) {
    return { 
      isValid: false, 
      message: 'La imagen no debe exceder los 5MB' 
    };
  }

  return { isValid: true };
};

/**
 * Form validation for user creation
 * Validates all fields according to backend rules
 */
export interface UserFormData {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: string;
  photo?: File | null;
}

export interface UserFormErrors {
  [key: string]: string | undefined;
  username?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  password?: string;
  role?: string;
  photo?: string;
}

export const validateUserForm = (formData: UserFormData): { isValid: boolean; errors: UserFormErrors } => {
  const errors: UserFormErrors = {};

  // Username validation
  const usernameResult = validateUsername(formData.username);
  if (!usernameResult.isValid) {
    errors.username = usernameResult.message;
  }

  // First name validation
  const firstNameResult = validateName(formData.first_name, 'nombre');
  if (!firstNameResult.isValid) {
    errors.first_name = firstNameResult.message;
  }

  // Last name validation
  const lastNameResult = validateName(formData.last_name, 'apellido');
  if (!lastNameResult.isValid) {
    errors.last_name = lastNameResult.message;
  }

  // Email validation
  const emailResult = validateEmail(formData.email);
  if (!emailResult.isValid) {
    errors.email = emailResult.message;
  }

  // Password validation
  const passwordResult = validatePassword(formData.password);
  if (!passwordResult.isValid) {
    errors.password = passwordResult.message;
  }

  // Role validation
  const roleResult = validateRole(formData.role);
  if (!roleResult.isValid) {
    errors.role = roleResult.message;
  }

  // Photo validation (optional)
  const photoResult = validateProfilePhoto(formData.photo || null);
  if (!photoResult.isValid) {
    errors.photo = photoResult.message;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Login form validation - simpler validation for login
 * Based on LogIn service validation
 */
export interface LoginFormData {
  email: string;
  password: string;
}

export interface LoginFormErrors {
  [key: string]: string | undefined;
  email?: string;
  password?: string;
  general?: string;
}

export const validateLoginForm = (formData: LoginFormData): { isValid: boolean; errors: LoginFormErrors } => {
  const errors: LoginFormErrors = {};

  // Email validation (simplified for login)
  if (!formData.email.trim()) {
    errors.email = 'El correo electrónico es requerido';
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      errors.email = 'Por favor, ingrese un correo electrónico válido';
    } else if (formData.email.length > 50) {
      errors.email = 'El correo electrónico no debe exceder los 50 caracteres';
    }
  }

  // Password validation (simplified for login)
  if (!formData.password.trim()) {
    errors.password = 'La contraseña es requerida';
  } else if (formData.password.length < 8) {
    errors.password = 'La contraseña debe tener al menos 8 caracteres';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
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
 * - Cannot start or end with special characters
 * - Pattern: ^[a-zA-Z0-9_.-]{3,30}$
 */
export const validateUsername = (username: string): ValidationResult => {
  if (!username.trim()) {
    return { isValid: false, message: 'El nombre de usuario es requerido' };
  }

  // Basic length and character validation
  const usernameRegex = /^[a-zA-Z0-9_.-]{3,30}$/;
  if (!usernameRegex.test(username)) {
    return { 
      isValid: false, 
      message: 'El nombre de usuario debe tener entre 3 y 30 caracteres y solo puede contener letras, números, guiones, puntos y guiones bajos.' 
    };
  }

  // Cannot start or end with special characters (must start/end with alphanumeric)
  if (!/^[a-zA-Z0-9].*[a-zA-Z0-9]$/.test(username) && username.length > 1) {
    return {
      isValid: false,
      message: 'El nombre de usuario debe comenzar y terminar con una letra o número.'
    };
  }

  // Prevent consecutive special characters
  if (/[_.-]{2,}/.test(username)) {
    return {
      isValid: false,
      message: 'El nombre de usuario no puede contener caracteres especiales consecutivos.'
    };
  }

  // Common reserved usernames
  const reservedUsernames = ['admin', 'administrator', 'root', 'superuser', 'test', 'guest', 'null', 'undefined'];
  if (reservedUsernames.includes(username.toLowerCase())) {
    return {
      isValid: false,
      message: 'Este nombre de usuario está reservado. Por favor elige otro.'
    };
  }

  return { isValid: true };
};

/**
 * Email validation - mirrors Django validate_email function
 * Rules:
 * - Valid email format
 * - Maximum 50 characters (backend constraint)
 * - Institutional email domain validation (optional but recommended)
 */
export const validateEmail = (email: string): ValidationResult => {
  if (!email.trim()) {
    return { isValid: false, message: 'El correo electrónico es requerido' };
  }

  // Email format validation (more strict)
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, message: 'Por favor, ingrese un correo electrónico válido' };
  }

  // Length validation (backend constraint)
  if (email.length > 50) {
    return { isValid: false, message: 'El correo electrónico no debe exceder los 50 caracteres.' };
  }

  // Check for common email format issues
  if (email.includes('..') || email.startsWith('.') || email.endsWith('.')) {
    return { isValid: false, message: 'El formato del correo electrónico no es válido.' };
  }

  // Optional: institutional email validation
  const domain = email.split('@')[1];
  if (domain && domain.length < 2) {
    return { isValid: false, message: 'El dominio del correo electrónico no es válido.' };
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
 * - Must be 1: SuperAdmin, 2: Admin, 3: Colaborador
 * - Supports string format for backward compatibility
 */
export const validateRole = (role: string | number): ValidationResult => {
  if (!role) {
    return { isValid: false, message: 'El rol es requerido' };
  }

  // Handle numeric format (current backend)
  if (typeof role === 'number' || (typeof role === 'string' && /^\d+$/.test(role))) {
    const roleId = typeof role === 'string' ? parseInt(role) : role;
    if (roleId >= 1 && roleId <= 3) {
      return { isValid: true };
    }
  }

  // Handle current string format (frontend role selection)
  const currentRoles = ['colaborador', 'admin', 'superadmin'];
  if (typeof role === 'string' && currentRoles.includes(role)) {
    return { isValid: true };
  }

  // Handle legacy string format for backward compatibility
  const legacyRoles = ['user'];
  if (typeof role === 'string' && legacyRoles.includes(role)) {
    return { isValid: true };
  }

  return { 
    isValid: false, 
    message: 'Rol inválido. Debe ser: colaborador, admin o superadmin' 
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
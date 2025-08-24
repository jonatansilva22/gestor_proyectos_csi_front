// 🔐 SOLO tipos relacionados con AUTENTICACIÓN

export interface AuthUser {
  id: number;
  username: string;
  first_name?: string; // Nombre del usuario
  last_name?: string;  // Apellido del usuario
  email: string;
  role?: number; // 1: admin, 2: superadmin, 3: colaborador
  role_id?: number; // Backend sends role ID
  role_name?: string; // Backend sends role name
  photo?: string; // URL absoluta o relativa a la foto
}

export interface LoginCredentials {
  identifier: string; // Email o username
  password: string;
}

export interface LoginResponse {
  user: AuthUser;
  token: string;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

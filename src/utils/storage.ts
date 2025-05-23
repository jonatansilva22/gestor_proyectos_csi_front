// src/utils/storage.ts
const TOKEN_KEY = 'csi_pro_token';
const USER_KEY = 'csi_pro_user';

export const storage = {
  // Token
  getToken: (): string | null => 
    localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY),
    
  setToken: (token: string, remember: boolean): void => {
    if (remember) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      sessionStorage.setItem(TOKEN_KEY, token);
    }
  },
  
  removeToken: (): void => {
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
  },
  
  // User
  getUser: (): any | null => {
    const user = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  },
  
  setUser: (user: any, remember: boolean): void => {
    const userStr = JSON.stringify(user);
    if (remember) {
      localStorage.setItem(USER_KEY, userStr);
    } else {
      sessionStorage.setItem(USER_KEY, userStr);
    }
  },
  
  removeUser: (): void => {
    localStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(USER_KEY);
  },
  
  // Clear all
  clearAll: (): void => {
    storage.removeToken();
    storage.removeUser();
  }
};
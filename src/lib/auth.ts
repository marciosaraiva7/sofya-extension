/**
 * Authentication utilities for Sofya Extension
 */

export interface AuthUser {
  email: string;
  isAuthenticated: boolean;
  loginTime: number;
}

export interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
}

const AUTH_STORAGE_KEY = 'sofya_auth';

export const authStorage = {
  get: (): AuthUser | null => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (!stored) return null;
      
      const parsed = JSON.parse(stored) as AuthUser;
      
      // Check if auth is expired (24 hours)
      const isExpired = Date.now() - parsed.loginTime > 24 * 60 * 60 * 1000;
      if (isExpired) {
        localStorage.removeItem(AUTH_STORAGE_KEY);
        return null;
      }
      
      return parsed;
    } catch {
      return null;
    }
  },
  
  set: (user: AuthUser): void => {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  },
  
  clear: (): void => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }
};

export const authApi = {
  login: async (email: string, password: string): Promise<AuthUser> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Demo credentials for testing
    if (email === 'demo@sofya.com' && password === 'demo123') {
      const user: AuthUser = {
        email,
        isAuthenticated: true,
        loginTime: Date.now()
      };
      
      authStorage.set(user);
      return user;
    }
    
    throw new Error('Email ou senha incorretos');
  },
  
  logout: async (): Promise<void> => {
    authStorage.clear();
  },
  
  getCurrentUser: (): AuthUser | null => {
    return authStorage.get();
  }
};
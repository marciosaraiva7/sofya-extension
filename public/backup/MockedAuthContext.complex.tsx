/**
 * Mocked Authentication context for Sofya Extension
 * Provides authentication functionality without backend dependencies
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

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

interface MockedAuthContextType extends AuthState {
  login: (email: string, password?: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => void;
}

const MockedAuthContext = createContext<MockedAuthContextType | undefined>(
  undefined
);

interface MockedAuthProviderProps {
  children: ReactNode;
}

const AUTH_STORAGE_KEY = "sofya_mocked_auth";

// Mock storage utilities
const mockAuthStorage = {
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
  },
};

export const MockedAuthProvider: React.FC<MockedAuthProviderProps> = ({
  children,
}) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    error: null,
  });

  const checkAuth = () => {
    const user = mockAuthStorage.get();
    setState((prev) => ({
      ...prev,
      user,
      isLoading: false,
    }));
  };

  const login = async (email: string): Promise<void> => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
      // Basic email validation
      if (!email || !email.includes("@") || !email.includes(".")) {
        throw new Error("Por favor, insira um email válido");
      }

      // Create mock user - accept any valid email
      const user: AuthUser = {
        email,
        isAuthenticated: true,
        loginTime: Date.now(),
      };

      // Store in localStorage
      mockAuthStorage.set(user);

      setState((prev) => ({
        ...prev,
        user,
        isLoading: false,
        error: null,
      }));

      // Notify content scripts about auth change
      notifyContentScripts(true);
    } catch (error) {
      setState((prev) => ({
        ...prev,
        user: null,
        isLoading: false,
        error: error instanceof Error ? error.message : "Erro desconhecido",
      }));
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    setState((prev) => ({ ...prev, isLoading: true }));

    // Simulate logout delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    try {
      mockAuthStorage.clear();
      setState({
        user: null,
        isLoading: false,
        error: null,
      });

      // Notify content scripts about auth change
      notifyContentScripts(false);
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "Erro ao fazer logout",
      }));
    }
  };

  const notifyContentScripts = (isAuthenticated: boolean) => {
    // Send message to all tabs with content scripts
    if (typeof chrome !== 'undefined' && chrome.tabs) {
      chrome.tabs.query({}, (tabs) => {
        tabs.forEach((tab) => {
          if (tab.id) {
            chrome.tabs.sendMessage(tab.id, {
              type: 'SOFYA_AUTH_STATUS',
              isAuthenticated
            }).catch(() => {
              // Ignore errors for tabs without content scripts
            });
          }
        });
      });
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const value: MockedAuthContextType = {
    ...state,
    login,
    logout,
    checkAuth,
  };

  return (
    <MockedAuthContext.Provider value={value}>
      {children}
    </MockedAuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useMockedAuth = (): MockedAuthContextType => {
  const context = useContext(MockedAuthContext);
  if (context === undefined) {
    throw new Error("useMockedAuth must be used within a MockedAuthProvider");
  }
  return context;
};

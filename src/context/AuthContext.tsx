/* eslint-disable react-refresh/only-export-components */
import api from "@/config/api";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

type CredentialsType = {
  username: string;
  password: string;
};

type User = {
  id: string;
  username: string;
  googleId: string | null;
  email: string;
  role: "admin" | "staff" | "customer" | "veterinary";
  verified: boolean;
  createdAt: string;
};

type AuthContextType = {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: CredentialsType) => void;
  logout: () => void;
  user: User | null;
};

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: false,
  login: async () => {},
  logout: async () => {},
  user: null,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const checkAuthStatus = async () => {
      setIsLoading(true);
      try {
        const response = await api.get<{ isAuthenticated: boolean }>(
          "/api/auth/status",
        );

        if (response?.data.isAuthenticated) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async ({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) => {
    try {
      const response = await api.post<User>("/api/auth/", {
        username,
        password,
      });

      if (response.status === 200) {
        setUser(response.data);
        setIsAuthenticated(true);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error?.response?.data.message);
    }
  };
  const logout = async () => {
    await api.post("/api/auth/logout");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, isLoading, login, logout, user }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

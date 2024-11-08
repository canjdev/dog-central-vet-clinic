/* eslint-disable react-refresh/only-export-components */
import LoadingScreen from "@/components/LoadingScreen";
import api from "@/config/api";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

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
  login: (user?: User) => void;
  logout: () => void;
  user: User | undefined;
};

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: false,
  login: async () => {},
  logout: async () => {},
  user: undefined,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | undefined>(undefined);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await api.get<{ isAuthenticated: boolean }>(
          "/api/auth/status/",
        );

        setIsAuthenticated(response?.data?.isAuthenticated);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = (user?: User) => {
    setUser(user);
    setIsAuthenticated(true);
  };
  const logout = async () => {
    await api.post("/api/auth/logout");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, isLoading, login, logout, user }}
    >
      {isLoading ? <LoadingScreen /> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

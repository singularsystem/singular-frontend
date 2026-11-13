"use client";
export const dynamic = "force-dynamic";
import { AuthUser } from "@/types/usuario";
import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  user: AuthUser | null;
  isLoading: boolean;
  login: (token: string, expirationIso: string, userData: AuthUser) => void;
  logout: () => void;
  fetchUser: (token: string) => Promise<boolean>;
  setupAutoLogout: (expirationTs: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname() ?? "";
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const logoutTimerRef = useRef<NodeJS.Timeout | null>(null);

  const logout = useCallback(async () => {
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
      logoutTimerRef.current = null;
    }

    try {
      if (token) {
        const response = await fetch(`${apiUrl}/api/v1/users/logout`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) console.warn("API logout falhou");
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("authToken");
      localStorage.removeItem("tokenExpiration");
      setToken(null);
      setUser(null);
      const isPublicRoute =
        pathname === "/" ||
        pathname.startsWith("/login") ||
        pathname.startsWith("/cadastro") ||
        pathname.startsWith("/recuperar-senha") ||
        pathname.startsWith("/validar");
      if (isMounted && !isPublicRoute) {
        router.push("/login");
      }
    }
  }, [apiUrl, token, isMounted, pathname, router]);

  const fetchUser = useCallback(
    async (currentAuthToken: string) => {
      try {
        const response = await fetch(`${apiUrl}/api/v1/users/me`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${currentAuthToken}`,
          },
        });

        if (response.status === 401) {
          localStorage.removeItem("authToken");
          localStorage.removeItem("tokenExpiration");
          setToken(null);
          setUser(null);
          return false;
        }

        if (!response.ok) throw new Error("Failed to fetch user data");

        const result = await response.json();
        setUser({
          id: result.data.id,
          email: result.data.email,
          fullName: result.data.fullName,
          dateOfBirth: result.data.formattedDateOfBirth,
          city: result.data.city,
          state: result.data.state,
          sex: result.data.sex,
          age: result.data.age,
          address: result.data.address,
          userName: result.data.userName,
          schoolName: result.data.schoolName,
          schoolID: result.data.schoolID,
          roles: result.data.roles,
          lastLogin: result.data.lastLogin,
          status: result.data.status,
          mustChangePassword: result.data.mustChangePassword,
          localLastLogin: result.data.localLastLogin,
          formattedDateOfBirth: result.data.formattedDateOfBirth,
          planType: result.data.planType,
          planStatus: result.data.planStatus,
          quotaDocuments: result.data.quotaDocuments,
          quotaUsed: result.data.quotaUsed,
        });
        return true;
      } catch (error) {
        console.error("Error fetching user:", error);
        logout();
        return false;
      }
    },
    [apiUrl, logout],
  );

  const setupAutoLogout = useCallback(
    (expirationTs: number) => {
      if (logoutTimerRef.current) {
        clearTimeout(logoutTimerRef.current);
        logoutTimerRef.current = null;
      }

      const buffer = 30000;
      const timeUntilExpiry = expirationTs - Date.now() - buffer;

      if (timeUntilExpiry > 0) {
        logoutTimerRef.current = setTimeout(() => {
          logout();
        }, timeUntilExpiry);
      } else {
        logout();
      }
    },
    [logout],
  );

  useEffect(() => {
    setIsMounted(true);
    const storedToken = localStorage.getItem("authToken");
    const storedExp = localStorage.getItem("tokenExpiration");

    const initializeAuth = async () => {
      if (storedToken && storedExp) {
        const expTs = Number(storedExp);
        if (expTs > Date.now()) {
          const success = await fetchUser(storedToken);
          if (success) {
            setToken(storedToken);
            setupAutoLogout(expTs);
          }
        } else {
          logout();
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
    return () => {
      setIsMounted(false);
      if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
    };
  }, [fetchUser, logout, setupAutoLogout]);

  const login = (
    newToken: string,
    expirationIso: string,
    userData: AuthUser,
  ) => {
    const expTs = new Date(expirationIso).getTime();
    localStorage.setItem("authToken", newToken);
    localStorage.setItem("tokenExpiration", String(expTs));
    setToken(newToken);
    setUser(userData);
    setupAutoLogout(expTs);
    fetchUser(newToken);
  };

  const isAuthenticated = Boolean(token);

  const contextValue = useMemo(
    () => ({
      token,
      isAuthenticated,
      isLoading,
      user,
      login,
      logout,
      fetchUser,
      setupAutoLogout,
    }),
    [
      token,
      isAuthenticated,
      isLoading,
      user,
      login,
      logout,
      fetchUser,
      setupAutoLogout,
    ],
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

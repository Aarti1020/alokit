"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { authApi } from "@/lib/api";
import { User } from "@/types";
import toast from "react-hot-toast";

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { fullName: string; email: string; password: string; phone?: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() =>
    typeof window === "undefined" ? null : localStorage.getItem("alokit_token")
  );
  const [loading, setLoading] = useState(() =>
    typeof window !== "undefined" && Boolean(localStorage.getItem("alokit_token"))
  );

  useEffect(() => {
    if (token) {
      authApi.me()
        .then((res) => setUser(res.data))
        .catch(() => {
          localStorage.removeItem("alokit_token");
          setToken(null);
        })
        .finally(() => setLoading(false));
    }
  }, [token]);

  const login = async (email: string, password: string) => {
    const res = await authApi.login({ email, password });
    localStorage.setItem("alokit_token", res.data.token);
    setToken(res.data.token);
    setUser(res.data.user);
    toast.success("Signed in successfully");
  };

  const register = async (data: { fullName: string; email: string; password: string; phone?: string }) => {
    const res = await authApi.register(data);
    localStorage.setItem("alokit_token", res.data.token);
    setToken(res.data.token);
    setUser(res.data.user);
    toast.success("Account created successfully");
  };

  const logout = () => {
    localStorage.removeItem("alokit_token");
    setToken(null);
    setUser(null);
    toast.success("Signed out successfully");
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

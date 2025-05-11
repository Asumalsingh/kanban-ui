"use client"
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";


interface User {
  id: string;
  name: string;
  email: string;
  board: {
    id: string;
    name: string;
  }
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const router = useRouter();
  const authToken = typeof window !== "undefined" ? window.localStorage.getItem("token") : null;

  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(authToken);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Set up axios defaults
  axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    // Set auth token for all requests
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await axios.get("/auth/me");
        setUser(data.user);
        setLoading(false);
      } catch (err) {
        localStorage.removeItem("token");
        setError("Authentication failed. Please log in again.");
        setLoading(false);
      }
    };

    loadUser();
  }, [token]);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      const res = await axios.post("/auth/login", { email, password });

      localStorage.setItem("token", res.data.token);

      setToken(res.data.token);
      router.replace("/")
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      const res = await axios.post("/auth/signup", { name, email, password });

      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
      router.replace("/");
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    router.replace("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

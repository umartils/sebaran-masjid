"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AuthContextType {
  isLoggedIn: boolean;
  username: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Demo credentials - in production, this would be server-side
const DEMO_CREDENTIALS = [
  { username: "relawan", password: "masjid123" },
  { username: "admin", password: "admin123" },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("masjidcare_user");
    if (stored) {
      setIsLoggedIn(true);
      setUsername(stored);
    }
  }, []);

  const login = async (user: string, pass: string): Promise<boolean> => {
    const found = DEMO_CREDENTIALS.find(
      (c) => c.username === user && c.password === pass
    );
    if (found) {
      sessionStorage.setItem("masjidcare_user", user);
      setIsLoggedIn(true);
      setUsername(user);
      return true;
    }
    return false;
  };

  const logout = () => {
    sessionStorage.removeItem("masjidcare_user");
    setIsLoggedIn(false);
    setUsername(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
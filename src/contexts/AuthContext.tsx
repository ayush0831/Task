import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

interface User {
  name: string;
  email: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  sessionTimeLeft: number;
  login: (email: string, password: string) => string | null;
  register: (name: string, email: string, password: string) => string | null;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
}

const SESSION_DURATION = 5 * 60 * 1000; // 5 minutes
const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [sessionTimeLeft, setSessionTimeLeft] = useState(SESSION_DURATION);

  // Restore session on mount
  useEffect(() => {
    const session = localStorage.getItem("session");
    if (session) {
      const { email, expiresAt } = JSON.parse(session);
      const remaining = expiresAt - Date.now();
      if (remaining > 0) {
        const users: User[] = JSON.parse(localStorage.getItem("users") || "[]");
        const found = users.find((u) => u.email === email);
        if (found) {
          setUser(found);
          setSessionTimeLeft(remaining);
        }
      } else {
        localStorage.removeItem("session");
      }
    }
  }, []);

  // Session countdown
  useEffect(() => {
    if (!user) return;
    const interval = setInterval(() => {
      setSessionTimeLeft((prev) => {
        if (prev <= 1000) {
          clearInterval(interval);
          logout();
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [user]);

  const register = (name: string, email: string, password: string): string | null => {
    const users: User[] = JSON.parse(localStorage.getItem("users") || "[]");
    if (users.find((u) => u.email === email)) return "Email already registered";
    const newUser = { name, email, password };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    return null;
  };

  const login = (email: string, password: string): string | null => {
    const users: User[] = JSON.parse(localStorage.getItem("users") || "[]");
    const found = users.find((u) => u.email === email && u.password === password);
    if (!found) return "Invalid email or password";
    setUser(found);
    setSessionTimeLeft(SESSION_DURATION);
    localStorage.setItem("session", JSON.stringify({ email, expiresAt: Date.now() + SESSION_DURATION }));
    return null;
  };

  const logout = useCallback(() => {
    setUser(null);
    setSessionTimeLeft(SESSION_DURATION);
    localStorage.removeItem("session");
  }, []);

  const updateProfile = (data: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated);
    const users: User[] = JSON.parse(localStorage.getItem("users") || "[]");
    const idx = users.findIndex((u) => u.email === user.email);
    if (idx !== -1) {
      users[idx] = updated;
      localStorage.setItem("users", JSON.stringify(users));
      localStorage.setItem("session", JSON.stringify({ email: updated.email, expiresAt: Date.now() + sessionTimeLeft }));
    }
  };

  return (
    <AuthContext.Provider value={{ user, sessionTimeLeft, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

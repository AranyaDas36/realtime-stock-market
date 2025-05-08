"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

type User = {
  username: string;
};

type AuthContextType = {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  signup: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<Record<string, string>>({});

  // Load user from localStorage (browser only)
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  // Load users database from localStorage (browser only)
  useEffect(() => {
    const savedUsers = localStorage.getItem("users");
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    }
  }, []);

  // Save users to localStorage whenever it changes
  useEffect(() => {
    if (Object.keys(users).length > 0) {
      localStorage.setItem("users", JSON.stringify(users));
    }
  }, [users]);

  const login = async (username: string, password: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500)); // simulate delay

    if (users[username] && users[username] === password) {
      const newUser = { username };
      setUser(newUser);
      localStorage.setItem("user", JSON.stringify(newUser));
      return true;
    }
    return false;
  };

  const signup = async (username: string, password: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500)); // simulate delay

    if (users[username]) {
      return false; // user already exists
    }

    // Add the new user to users list
    setUsers((prev) => {
      const updatedUsers = { ...prev, [username]: password };
      return updatedUsers;
    });

    // Auto login after signup
    const newUser = { username };
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));

    // Ensure the users list is saved to localStorage after signup
    localStorage.setItem("users", JSON.stringify(users));

    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{ user, login, signup, logout, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

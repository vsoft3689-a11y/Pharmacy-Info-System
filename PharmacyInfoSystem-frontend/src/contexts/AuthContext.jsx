import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", user.token);
    } else {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
  }, [user]);

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    const data = res.data;
    const userObj = {
      token: data.token,
      role: data.role,
      name: data.name,
      userId: data.userId,
    };
    setUser(userObj);
    return userObj;
  };

  const register = async (name, email, password, role) => {
    const res = await api.post("/auth/register", {
      name,
      email,
      password,
      role,
    });
    const data = res.data;
    const userObj = {
      token: data.token,
      role: data.role,
      name: data.name,
      userId: data.userId,
    };
    // setUser(userObj);
    return userObj;
  };

  const logout = () => {
    setUser(null);
    localStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
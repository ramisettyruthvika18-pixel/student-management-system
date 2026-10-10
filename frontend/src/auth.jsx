import { createContext, useContext, useState } from "react";
import api from "./api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("sms_user"));
    } catch {
      return null;
    }
  });

  const save = (data) => {
    const u = { username: data.username, role: data.role };
    localStorage.setItem("sms_token", data.token);
    localStorage.setItem("sms_user", JSON.stringify(u));
    setUser(u);
  };

  const login = async (username, password) => {
    const { data } = await api.post("/auth/login", { username, password });
    save(data);
  };

  const register = async (username, email, password) => {
    const { data } = await api.post("/auth/register", { username, email, password });
    save(data);
  };

  const logout = () => {
    localStorage.removeItem("sms_token");
    localStorage.removeItem("sms_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin: user?.role === "ADMIN", login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

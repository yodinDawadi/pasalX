import { createContext, useContext, useEffect, useState } from "react";
import React from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("pasalx_user")) || null; }
    catch { return null; }
  });

  useEffect(() => {
    if (user) localStorage.setItem("pasalx_user", JSON.stringify(user));
    else localStorage.removeItem("pasalx_user");
  }, [user]);

  async function login(email, password) {
    const { data } = await api.post("/user/login", { email, password });
    const [account, token] = Array.isArray(data) ? data : [data?.user, data?.token];
    if (token) localStorage.setItem("pasalx_token", token);
    setUser(account);
    return account;
  }

  async function signup(payload) {
    const { data } = await api.post("/user/signup", payload);
    return data;
  }

  async function logout() {
    try { await api.post("/user/logout"); } finally {
      localStorage.removeItem("pasalx_token");
      setUser(null);
    }
  }

  return <AuthContext.Provider value={{ user, login, signup, logout }}>
    {children}
  </AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
import { apiClient } from "@/src/services/api";
import { User } from "@/src/types";
import * as SecureStore from "expo-secure-store";
import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isSignedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar autenticação ao iniciar
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      setIsLoading(true);
      console.log("🔍 Verificando autenticação...");

      let userStr = null;
      let token = null;

      try {
        userStr = await SecureStore.getItemAsync("user");
        token = await SecureStore.getItemAsync("authToken");
      } catch (storeError) {
        console.warn(
          "⚠️ SecureStore indisponível (esperado em alguns emuladores):",
          storeError
        );
        // Continuar mesmo se SecureStore falhar
        setUser(null);
        setIsLoading(false);
        return;
      }

      if (userStr && token) {
        try {
          const userData = JSON.parse(userStr);
          console.log("✅ Usuário autenticado:", userData.email);
          setUser(userData);
        } catch (e) {
          console.error("❌ Erro ao parsear user:", e);
          setUser(null);
        }
      } else {
        console.log("ℹ️ Nenhum usuário autenticado");
        setUser(null);
      }
    } catch (error) {
      console.error("❌ Erro ao verificar autenticação:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      console.log("🔐 Fazendo login...");
      const response = await apiClient.login(email, password);
      console.log("✅ Login bem-sucedido!");
      setUser(response.user);
    } catch (error) {
      console.error("❌ Erro ao fazer login:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await apiClient.logout();
      setUser(null);
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isSignedIn: !!user,
    login,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro do AuthProvider");
  }
  return context;
};

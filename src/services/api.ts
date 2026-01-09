import axios, { AxiosError, AxiosInstance } from "axios";
import * as SecureStore from "expo-secure-store";
import { API_BASE_URL } from "../config/env";

const API_URL = API_BASE_URL;

class ApiClient {
  private instance: AxiosInstance;
  private tokenRefreshPromise: Promise<string> | null = null;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  constructor() {
    this.instance = axios.create({
      baseURL: API_URL,
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.instance.interceptors.request.use(
      async (config) => {
        try {
          const token = await SecureStore.getItemAsync("authToken");
          if (token) {
            this.accessToken = token;
            config.headers.Authorization = `Bearer ${token}`;
          } else if (this.accessToken) {
            config.headers.Authorization = `Bearer ${this.accessToken}`;
          }
        } catch (error) {
          console.warn(
            "⚠️ Erro ao recuperar token do SecureStore, usando token em memória"
          );
          if (this.accessToken) {
            config.headers.Authorization = `Bearer ${this.accessToken}`;
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.instance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as any;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            let refreshToken = this.refreshToken;

            if (!refreshToken) {
              try {
                refreshToken = await SecureStore.getItemAsync("refreshToken");
              } catch (e) {
                console.warn(
                  "⚠️ Erro ao recuperar refresh token do SecureStore"
                );
              }
            }

            if (refreshToken) {
              if (!this.tokenRefreshPromise) {
                this.tokenRefreshPromise =
                  this.refreshAccessToken(refreshToken);
              }
              const newToken = await this.tokenRefreshPromise;
              this.tokenRefreshPromise = null;

              this.accessToken = newToken;
              try {
                await SecureStore.setItemAsync("authToken", newToken);
              } catch (e) {
                console.warn("⚠️ Erro ao salvar novo token no SecureStore");
              }

              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return this.instance(originalRequest);
            }
          } catch (refreshError) {
            console.error("Erro ao renovar token:", refreshError);
            await this.clearTokens();
            throw refreshError;
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private async refreshAccessToken(refreshToken: string): Promise<string> {
    const response = await this.instance.post("/auth/refresh", {
      refreshToken,
    });
    return response.data.accessToken;
  }

  async login(email: string, password: string) {
    const response = await this.instance.post("/auth/login", {
      email,
      password,
    });
    const { access_token, refresh_token, user } = response.data;

    if (access_token) {
      this.accessToken = access_token;
    }
    if (refresh_token) {
      this.refreshToken = refresh_token;
    }

    try {
      if (access_token) {
        await SecureStore.setItemAsync("authToken", access_token);
      }
      if (refresh_token) {
        await SecureStore.setItemAsync("refreshToken", refresh_token);
      }
      if (user) {
        const userString =
          typeof user === "string" ? user : JSON.stringify(user);
        await SecureStore.setItemAsync("user", userString);
      }
    } catch (error) {
      console.warn(
        "⚠️ Erro ao salvar tokens no SecureStore (esperado em alguns emuladores):",
        error
      );
    }

    return { access_token, refresh_token, user };
  }

  async logout() {
    this.accessToken = null;
    this.refreshToken = null;
    await this.clearTokens();
  }

  private async clearTokens() {
    try {
      await SecureStore.deleteItemAsync("authToken");
      await SecureStore.deleteItemAsync("refreshToken");
      await SecureStore.deleteItemAsync("user");
    } catch (error) {
      console.warn("⚠️ Erro ao limpar tokens do SecureStore:", error);
    }
  }

  getAxiosInstance() {
    return this.instance;
  }
}

export const apiClient = new ApiClient();

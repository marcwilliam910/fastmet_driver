import { useAppStore } from "@/store/useAppStore";
import axios, { InternalAxiosRequestConfig } from "axios";

export const apiUrl = `${process.env.EXPO_PUBLIC_BASE_URL}/api/driver`;

const api = axios.create({
  baseURL: apiUrl,
  headers: { "Content-Type": "application/json" },
});

// Attach token to every request
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = useAppStore.getState().token;

    if (token) {
      config.headers.set("Authorization", `Bearer ${token}`);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;

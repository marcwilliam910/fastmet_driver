import { useAppStore } from "@/store/useAppStore";
import axios, { InternalAxiosRequestConfig } from "axios";

// const apiUrl = "http://192.168.100.12:3000/api";
export const apiUrl = "http://192.168.100.125:3000/api/driver";
// when i rebuild the app, change the apiUrl to the following line
// const apiUrl = Constants.expoConfig?.extra?.apiUrl ?? "http://192.168.100.125:3000/api";

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

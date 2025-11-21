import axios from "axios";

export const API_BASE_URL =
  (import.meta as any).env?.VITE_API_BASE_URL || "http://localhost:5194/api";
export const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/i, "");

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

// Morao sam da napravim malu izmenu u ovom fajlu jer mi je trebao
// "orign" iz backend-a za slike jer
// VITE_API_BASE_URL pokazuje na /api
// Ovo ne bi trebalo nista da remeti dosadasnje funckionisanje axios.ts

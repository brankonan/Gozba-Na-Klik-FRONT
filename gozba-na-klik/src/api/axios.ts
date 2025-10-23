import axios from "axios";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/i, "");

const api = axios.create({ baseURL: API_BASE_URL });

api.interceptors.request.use((cfg) => {
  try {
    const saved = localStorage.getItem("auth");
    if (saved) {
      const { token } = JSON.parse(saved);
      if (token) cfg.headers.Authorization = `Bearer ${token}`;
    }
  } catch {}
  return cfg;
});

export default api;

export function setAuthToken(token?: string) {
  if (token) localStorage.setItem("auth", JSON.stringify({ token }));
  else localStorage.removeItem("auth");
}

// Morao sam da napravim malu izmenu u ovom fajlu jer mi je trebao
// "orign" iz backend-a za slike jer
// VITE_API_BASE_URL pokazuje na /api

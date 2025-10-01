import axios from "axios";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/i, "");

const api = axios.create({
  baseURL: API_BASE_URL,
});

export default api;

// Morao sam da napravim malu izmenu u ovom fajlu jer mi je trebao
// "orign" iz backend-a za slike jer
// VITE_API_BASE_URL pokazuje na /api

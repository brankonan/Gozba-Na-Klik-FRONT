import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:7256/api",
});

export default api;

// import axios from "axios";

// const api = axios.create({
//   baseURL: "/api",
//   headers: { "Content-Type": "application/json" },
// });

// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("auth_token");
//   if (token) {
//     config.headers = config.headers ?? {};
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export default api;

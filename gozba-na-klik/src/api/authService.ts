import { NavigateFunction } from "react-router-dom";
import api from "./axios";
import axios from "axios";

export const loginAsync = async (email: string, password: string) => {
  const { data } = await api.post("/auth/login", { email, password }); // { token, user }
  // podeseni Authorization za sve naredne pozive
  api.defaults.headers.common.Authorization = `Bearer ${data.token}`;
  return data;
};

export const logoutAsync = async () => {
  const { data } = await api.post("/auth/logout");
  return data;
};

export const handleLogin = async (navigate: NavigateFunction, data: any) => {
  try {
    const { email, password } = data;

    const auth = await loginAsync(email, password); // { token, user }
    const u = auth.user;

    // cuva oba: radi kompatibilnosti
    localStorage.setItem("auth", JSON.stringify(auth));
    localStorage.setItem("user", JSON.stringify(u));

    switch (u.role) {
      case "Admin":
        navigate("/admin/users");
        break;
      case "Courier":
        navigate("/courier/schedule");
        break;
      case "Employee":
        navigate(`/employee/${u.id}`);
        break;
      case "RestaurantOwner":
        navigate("/owner/restaurants");
        break;
      case "Customer":
        navigate(`/customer/profile/${u.id}`);
        break;
      default:
        navigate("/");
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      alert(
        error.response.status === 401
          ? "Username or password is incorrect"
          : "Unexpected error occurred"
      );
    }
  }
};

export const handleLogout = async (navigate: NavigateFunction) => {
  try {
    await logoutAsync();
  } catch (error) {
    alert("Doslo je do neocekivane greske!");
    console.error(error);
  } finally {
    localStorage.removeItem("auth");
    localStorage.removeItem("user");
    delete api.defaults.headers.common.Authorization;
    navigate("/login");
  }
};

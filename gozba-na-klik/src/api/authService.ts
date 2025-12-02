import { NavigateFunction } from "react-router-dom";
import api from "./axios";
import axios from "axios";
import { toast } from "react-toastify";

export type Role =
  | "Admin"
  | "Customer"
  | "RestaurantOwner"
  | "Employee"
  | "Courier";

export interface UserDto {
  id: number;
  firstName: string;
  lastName: string;
  username?: string | null;
  email: string;
  role: Role | string;
  profilePicture?: string | null;
}

export interface AuthResponseDto {
  token: string;
  user: UserDto;
}

export interface ResetRequestDto {
  email: string;
}

export interface ResetConfirmDto {
  token: string;
  newPassword: string;
}

export const loginAsync = async (
  email: string,
  password: string
): Promise<AuthResponseDto> => {
  const response = await api.post<AuthResponseDto>("/auth/login", {
    email,
    password,
  });

  return response.data;
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

export const activateAccountAsync = async (token: string) => {
  const response = await api.get("/auth/activate", {
    params: { token },
  });

  return response.data as { message?: string };
};

export const requestPasswordResetAsync = async (email: string) => {
  const payload: ResetRequestDto = { email };
  const response = await api.post("/auth/reset/request", payload);
  return response.data as { message?: string };
};

export const resetPasswordAsync = async (
  token: string,
  newPassword: string
) => {
  const payload: ResetConfirmDto = { token, newPassword };
  const response = await api.post("/auth/reset/confirm", payload);
  return response.data as { message?: string };
};

export const handleLogin = async (navigate: NavigateFunction, data: any) => {
  try {
    const { email, password } = data;

    const auth = await loginAsync(email, password); // { token, user }
    const u = auth.user;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    toast.success("Uspešna prijava!");
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
        navigate(`/employee/orders`);
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
      if (error.response.status === 401) {
        toast.error("Email ili lozinka nisu ispravni");
      } else {
        toast.error("Neočekivana greška pri prijavi");
      }
    } else {
      toast.error("Neočekivana greška pri prijavi");
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
    toast.info("Uspešno odjavljivanje");
  } catch {
    // ignorisi
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

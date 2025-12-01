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
};

export const logoutAsync = async () => {
  await api.post("/auth/logout");
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

    const { token, user } = await loginAsync(email, password);

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    toast.success("Uspešna prijava!");

    switch (user.role) {
      case "Admin":
        navigate("/admin/users");
        break;
      case "RestaurantOwner":
        navigate("/owner/restaurants");
        break;
      case "Courier":
        navigate(`/courier/${user.id}`);
        break;
      case "Employee":
        navigate(`/employee/${user.id}`);
        break;
      case "Customer":
      default:
        navigate(`/customer/profile/${user.id}`);
        break;
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
    }
  }
};

export const handleLogout = async (navigate: NavigateFunction) => {
  try {
    await logoutAsync();
    toast.info("Uspešno odjavljivanje");
  } catch {
    // ignorisi
  } finally {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }
};

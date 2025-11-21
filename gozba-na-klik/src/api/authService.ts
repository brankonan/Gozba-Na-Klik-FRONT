import { NavigateFunction } from "react-router-dom";
import api from "./axios";
import axios from "axios";

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

export const handleLogin = async (navigate: NavigateFunction, data: any) => {
  try {
    const { email, password } = data;

    const { token, user } = await loginAsync(email, password);

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

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
        alert("Username ili lozinka nisu ispravni");
      } else {
        alert("Neocekivana greska pri logovanju");
      }
    } else {
      alert("Neocekivana greska pri logovanju");
    }
  }
};

export const handleLogout = async (navigate: NavigateFunction) => {
  try {
    await logoutAsync();
  } catch {
    // ignorisi
  } finally {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }
};

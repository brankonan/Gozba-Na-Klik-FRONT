import api from "./axios";

const RESOURCE = "/adminusers";

interface CreateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: "Courier" | "RestaurantOwner";
}

export async function getAllUsers() {
    const response = await api.get(RESOURCE);
    return response.data;
}

export async function createUser(data: CreateUserDto) {
  const response = await api.post(RESOURCE, data);
  return response.data;
}

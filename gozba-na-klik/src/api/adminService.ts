import api from "./axios";

const userRESOURCE = "/admin/users";
const restaurantRESOURCE = "admin/restaurants";

interface CreateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: "Courier" | "RestaurantOwner";
}

export async function getAllUsers() {
    const response = await api.get(userRESOURCE);
    return response.data;
}

export async function createUser(data: CreateUserDto) {
  const response = await api.post(userRESOURCE, data);
  return response.data;
}

export async function getAllRestaurants() {
    const response = await api.get(restaurantRESOURCE);
    return response.data;
}

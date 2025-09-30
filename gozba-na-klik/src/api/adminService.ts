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

interface RestaurantForm {
  name: string;
  ownerId: number;
  photo?: string;
}

//USERS
export async function getAllUsers() {
    const response = await api.get(userRESOURCE);
    return response.data;
}

export async function createUser(data: CreateUserDto) {
  const response = await api.post(userRESOURCE, data);
  return response.data;
}


//RESTAURANTS
export async function getAllRestaurants() {
  const response = await api.get(restaurantRESOURCE);
  return response.data;
}

export async function deleteRestaurant(id: number) {
  const response = await api.delete(`/admin/restaurants/${id}`);
  return response.data;
}

export async function updateRestaurant(id: number, data: any) {
  const response = await api.put(`/admin/restaurants/${id}`, data);
  return response.data;
}


import api from "./axios";

export async function getMyRestaurant(ownerId: number) {
  const res = await api.get(`/owner/restaurants?ownerId=${ownerId}`);
  return res.data;
}

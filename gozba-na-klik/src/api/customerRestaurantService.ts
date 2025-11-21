import api from "./axios";

export async function getAll() {
    const result = await api.get(`/customer/restaurants`);
    return result.data;
}
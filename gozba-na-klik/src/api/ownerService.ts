import api from "./axios";

export async function getMyRestaurants(ownerId: number) {
  const res = await api.get(`/owner/restaurants`, { params: { ownerId } });
  return res.data;
}
export async function updateRestaurantGeneral(
  id: number,
  data: any,
  ownerId: number
) {
  const res = await api.put(`/restaurants/${id}/general`, data, {
    params: { ownerId },
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
}
export async function uploadRestaurantCover(
  id: number,
  file: File,
  ownerId: number
) {
  const form = new FormData();
  form.append("file", file);

  const res = await api.post(`/restaurants/${id}/cover`, form, {
    params: { ownerId },
  });

  return res.data as { coverUrl: string };
}

// Schedule
export async function getSchedule(id: number, ownerId: number) {
  const res = await api.get(`/restaurants/${id}/schedule`, {
    params: { ownerId },
  });
  return res.data;
}

export async function putSchedule(id: number, payload: any[], ownerId: number) {
  const res = await api.put(`/restaurants/${id}/schedule`, payload, {
    params: { ownerId },
    headers: { "Content-Type": "application/json" },
    transformRequest: [(data) => JSON.stringify(data)],
  });
  return res.data;
}

// Exceptions
export async function getExceptions(id: number, ownerId: number) {
  const res = await api.get(`/restaurants/${id}/exceptions`, {
    params: { ownerId },
  });
  return res.data;
}
export async function addException(
  id: number,
  ex: { date: string; reason?: string },
  ownerId: number
) {
  const res = await api.post(`/restaurants/${id}/exceptions`, ex, {
    params: { ownerId },
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
}

export async function deleteException(
  id: number,
  exId: number,
  ownerId: number
) {
  const res = await api.delete(`/restaurants/${id}/exceptions/${exId}`, {
    params: { ownerId },
  });
  return res.data;
}

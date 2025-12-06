import api from "./axios";

// === GET MINE RESTAURANTS ===
export async function getAll(ownerId: number) {
  const res = await api.get(`/owner/restaurants`, {
    params: { ownerId },
  });
  return res.data;
}

// === MENU CRUD ===
export async function updateMenuItem(restaurantId: number, menuItem: any) {
  const res = await api.put(
    `/owner/restaurants/${restaurantId}/menu/${menuItem.id}`,
    menuItem
  );
  return res.data;
}

export async function deleteMenuItem(restaurantId: number, menuItemId: number) {
  await api.delete(`/owner/restaurants/${restaurantId}/menu/${menuItemId}`);
}

// === GENERAL TAB ===
export async function updateRestaurantGeneral(
  id: number,
  data: any,
  ownerId: number
) {
  const res = await api.put(`/restaurants/${id}/general`, data, {
    params: { ownerId },
  });
  return res.data;
}

// === COVER TAB ===
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
  return res.data;
}

// === SCHEDULE TAB ===
export async function getSchedule(id: number, ownerId: number) {
  const res = await api.get(`/restaurants/${id}/schedule`, {
    params: { ownerId },
  });
  return res.data;
}

export async function putSchedule(id: number, payload: any[], ownerId: number) {
  const res = await api.put(`/restaurants/${id}/schedule`, payload, {
    params: { ownerId },
  });
  return res.data;
}

// === EXCEPTIONS TAB ===
export async function getExceptions(id: number, ownerId: number) {
  const res = await api.get(`/restaurants/${id}/exceptions`, {
    params: { ownerId },
  });
  return res.data;
}

export async function addException(id: number, ex: any, ownerId: number) {
  const res = await api.post(`/restaurants/${id}/exceptions`, ex, {
    params: { ownerId },
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

// === PENDING ORDERS (OWNER) ===
export async function getPendingOrders(ownerId: number) {
  const res = await api.get(`/orders/pending/owner/${ownerId}`);
  return res.data;
}

// === ACCEPT / REJECT ===
export async function acceptOrder(orderId: number) {
  await api.post(`/orders/${orderId}/accept`);
}

export async function rejectOrder(orderId: number, reason?: string) {
  await api.post(`/orders/${orderId}/reject`, reason ? { reason } : {});
}

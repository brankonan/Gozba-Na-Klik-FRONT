import api from "./axios";

export type DaySlot = { dayOfWeek: number; start: string; end: string };
export type WeeklySchedule = {
  courierUserId: number;
  days: DaySlot[];
  weeklyHours: number;
};
export type WeeklyScheduleUpsert = { days: DaySlot[] };
// Dodao sam dva nova statusa i malo uredio kod AZ
export type CourierStatus = {
  status: "Active" | "Inactive" | "Suspended";
  checkedAtLocal: string;
  timeZone?: string;
  isBusy: boolean;
  currentOrderId?: number | null;
};

export async function ensureCourier(userId: number) {
  await api.post(`/couriers/${userId}/ensure`);
}
export async function getSchedule(userId: number) {
  const res = await api.get<WeeklySchedule>(`/couriers/${userId}/schedule`);
  return res.data;
}

export async function upsertSchedule(
  userId: number,
  payload: WeeklyScheduleUpsert
) {
  await api.put(`/couriers/${userId}/schedule`, payload);
}

export async function getCourierStatus(userId: number) {
  const res = await api.get<CourierStatus>(`/couriers/${userId}/status`);
  return res.data;
}

export async function suspendCourier(userId: number) {
  await api.post(`/couriers/${userId}/suspend`);
}

export async function unsuspendCourier(userId: number) {
  await api.delete(`/couriers/${userId}/suspend`);
}

// Novo - porudzbine AZ
export async function pickupOrder(orderId: number, userId: number) {
  await api.post(`/orders/${orderId}/pickup`, null, { params: { userId } });
}

export async function deliveredOrder(orderId: number, userId: number) {
  await api.post(`/orders/${orderId}/delivered`, null, { params: { userId } });
}

// Ovo ce se verovatno ispravljati kada se uradi deo Order deo AZ
export type OrderSummary = {
  id: number;
  status:
    | "NA_CEKANJU"
    | "OTKAZANA"
    | "PRIHVACENA"
    | "PREUZIMANJE_U_TOKU"
    | "DOSTAVA_U_TOKU"
    | "ZAVRSENA";
  restorantName?: string;
  readyBy?: string;
  deliveryAddress?: {
    street?: string;
    city: string;
    entrance?: string;
    notes?: string;
  };
  pickedUpAt?: string;
  deliveredAt?: string;
  total?: number;
};
export async function getOrder(orderId: number) {
  const res = await api.get<OrderSummary>(`/order/${orderId}`);
  return res.data;
}

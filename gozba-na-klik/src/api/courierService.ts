import api from "./axios";

export type DaySlot = { dayOfWeek: number; start: string; end: string };
export type WeeklySchedule = {
  courierUserId: number;
  days: DaySlot[];
  weeklyHours: number;
};
export type WeeklyScheduleUpsert = { days: DaySlot[] };
export type CourierStatus =
  | { status: "Active"; checkedAtLocal: string; timeZone?: string }
  | { status: "Inactive"; checkedAtLocal: string; timeZone?: string }
  | { status: "Suspended"; checkedAtLocal: string; timeZone?: string };

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

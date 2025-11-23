import api from "./axios";

export type OrderStatus =
  | "NA_CEKANJU"
  | "OTKAZANA"
  | "PRIHVACENA"
  | "PREUZIMANJE_U_TOKU"
  | "DOSTAVA_U_TOKU"
  | "ZAVRSENA";

export interface OrderItemDto {
  id: number;
  menuItemId: number;
  price: number;
}

export interface OrderDto {
  id: number;
  restaurantId: number;
  customerId: number;
  addressId: number;
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  items: OrderItemDto[];
}

// Ovo odgovara CreateOrderDto sa backend-a AZ
export interface CreateOrderPayload {
  restaurantId: number;
  customerId: number;
  addressId: number;
  items: { menuItemId: number; price: number }[];
}

// Kreiranje porudzbine AZ
export async function createOrder(payload: CreateOrderPayload) {
  const response = await api.post<OrderDto>("/orders", payload);
  return response.data; // OrderDto
}

// Dobavljanje jedne porudzbine po ID-ju AZ
export async function getOrder(orderId: number) {
  const res = await api.get<OrderDto>(`/orders/${orderId}`);
  return res.data;
}

// Dobavljanje svih porudzbina na cekanju AZ
export async function getPendingOrders() {
  const res = await api.get<OrderDto[]>("/orders/pending");
  return res.data;
}

export async function acceptOrder(orderId: number) {
  await api.post(`/orders/${orderId}/accept`);
}

export async function rejectOrder(orderId: number, reason?: string) {
  await api.post(`/orders/${orderId}/reject`, reason ? { reason } : {});
}

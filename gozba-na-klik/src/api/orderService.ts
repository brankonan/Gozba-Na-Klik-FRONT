import api from "./axios";

export interface OrderItem {
  menuItemId: number;
  price: number;
}

export interface Order {
  restaurantId: number;
  customerId: number;
  addressId: number;
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  items: OrderItem[];
}

 enum OrderStatus {
  NaCekanju = "NaCekanju",
  Prihvacena = "Prihvacena",
  PreuzimanjeUToku = "PreuzimanjeUToku",
  DostavaUToku = "DostavaUToku",
  Zavrseno = "Zavrseno",
  Otkazana = "Otkazana"
}

export async function createOrder(orderData: Order) {
  try {
    const response = await api.post("/customer/orders", orderData);
    return response.data;
  } catch (error) {
    console.error("Greška pri kreiranju porudžbine:", error);
    throw error;
  }
}

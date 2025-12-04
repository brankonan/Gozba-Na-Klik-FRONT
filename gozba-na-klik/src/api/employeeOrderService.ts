import api from "./axios";

export interface EmployeeOrderDto {
  id: number;
  restaurantId: number;
  restaurantName: string;
  customerId: number;
  customerName: string;
  addressId: number;
  addressText: string;
  total: number;
  status: string;
  createdAt: string;
}

export async function getEmployeePendingOrders(
  employeeId: number
): Promise<EmployeeOrderDto[]> {
  const res = await api.get(`/employees/${employeeId}/orders/pending`);
  return res.data;
}

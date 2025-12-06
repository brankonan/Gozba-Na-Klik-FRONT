import api from "./axios";

// GET all employees in restaurant
export async function getEmployees(restaurantId: number) {
  const res = await api.get(`/restaurants/${restaurantId}/employees`);
  return res.data;
}

// CREATE employee
export async function createEmployee(restaurantId: number, dto: any) {
  const res = await api.post(`/restaurants/${restaurantId}/employees`, dto);
  return res.data;
}

// UPDATE employee
export async function updateEmployee(
  restaurantId: number,
  employeeId: number,
  dto: any
) {
  const res = await api.put(
    `/restaurants/${restaurantId}/employees/${employeeId}`,
    dto
  );
  return res.data;
}

// TOGGLE status
export async function toggleEmployeeStatus(
  restaurantId: number,
  employeeId: number
) {
  const res = await api.patch(
    `/restaurants/${restaurantId}/employees/${employeeId}/toggle-status`
  );
  return res.data;
}

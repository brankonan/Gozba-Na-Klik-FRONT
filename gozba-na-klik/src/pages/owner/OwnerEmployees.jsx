import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

import {
  getEmployees,
  createEmployee,
  toggleEmployeeStatus,
} from "../../api/employeeService";
import { getAll } from "../../api/ownerRestaurantService";

export default function OwnerEmployees() {
  const [restaurant, setRestaurant] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

  const [user] = useState(() => {
    try {
      const raw = localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  async function load(ownerId) {
    if (!ownerId) return;

    try {
      setLoading(true);

      const restaurants = await getAll(ownerId);

      if (!restaurants || restaurants.length === 0) {
        setRestaurant(null);
        setEmployees([]);
        return;
      }

      const r = restaurants[0];

      const emps = await getEmployees(r.id);

      setRestaurant(r);
      setEmployees(emps);
    } catch (err) {
      console.error(err);
      toast.error("Greska pri ucitavanju zaposlenih");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!user?.id) return;
    load(user.id);
  }, [user]);

  async function handleCreate() {
    if (!restaurant || !user?.id) return;

    const firstName = prompt("Ime:");
    if (!firstName) return;

    const lastName = prompt("Prezime:");
    if (!lastName) return;

    const email = prompt("Email:");
    if (!email) return;

    const password = prompt("Sifra:");
    if (!password) return;

    const position = prompt("Pozicija (npr. Konobar, Kuhar, Barmen):");
    if (!position) return;

    const dto = { firstName, lastName, email, password, position };

    try {
      await createEmployee(restaurant.id, dto);
      toast.success("Zaposleni kreiran");
      await load(user.id);
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data || "Greska pri kreiranju zaposlenog");
    }
  }

  async function handleToggle(id) {
    if (!restaurant || !user?.id) return;

    try {
      await toggleEmployeeStatus(restaurant.id, id);
      toast.success("Status promenjen");
      await load(user.id);
    } catch (err) {
      console.error(err);
      toast.error("Greska pri promeni statusa");
    }
  }

  // 6) Guard
  if (!user || user.role !== "RestaurantOwner") {
    return (
      <main className="section">
        <div className="container" style={{ maxWidth: 640 }}>
          <div className="card card-pad">
            Morate biti prijavljeni kao vlasnik restorana da biste videli
            zaposlene.
          </div>
        </div>
      </main>
    );
  }

  // 7) UI
  return (
    <main className="section">
      <div className="container" style={{ maxWidth: 960 }}>
        <div className="card card-pad stack" style={{ gap: 16 }}>
          <div className="row" style={{ justifyContent: "space-between" }}>
            <h2 style={{ margin: 0 }}>
              Zaposleni – {restaurant?.name || "..."}
            </h2>

            <button className="btn btn-primary" onClick={handleCreate}>
              + Dodaj zaposlenog
            </button>
          </div>

          {loading ? (
            <div style={{ opacity: 0.7 }}>Ucitavanje...</div>
          ) : employees.length === 0 ? (
            <div style={{ opacity: 0.7 }}>Jos nema zaposlenih.</div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Ime</th>
                  <th>Email</th>
                  <th>Pozicija</th>
                  <th>Status</th>
                  <th style={{ textAlign: "right" }}>Akcije</th>
                </tr>
              </thead>

              <tbody>
                {employees.map((emp) => (
                  <tr key={emp.id}>
                    <td>
                      {emp.firstName} {emp.lastName}
                    </td>
                    <td>{emp.email}</td>
                    <td>{emp.position}</td>
                    <td>
                      <span
                        className={`badge ${
                          emp.status === "AKTIVAN" ? "green" : "red"
                        }`}
                      >
                        {emp.status}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <button
                        className="btn btn-secondary"
                        onClick={() => handleToggle(emp.id)}
                      >
                        Toggle status
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </main>
  );
}

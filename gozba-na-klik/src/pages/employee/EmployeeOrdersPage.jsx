import React, { useEffect, useState } from "react";
import { acceptOrder, rejectOrder } from "../../api/orderService";
import { getEmployeePendingOrders } from "../../api/employeeOrderService";

export default function EmployeeOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionId, setActionId] = useState(null);
  const [error, setError] = useState(null);

  const raw = localStorage.getItem("user");
  const user = raw ? JSON.parse(raw) : null;

  async function loadOrders() {
    if (!user) {
      setError("Niste prijavljeni.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await getEmployeePendingOrders(user.id);
      setOrders(data);
    } catch (e) {
      console.error(e);
      setError("Greska pri ucitavanju porudzbina.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    console.log("EmployeeOrdersPage MOUNTED");
    loadOrders();
  }, []);

  async function handleAccept(id) {
    if (!window.confirm(`Prihvatiti porudzbinu #${id}?`)) return;
    setActionId(id);
    try {
      await acceptOrder(id);
      await loadOrders();
    } catch (e) {
      console.error(e);
      alert("Greska pri prihvatanju porudzbine.");
    } finally {
      setActionId(null);
    }
  }

  async function handleReject(id) {
    const reason = window.prompt("Razlog odbijanja (opciono):") || undefined;
    setActionId(id);
    try {
      await rejectOrder(id, reason);
      await loadOrders();
    } catch (e) {
      console.error(e);
      alert("Greska pri odbijanju porudzbine.");
    } finally {
      setActionId(null);
    }
  }

  const isBusy = (id) => loading || actionId === id;

  if (!user) {
    return (
      <main className="section">
        <div className="container" style={{ maxWidth: 960 }}>
          <div className="card card-pad">
            Morate biti prijavljeni kao zaposleni da biste videli porudzbine.
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="section">
      <div className="container" style={{ maxWidth: 960 }}>
        <div className="card card-pad stack" style={{ gap: 16 }}>
          <div className="row" style={{ justifyContent: "space-between" }}>
            <h2 style={{ margin: 0 }}>Porudžbine na čekanju</h2>
            {loading && (
              <span style={{ fontSize: 14, opacity: 0.8 }}>Učitavanje...</span>
            )}
          </div>

          {error && <div style={{ color: "red", fontSize: 14 }}>{error}</div>}

          {orders.length === 0 && !loading ? (
            <div style={{ opacity: 0.8 }}>
              Trenutno nema porudžbina u statusu <b>NA_CEKANJU</b> za vaš
              restoran.
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Restoran</th>
                    <th>Kupac</th>
                    <th>Adresa</th>
                    <th>Ukupno</th>
                    <th>Status</th>
                    <th style={{ textAlign: "right" }}>Akcije</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id}>
                      <td>#{o.id}</td>
                      <td>{o.restaurantName ?? o.restaurantId}</td>
                      <td>{o.customerName ?? o.customerId}</td>
                      <td>{o.addressText ?? o.addressId}</td>
                      <td>
                        {o.total != null
                          ? `${Number(o.total).toFixed(2)} RSD`
                          : "—"}
                      </td>
                      <td>{String(o.status).replaceAll("_", " ")}</td>
                      <td style={{ textAlign: "right" }}>
                        <button
                          className="btn btn-primary"
                          style={{ marginRight: 8 }}
                          onClick={() => handleAccept(o.id)}
                          disabled={isBusy(o.id)}
                        >
                          {actionId === o.id ? "Slanje..." : "Prihvati"}
                        </button>
                        <button
                          className="btn btn-delete"
                          onClick={() => handleReject(o.id)}
                          disabled={isBusy(o.id)}
                        >
                          {actionId === o.id ? "Slanje..." : "Odbij"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="row" style={{ justifyContent: "flex-end" }}>
            <button className="btn" onClick={loadOrders} disabled={loading}>
              Osveži listu
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

import React, { useEffect, useState } from "react";
import {
  getPendingOrders,
  acceptOrder,
  rejectOrder,
} from "../../api/orderService";

export default function EmployeeOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionId, setActionId] = useState(null);
  const [error, setError] = useState(null);

  async function loadOrders() {
    setLoading(true);
    setError(null);
    try {
      const data = await getPendingOrders();
      setOrders(data);
    } catch (e) {
      console.error(e);
      setError("Greska pri ucitavanju porudzbina.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
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

  return (
    <main className="section">
      <div className="container" style={{ maxWidth: 960 }}>
        <div className="card card-pad stack" style={{ gap: 16 }}>
          <div className="row" style={{ justifyContent: "space-between" }}>
            <h2 style={{ margin: 0 }}>Porudzbine na cekanju</h2>
            {loading && (
              <span style={{ fontSize: 14, opacity: 0.8 }}>Ucitavanje...</span>
            )}
          </div>

          {error && <div style={{ color: "red", fontSize: 14 }}>{error}</div>}

          {orders.length === 0 && !loading ? (
            <div style={{ opacity: 0.8 }}>
              Trenutno nema porudzbina u statusu <b>NA_CEKANJU</b>.
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
                      <td>{o.restaurantId}</td>
                      <td>{o.customerId}</td>
                      <td>{o.addressId}</td>
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
                          className="btn btn-danger"
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
              Osvezi listu
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

import React, { useEffect, useMemo, useState } from "react";
import { getAll } from "../../../api/ownerRestaurantService";
import {
  getPendingOrders,
  acceptOrder,
  rejectOrder,
} from "../../../api/orderService";
import "../../../styles/Owner.scss";

function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
}

function orderStatusLabel(status) {
  switch (status) {
    case "NA_CEKANJU":
      return "Na čekanju";
    case "PRIHVACENA":
      return "Prihvaćena";
    case "OTKAZANA":
      return "Otkazana";
    case "PREUZIMANJE_U_TOKU":
      return "Preuzimanje u toku";
    case "DOSTAVA_U_TOKU":
      return "Dostava u toku";
    case "ZAVRSENA":
      return "Završena";
    default:
      return String(status || "—").replaceAll("_", " ");
  }
}

function formatDateTime(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleString("sr-RS");
}

export default function OwnerAllOrdersPage() {
  const user = getCurrentUser();

  const [restaurants, setRestaurants] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState("ALL");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [actionId, setActionId] = useState(null);

  if (!user) {
    return (
      <main className="section">Morate biti prijavljeni kao vlasnik.</main>
    );
  }

  if (user.role !== "RestaurantOwner") {
    return (
      <main className="section">
        Ova stranica je dostupna samo vlasnicima restorana.
      </main>
    );
  }

  const restaurantName = (restaurantId) => {
    const r = restaurants.find((r) => r.id === restaurantId);
    return r?.name ?? `Restoran #${restaurantId}`;
  };

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      const restData = await getAll(user.id);

      const pendingData = await getPendingOrders();

      const myRestaurantIds = new Set(restData.map((r) => r.id));
      const myPendingOrders = pendingData.filter((o) =>
        myRestaurantIds.has(o.restaurantId)
      );

      setRestaurants(restData);
      setOrders(myPendingOrders);
    } catch (e) {
      console.error(e);
      setError("Greška pri učitavanju porudžbina.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const filteredOrders = useMemo(() => {
    if (selectedRestaurantId === "ALL") return orders;
    const idNum = Number(selectedRestaurantId);
    return orders.filter((o) => o.restaurantId === idNum);
  }, [orders, selectedRestaurantId]);

  const isBusy = (id) => loading || actionId === id;

  async function handleAccept(id) {
    if (!window.confirm(`Prihvatiti porudžbinu #${id}?`)) return;
    setActionId(id);
    try {
      await acceptOrder(id);
      await loadData();
    } catch (e) {
      console.error(e);
      alert("Greška pri prihvatanju porudžbine.");
    } finally {
      setActionId(null);
    }
  }

  async function handleReject(id) {
    const reason = window.prompt("Razlog odbijanja (opciono):") || undefined;
    setActionId(id);
    try {
      await rejectOrder(id, reason);
      await loadData();
    } catch (e) {
      console.error(e);
      alert("Greška pri odbijanju porudžbine.");
    } finally {
      setActionId(null);
    }
  }

  return (
    <main className="section">
      <div className="container" style={{ maxWidth: 1100 }}>
        <div className="card card-pad stack" style={{ gap: 16 }}>
          <div
            className="row"
            style={{ justifyContent: "space-between", alignItems: "center" }}
          >
            <h2 style={{ margin: 0 }}>Porudžbine mojih restorana</h2>

            <div className="row" style={{ gap: 8, alignItems: "center" }}>
              <label style={{ fontSize: 14 }}>
                Restoran:
                <select
                  className="input"
                  style={{ marginLeft: 8 }}
                  value={selectedRestaurantId}
                  onChange={(e) => setSelectedRestaurantId(e.target.value)}
                >
                  <option value="ALL">Svi restorani</option>
                  {restaurants.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </label>

              {loading && (
                <span style={{ fontSize: 14, opacity: 0.8 }}>
                  Učitavanje...
                </span>
              )}
            </div>
          </div>

          {error && <div style={{ color: "red", fontSize: 14 }}>{error}</div>}

          {filteredOrders.length === 0 && !loading ? (
            <div style={{ opacity: 0.8 }}>
              Trenutno nema pending porudžbina za izabrani restoran.
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
                    <th>Kreirana</th>
                    <th style={{ textAlign: "right" }}>Akcije</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((o) => (
                    <tr key={o.id}>
                      <td>#{o.id}</td>
                      <td>{restaurantName(o.restaurantId)}</td>
                      <td>{o.customerId}</td>
                      <td>{o.addressId}</td>
                      <td>
                        {o.total != null
                          ? `${Number(o.total).toFixed(2)} RSD`
                          : "—"}
                      </td>
                      <td>{orderStatusLabel(o.status)}</td>
                      <td>{formatDateTime(o.createdAt)}</td>
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
            <button className="btn" onClick={loadData} disabled={loading}>
              Osveži listu
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

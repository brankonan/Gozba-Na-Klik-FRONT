import React, { useEffect, useState } from "react";
import {
  getCourierStatus,
  pickupOrder,
  deliveredOrder,
} from "../../api/courierService";
import { getOrder } from "../../api/orderService";

function getUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
}

export default function CourierCurrentJob({ userId, onChanged }) {
  const [status, setStatus] = useState(null);
  const [order, setOrder] = useState(null);
  const [busy, setBusy] = useState(false);

  async function refresh() {
    if (!userId) return;

    const st = await getCourierStatus(userId);
    setStatus(st);

    if (st && st.currentOrderId) {
      try {
        const o = await getOrder(st.currentOrderId);
        setOrder(o);
      } catch {
        // fallback ako /orders/{id} pukne iz nekog razloga AZ
        setOrder({ id: st.currentOrderId });
      }
    } else {
      setOrder(null);
    }
  }

  useEffect(() => {
    refresh();
    const t = setInterval(refresh, 15000); // osvezavanje na 15 sekundi AZ
    return () => clearInterval(t);
  }, [userId]);

  if (!userId) return null;

  const badgeStyle = {
    padding: "2px 8px",
    borderRadius: 12,
    color: "#fff",
    background:
      status?.status === "Active"
        ? "#22c55e"
        : status?.status === "Suspended"
        ? "#ef4444"
        : "#6b7280",
  };

  const canPickup =
    !!order &&
    (order.status === "PRIHVACENA" || order.status === "PREUZIMANJE_U_TOKU") &&
    !status?.isBusy;

  const canDeliver =
    !!order && order.status === "DOSTAVA_U_TOKU" && !!status?.isBusy;

  async function handlePickup() {
    if (!order?.id) return;
    setBusy(true);
    try {
      await pickupOrder(order.id, userId);
      await refresh();
      onChanged && onChanged();
      alert("Potvrdjeno: porudzbina preuzeta (DOSTAVA U TOKU).");
    } catch (e) {
      console.error(e);
      alert("Greska pri potvrdi preuzimanja.");
    } finally {
      setBusy(false);
    }
  }

  async function handleDelivery() {
    if (!order?.id) return;
    setBusy(true);
    try {
      await deliveredOrder(order.id, userId);
      await refresh();
      onChanged && onChanged();
      alert("Potvrdjeno: porudzbina dostavljena (ZAVRSENA).");
    } catch (e) {
      console.error(e);
      alert("Greska pri potvrdi dostave.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card card-pad stack" style={{ gap: 12, marginBottom: 16 }}>
      <div
        className="row"
        style={{ justifyContent: "space-between", alignItems: "center" }}
      >
        <h3 style={{ margin: 0 }}>Trenutni zadatak</h3>
        <span style={badgeStyle}>
          {status?.status ?? "—"}
          {status?.isBusy ? " · U dostavi" : ""}
        </span>
      </div>

      {!order ? (
        <div style={{ opacity: 0.8 }}>Nema dodeljenih porudzbina trenutno.</div>
      ) : (
        <>
          <div className="stack" style={{ gap: 6 }}>
            <div>
              <b>Porudzbina:</b> #{order.id}
            </div>
            {order.restaurantName && (
              <div>
                <b>Restoran:</b> {order.restaurantName}
              </div>
            )}

            {order.deliveryAddress && (
              <div style={{ opacity: 0.9 }}>
                <b>Adresa:</b> {order.deliveryAddress.street},{" "}
                {order.deliveryAddress.city}
                {order.deliveryAddress.entrance
                  ? `, ulaz ${order.deliveryAddress.entrance}`
                  : ""}
                {order.deliveryAddress.notes
                  ? ` (${order.deliveryAddress.notes})`
                  : ""}
              </div>
            )}

            {order.total != null && (
              <div>
                <b>Ukupno:</b> {Number(order.total).toFixed(2)} RSD
              </div>
            )}

            {order.status && (
              <div>
                <b>Status:</b> {String(order.status).replaceAll("_", " ")}
              </div>
            )}
          </div>

          <div className="row" style={{ gap: 8 }}>
            {canPickup && (
              <button
                className="btn btn-primary"
                onClick={handlePickup}
                disabled={busy}
              >
                {busy ? "Slanje..." : "Preuzeo porudzbinu"}
              </button>
            )}

            {canDeliver && (
              <button className="btn" onClick={handleDelivery} disabled={busy}>
                {busy ? "Slanje..." : "Dostavljeno"}
              </button>
            )}
          </div>
        </>
      )}

      <div className="row" style={{ justifyContent: "flex-end" }}>
        <button className="btn" onClick={refresh} disabled={busy}>
          Osvezi
        </button>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import {
  getCourierStatus,
  pickupOrder,
  deliveredOrder,
} from "../../api/courierService";
import { getOrder } from "../../api/orderService";

// Mapiranje statusa kurira na srpski AZ
function courierStatusLabel(status) {
  switch (status) {
    case "Active":
      return "Aktivan";
    case "Inactive":
      return "Neaktivan";
    case "Suspended":
      return "Suspendovan";
    default:
      return status || "—";
  }
}

// Mapiranje statusa porudžbine na lep srpski AZ
function orderStatusLabel(status) {
  switch (status) {
    case "NA_CEKANJU":
      return "Na čekanju";
    case "OTKAZANA":
      return "Otkazana";
    case "PRIHVACENA":
      return "Prihvaćena";
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

export default function CourierCurrentJob({ userId, onChanged }) {
  const [status, setStatus] = useState(null); // { status, isBusy, currentOrderId } AZ
  const [order, setOrder] = useState(null);
  const [busy, setBusy] = useState(false);

  async function refresh() {
    if (!userId) return;

    const st = await getCourierStatus(userId);

    const normalized = st
      ? {
          ...st,
          isBusy: st.isBusy ?? !!st.currentOrderId, // fallback ako backend ne vrati isBusy AZ
        }
      : null;

    setStatus(normalized);

    if (normalized && normalized.currentOrderId) {
      try {
        const o = await getOrder(normalized.currentOrderId);
        setOrder(o);
      } catch {
        setOrder({ id: normalized.currentOrderId });
      }
    } else {
      setOrder(null);
    }
  }

  useEffect(() => {
    refresh();
    const t = setInterval(refresh, 15000);
    return () => clearInterval(t);
  }, [userId]);

  if (!userId) return null;

  const isBusy = !!status?.isBusy;

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

  // Kurir može da potvrdi preuzimanje kad: AZ
  // - ima porudžbinu
  // - status porudžbine je PRIHVACENA ili PREUZIMANJE_U_TOKU
  // (ne uslovljavamo više sa !isBusy, jer backend već rešava da nema više porudžbina)
  const canPickup =
    !!order &&
    (order.status === "PRIHVACENA" || order.status === "PREUZIMANJE_U_TOKU");

  // Kurir može da potvrdi dostavu kad: AZ
  // - ima porudžbinu
  // - status porudžbine je DOSTAVA_U_TOKU
  const canDeliver = !!order && order.status === "DOSTAVA_U_TOKU";

  async function handlePickup() {
    if (!order?.id) return;
    setBusy(true);
    try {
      await pickupOrder(order.id, userId);
      await refresh();
      onChanged && onChanged();
      alert("Potvrđeno: porudžbina preuzeta (DOSTAVA U TOKU).");
    } catch (e) {
      console.error(e);
      alert("Greška pri potvrdi preuzimanja.");
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
      alert("Potvrđeno: porudžbina dostavljena (ZAVRŠENA).");
    } catch (e) {
      console.error(e);
      alert("Greška pri potvrdi dostave.");
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
          {courierStatusLabel(status?.status)}
          {isBusy ? " · U dostavi" : ""}
        </span>
      </div>

      {!order ? (
        <div style={{ opacity: 0.8 }}>Nema dodeljenih porudžbina trenutno.</div>
      ) : (
        <>
          <div className="stack" style={{ gap: 6 }}>
            <div>
              <b>Porudžbina:</b> #{order.id}
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
                <b>Status porudžbine:</b> {orderStatusLabel(order.status)}
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
                {busy ? "Slanje..." : "Preuzeo porudžbinu"}
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
          Osveži
        </button>
      </div>
    </div>
  );
}

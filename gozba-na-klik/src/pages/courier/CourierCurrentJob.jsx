import React, { useEffect, useState } from "react";
import {
  getCourierStatus,
  pickupOrder,
  deliveredOrder,
} from "../../api/courierService";
import { getOrder } from "../../api/orderService";
import "../../styles/Courier.scss"; // dodaj ovo negde (ovde ili u CourierSchedule)

// Mapiranje statusa kurira na srpski
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

// Mapiranje statusa porudžbine na lep srpski
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
  const [status, setStatus] = useState(null); // { status, isBusy, currentOrderId }
  const [order, setOrder] = useState(null);
  const [busy, setBusy] = useState(false);

  async function refresh() {
    if (!userId) return;

    const st = await getCourierStatus(userId);

    const normalized = st
      ? {
          ...st,
          isBusy: st.isBusy ?? !!st.currentOrderId,
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

  // klase za bedž umesto inline style
  const badgeClass = [
    "courier-badge",
    status?.status === "Active"
      ? "courier-badge--active"
      : status?.status === "Suspended"
      ? "courier-badge--suspended"
      : "courier-badge--inactive",
  ].join(" ");

  const canPickup =
    !!order &&
    (order.status === "PRIHVACENA" || order.status === "PREUZIMANJE_U_TOKU");

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
    <section className="card card-pad courier-card courier-current-job">
      <div className="courier-card__header">
        <h3 className="courier-card__title">Trenutni zadatak</h3>
        <span className={badgeClass}>
          {courierStatusLabel(status?.status)}
          {isBusy ? " · U dostavi" : ""}
        </span>
      </div>

      {!order ? (
        <div className="courier-card__empty">
          Nema dodeljenih porudžbina trenutno.
        </div>
      ) : (
        <>
          <div className="courier-current-job__details">
            <div className="courier-detail">
              <span className="courier-detail__label">Porudžbina</span>
              <span className="courier-detail__value">#{order.id}</span>
            </div>

            {order.restaurantName && (
              <div className="courier-detail">
                <span className="courier-detail__label">Restoran</span>
                <span className="courier-detail__value">
                  {order.restaurantName}
                </span>
              </div>
            )}

            {order.deliveryAddress && (
              <div className="courier-detail courier-detail--address">
                <span className="courier-detail__label">Adresa</span>
                <span className="courier-detail__value">
                  {order.deliveryAddress.street}, {order.deliveryAddress.city}
                  {order.deliveryAddress.entrance
                    ? `, ulaz ${order.deliveryAddress.entrance}`
                    : ""}
                  {order.deliveryAddress.notes
                    ? ` (${order.deliveryAddress.notes})`
                    : ""}
                </span>
              </div>
            )}

            {order.total != null && (
              <div className="courier-detail">
                <span className="courier-detail__label">Ukupno</span>
                <span className="courier-detail__value">
                  {Number(order.total).toFixed(2)} RSD
                </span>
              </div>
            )}

            {order.status && (
              <div className="courier-detail">
                <span className="courier-detail__label">Status porudžbine</span>
                <span className="courier-detail__value">
                  {orderStatusLabel(order.status)}
                </span>
              </div>
            )}
          </div>

          <div className="courier-card__actions">
            {canPickup && (
              <button
                className="btn btn--primary"
                onClick={handlePickup}
                disabled={busy}
              >
                {busy ? "Slanje..." : "Preuzeo porudžbinu"}
              </button>
            )}

            {canDeliver && (
              <button
                className="btn btn--secondary"
                onClick={handleDelivery}
                disabled={busy}
              >
                {busy ? "Slanje..." : "Dostavljeno"}
              </button>
            )}
          </div>
        </>
      )}

      <div className="courier-card__footer">
        <button
          className="btn btn--outline btn--sm"
          onClick={refresh}
          disabled={busy}
        >
          Osveži status
        </button>
      </div>
    </section>
  );
}

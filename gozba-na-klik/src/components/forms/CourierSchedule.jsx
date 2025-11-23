import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getSchedule,
  getCourierStatus,
  upsertSchedule,
  ensureCourier,
} from "../../api/courierService";
import CourierCurrentJob from "../../pages/courier/CourierCurrentJob";

const dayNames = ["Ned", "Pon", "Uto", "Sre", "Čet", "Pet", "Sub"];

function getUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
}

// Pomocna funkcija za formatiranje vremena u HH:MM AZ
function hhmm(v) {
  if (!v) return "00:00";
  const [h, m] = String(v)
    .split(":")
    .map((n) => parseInt(n || "0", 10));
  return `${String(isNaN(h) ? 0 : h).padStart(2, "0")}:${String(
    isNaN(m) ? 0 : m
  ).padStart(2, "0")}`;
}

// Pomocna funkcija za racunanje sati izmedju dva HH:MM vremena AZ
function hoursBetween(start, end) {
  const [sh, sm] = start.split(":").map((n) => parseInt(n || "0", 10));
  const [eh, em] = end.split(":").map((n) => parseInt(n || "0", 10));
  return eh + (em || 0) / 60 - (sh + (sm || 0) / 60);
}

export default function CourierSchedule() {
  const { id: routeId } = useParams();
  const user = getUser();
  const userId = routeId ? Number(routeId) : user?.id;

  const [days, setDays] = useState(
    Array.from({ length: 7 }, (_, i) => ({
      dayOfWeek: i,
      start: "08:00",
      end: "16:00",
    }))
  );
  async function refreshStatusNow() {
    try {
      const st = await getCourierStatus(userId);
      if (st?.status) setStatus(st.status);
    } catch {}
  }

  const [status, setStatus] = useState("Inactive");
  const [busy, setBusy] = useState(false);

  const weekly = useMemo(
    () =>
      days.reduce((s, d) => s + Math.max(0, hoursBetween(d.start, d.end)), 0),
    [days]
  );

  useEffect(() => {
    if (!userId) return;

    (async () => {
      try {
        await ensureCourier(userId);
        const s = await getSchedule(userId);
        if (s && Array.isArray(s.days) && s.days.length === 7) {
          setDays(
            s.days.map((d) => ({
              ...d,
              start: hhmm(d.start),
              end: hhmm(d.end),
            }))
          );
        }
      } catch (e) {
        // nema rasporeda jos ili 404 pre ensure-a
      }

      try {
        const st = await getCourierStatus(userId);
        if (st?.status) setStatus(st.status);
      } catch {}
    })();

    const t = setInterval(async () => {
      try {
        const st = await getCourierStatus(userId);
        if (st?.status) setStatus(st.status);
      } catch {}
    }, 30000);

    return () => clearInterval(t);
  }, [userId]);

  function setField(i, field, val) {
    setDays((prev) =>
      prev.map((d, idx) => (idx === i ? { ...d, [field]: hhmm(val) } : d))
    );
  }

  async function save() {
    for (const d of days) {
      if (d.start >= d.end)
        return alert(`Dan ${dayNames[d.dayOfWeek]}: start mora biti pre end.`);
      if (hoursBetween(d.start, d.end) > 10)
        return alert(`Dan ${dayNames[d.dayOfWeek]}: najvise 10h dnevno.`);
    }
    if (weekly > 40)
      return alert(`Nedeljno ${weekly.toFixed(2)}h — maksimum je 40h.`);

    setBusy(true);
    try {
      await upsertSchedule(userId, { days });
      alert("Raspored sacuvan");
      await refreshStatusNow();
    } catch (e) {
      console.error(e);
      alert("Greska pri cuvanju rasporeda.");
    } finally {
      setBusy(false);
    }
  }

  const badgeStyle = {
    padding: "2px 8px",
    borderRadius: 12,
    color: "#fff",
    background:
      status === "Active"
        ? "#22c55e"
        : status === "Suspended"
        ? "#ef4444"
        : "#6b7280",
  };

  return (
    <main className="section">
      <div className="container" style={{ maxWidth: 720 }}>
        <div className="card card-pad stack">
          <div
            className="row"
            style={{ justifyContent: "space-between", alignItems: "center" }}
          >
            <h2 style={{ margin: 0 }}>
              {routeId ? `Raspored kurira #${userId}` : "Moj raspored"}
            </h2>
            <span style={badgeStyle}>{status}</span>
          </div>

          <div className="stack" style={{ gap: 12 }}>
            {days.map((d, i) => (
              <div
                key={d.dayOfWeek}
                className="row"
                style={{ gap: 12, alignItems: "center" }}
              >
                <div style={{ width: 72, fontWeight: 600 }}>
                  {dayNames[d.dayOfWeek]}
                </div>
                <label className="label">Start</label>
                <input
                  type="time"
                  className="input"
                  value={d.start}
                  onChange={(e) => setField(i, "start", e.target.value)}
                />
                <label className="label">End</label>
                <input
                  type="time"
                  className="input"
                  value={d.end}
                  onChange={(e) => setField(i, "end", e.target.value)}
                />
                <div style={{ marginLeft: "auto", opacity: 0.8 }}>
                  {Math.max(0, hoursBetween(d.start, d.end)).toFixed(2)}h
                </div>
              </div>
            ))}
          </div>

          <div
            className="row"
            style={{ justifyContent: "space-between", alignItems: "center" }}
          >
            <div style={{ fontWeight: 700 }}>
              Ukupno nedeljno: {weekly.toFixed(2)}h / 40h
            </div>
            <button
              className="btn btn-primary"
              onClick={save}
              disabled={busy || !userId}
            >
              {busy ? "Cuvanje..." : "Sacuvaj"}
            </button>
          </div>
        </div>
        <CourierCurrentJob userId={userId} onChanged={refreshStatusNow} />
      </div>
    </main>
  );
}

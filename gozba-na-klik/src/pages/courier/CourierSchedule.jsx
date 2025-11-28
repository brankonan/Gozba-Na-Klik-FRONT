import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getSchedule,
  getCourierStatus,
  upsertSchedule,
  ensureCourier,
} from "../../api/courierService";
import CourierCurrentJob from "./CourierCurrentJob";

const dayNames = ["Ned", "Pon", "Uto", "Sre", "Čet", "Pet", "Sub"];

function getUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
}

// "8:5" -> "08:05", "08:5" -> "08:05", prazno -> "00:00" AZ
function hhmm(v) {
  if (!v) return "00:00";
  const [h, m] = String(v)
    .split(":")
    .map((n) => parseInt(n || "0", 10));
  return `${String(isNaN(h) ? 0 : h).padStart(2, "0")}:${String(
    isNaN(m) ? 0 : m
  ).padStart(2, "0")}`;
}

// "08:00", "12:30" -> 4.5 (sati) AZ
function hoursBetween(start, end) {
  const [sh, sm] = start.split(":").map((n) => parseInt(n || "0", 10));
  const [eh, em] = end.split(":").map((n) => parseInt(n || "0", 10));
  return eh + (em || 0) / 60 - (sh + (sm || 0) / 60);
}

// 1.5 -> "01:30", 0.4 -> "00:24" AZ
function formatDuration(hours) {
  const totalMinutes = Math.round(hours * 60);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;

  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}
function formatHoursToHHMM(hours) {
  if (!isFinite(hours) || hours <= 0) return "00:00";

  const totalMinutes = Math.round(hours * 60); // 29.94h -> 1796 min AZ
  const hh = Math.floor(totalMinutes / 60); // 1796 / 60 -> 29h AZ
  const mm = totalMinutes % 60; // ostatak -> 56min AZ

  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}

// Mapira backend status ("Active", "Inactive", "Suspended") na sprski AZ
function translateStatus(status) {
  switch (status) {
    case "Active":
      return "Aktivan";
    case "Inactive":
      return "Neaktivan";
    case "Suspended":
      return "Suspendovan";
    default:
      return status || "Nepoznat";
  }
}

export default function CourierSchedule() {
  const { id: routeId } = useParams();
  const user = getUser();
  const userId = routeId ? Number(routeId) : user?.id;

  const [days, setDays] = useState(
    Array.from({ length: 7 }, (_, i) => ({
      dayOfWeek: i,
      start: "00:00",
      end: "00:00",
    }))
  );

  const [status, setStatus] = useState("Inactive");
  const [busy, setBusy] = useState(false);

  async function refreshStatusNow() {
    try {
      const st = await getCourierStatus(userId);
      if (st?.status) setStatus(st.status);
    } catch {}
  }

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
      if (d.start > d.end)
        return alert(
          `Dan ${dayNames[d.dayOfWeek]}: start mora biti pre kraja.`
        );
      if (hoursBetween(d.start, d.end) > 10)
        return alert(
          `Dan ${dayNames[d.dayOfWeek]}: najviše 10:00 radnih sati dnevno.`
        );
    }
    if (weekly > 40)
      return alert(
        `Nedeljno ${formatDuration(weekly)}h — maksimum je 40:00h nedeljno.`
      );

    setBusy(true);
    try {
      await upsertSchedule(userId, { days });
      alert("Raspored sačuvan.");
      await refreshStatusNow();
    } catch (e) {
      console.error(e);
      alert("Greška pri čuvanju rasporeda.");
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
            <span style={badgeStyle}>{translateStatus(status)}</span>
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
                  type="text"
                  className="input"
                  inputMode="numeric"
                  placeholder="00:00"
                  value={d.start}
                  onChange={(e) => setField(i, "start", e.target.value)}
                />

                <label className="label">Kraj</label>
                <input
                  type="text"
                  className="input"
                  inputMode="numeric"
                  placeholder="00:00"
                  value={d.end}
                  onChange={(e) => setField(i, "end", e.target.value)}
                />

                <div style={{ marginLeft: "auto", opacity: 0.8 }}>
                  {formatDuration(Math.max(0, hoursBetween(d.start, d.end)))}h
                </div>
              </div>
            ))}
          </div>

          <div
            className="row"
            style={{ justifyContent: "space-between", alignItems: "center" }}
          >
            <div style={{ fontWeight: 700 }}>
              Ukupno nedeljno: {formatHoursToHHMM(weekly)} / 40:00h
            </div>
            <button
              className="btn btn-primary"
              onClick={save}
              disabled={busy || !userId}
            >
              {busy ? "Čuvanje..." : "Sačuvaj"}
            </button>
          </div>
        </div>

        <CourierCurrentJob userId={userId} onChanged={refreshStatusNow} />
      </div>
    </main>
  );
}

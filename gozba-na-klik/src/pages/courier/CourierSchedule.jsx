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

/// "8:5" -> "08:05", "8" -> "08:00", prazno -> "00:00"
function hhmm(v) {
  if (!v) return "00:00";

  const str = String(v).trim();
  let h = 0;
  let m = 0;

  if (str.includes(":")) {
    // ima dvotačku
    const [hs, ms] = str.split(":");
    h = parseInt(hs || "0", 10);
    m = parseInt(ms || "0", 10);
  } else {
    // nema dvotačku, izvlači samo cifre
    const digits = str.replace(/\D/g, "");

    if (digits.length <= 2) {
      // "8" ili "12" -> sati, minuti 0
      h = parseInt(digits || "0", 10);
      m = 0;
    } else {
      // poslednje dve cifre su minuti, ostalo sati
      const mins = digits.slice(-2);
      const hours = digits.slice(0, -2);
      h = parseInt(hours || "0", 10);
      m = parseInt(mins || "0", 10);
    }
  }

  if (isNaN(h)) h = 0;
  if (isNaN(m)) m = 0;

  h = Math.min(23, Math.max(0, h));
  m = Math.min(59, Math.max(0, m));

  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

// koristi hhmm, pa računa razliku u satima
function hoursBetween(start, end) {
  const [sh, sm] = hhmm(start)
    .split(":")
    .map((n) => parseInt(n || "0", 10));
  const [eh, em] = hhmm(end)
    .split(":")
    .map((n) => parseInt(n || "0", 10));

  return eh + (em || 0) / 60 - (sh + (sm || 0) / 60);
}
// 1.5 -> "01:30"
function formatDuration(hours) {
  if (!isFinite(hours) || hours <= 0) return "00:00";
  const totalMinutes = Math.round(hours * 60);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

// 4.5 -> "04:30"
function formatHoursToHHMM(hours) {
  if (!isFinite(hours) || hours <= 0) return "00:00";
  const totalMinutes = Math.round(hours * 60);
  const hh = Math.floor(totalMinutes / 60);
  const mm = totalMinutes % 60;
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}

// Mapira backend status na srpski
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
    } catch {
      /* ignore */
    }
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
      } catch {
        // nema rasporeda još
      }

      await refreshStatusNow();
    })();

    const t = setInterval(refreshStatusNow, 30000);
    return () => clearInterval(t);
  }, [userId]);

  function setField(i, field, val) {
    setDays((prev) =>
      prev.map((d, idx) => (idx === i ? { ...d, [field]: val } : d))
    );
  }

  // poziva se na blur – tek tada formatiramo u HH:MM
  function normalizeField(i, field) {
    setDays((prev) =>
      prev.map((d, idx) => (idx === i ? { ...d, [field]: hhmm(d[field]) } : d))
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
        `Nedeljno ${formatHoursToHHMM(weekly)}h — maksimum je 40:00h nedeljno.`
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

  const badgeClass =
    status === "Active"
      ? "courier-badge courier-badge--active"
      : status === "Suspended"
      ? "courier-badge courier-badge--suspended"
      : "courier-badge courier-badge--inactive";

  return (
    <main className="courier-page">
      <div className="courier-page__inner">
        {/* LEVO – raspored */}
        <section className="courier-card card-pad">
          <header className="courier-card__header">
            <div>
              <h2 className="courier-card__title">
                {routeId ? `Raspored kurira #${userId}` : "Moj raspored"}
              </h2>
              <p className="courier-card__subtitle">
                Podesi svoje radno vreme po danima u nedelji. Sistem koristi ove
                podatke za dodelu porudžbina.
              </p>
            </div>
            <span className={badgeClass}>{translateStatus(status)}</span>
          </header>

          <div className="courier-schedule__days">
            {days.map((d, i) => (
              <div key={d.dayOfWeek} className="courier-day-row">
                <div className="courier-day-row__day">
                  {dayNames[d.dayOfWeek]}
                </div>

                <div className="courier-day-row__field">
                  <span className="courier-day-row__label">Start</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={5}
                    className="courier-time-input"
                    placeholder="08:00"
                    value={d.start}
                    onChange={(e) => setField(i, "start", e.target.value)}
                    onBlur={() => normalizeField(i, "start")}
                    onFocus={(e) => e.target.select()}
                  />
                </div>

                <div className="courier-day-row__field">
                  <span className="courier-day-row__label">Kraj</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={5}
                    className="courier-time-input"
                    placeholder="16:00"
                    value={d.end}
                    onChange={(e) => setField(i, "end", e.target.value)}
                    onBlur={() => normalizeField(i, "end")}
                    onFocus={(e) => e.target.select()}
                  />
                </div>

                <div className="courier-day-row__summary">
                  {formatDuration(Math.max(0, hoursBetween(d.start, d.end)))}h
                </div>
              </div>
            ))}
          </div>

          <footer className="courier-card__footer courier-card__footer--schedule">
            <div className="courier-weekly">
              Ukupno nedeljno:{" "}
              <span className="courier-weekly__value">
                {formatHoursToHHMM(weekly)} / 40:00h
              </span>
            </div>
            <button
              className="btn btn--primary"
              onClick={save}
              disabled={busy || !userId}
            >
              {busy ? "Čuvanje..." : "Sačuvaj raspored"}
            </button>
          </footer>
        </section>

        {/* DESNO – trenutni zadatak */}
        <section className="courier-card card-pad courier-current-job">
          <CourierCurrentJob userId={userId} onChanged={refreshStatusNow} />
        </section>
      </div>
    </main>
  );
}

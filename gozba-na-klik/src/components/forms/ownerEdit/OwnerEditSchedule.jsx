import React, { useEffect, useState } from "react";
import { getSchedule, putSchedule } from "../../../api/ownerRestaurantService";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function OwnerEditSchedule({
  restaurantId,
  ownerId,
  onUpdated,
}) {
  const [schedule, setSchedule] = useState(
    Array.from({ length: 7 }, (_, i) => ({
      dayOfWeek: i,
      isClosed: true,
      open: "",
      close: "",
    }))
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!restaurantId) return;
    (async () => {
      try {
        setLoading(true);
        const res = await getSchedule(restaurantId, ownerId);
        const data = Array.isArray(res?.data) ? res.data : res;

        const byDay = new Map();
        (data || []).forEach((d) => byDay.set(d.dayOfWeek, d));

        const filled = Array.from({ length: 7 }, (_, i) => {
          const d = byDay.get(i);
          return {
            dayOfWeek: i,
            isClosed: d ? !!d.isClosed : true,
            open: d?.open || "",
            close: d?.close || "",
          };
        });

        setSchedule(filled);
      } catch {
        setSchedule(
          Array.from({ length: 7 }, (_, i) => ({
            dayOfWeek: i,
            isClosed: true,
            open: "",
            close: "",
          }))
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [restaurantId]);

  function toggleClosed(i) {
    setSchedule((prev) =>
      prev.map((row, idx) =>
        idx === i ? { ...row, isClosed: !row.isClosed } : row
      )
    );
  }
  function setTime(i, field, value) {
    setSchedule((prev) =>
      prev.map((row, idx) => (idx === i ? { ...row, [field]: value } : row))
    );
  }

  async function saveSchedule() {
    try {
      const clean = schedule.map((s) => {
        let open = s.isClosed ? null : s.open;
        let close = s.isClosed ? null : s.close;

        if (open && open.length === 5) open = `${open}:00`;
        if (close && close.length === 5) close = `${close}:00`;

        if (s.isClosed) {
          open = "00:00:00";
          close = "00:00:00";
        }

        return {
          id: 0,
          restaurantId,
          dayOfWeek: s.dayOfWeek,
          isClosed: s.isClosed,
          open,
          close,
        };
      });

      console.log("Payload koji saljem:", clean);

      await putSchedule(restaurantId, clean, ownerId);
      onUpdated && onUpdated();
      alert("Schedule saved.");
    } catch (err) {
      console.error("Schedule save failed:", err);
      alert("Failed to save schedule.");
    }
  }

  return (
    <div className="panel">
      {loading && <div className="info info--muted">Loading…</div>}

      {schedule.map((row, i) => (
        <div className="form__row grid grid--3" key={row.dayOfWeek}>
          <strong>{DAYS[row.dayOfWeek]}</strong>

          <label className="row">
            <input
              type="checkbox"
              checked={row.isClosed}
              onChange={() => toggleClosed(i)}
            />
            <span>Closed</span>
          </label>

          {!row.isClosed ? (
            <div className="time-row">
              <input
                type="time"
                value={row.open}
                onChange={(e) => setTime(i, "open", e.target.value)}
              />
              <span>–</span>
              <input
                type="time"
                value={row.close}
                onChange={(e) => setTime(i, "close", e.target.value)}
              />
            </div>
          ) : (
            <div className="time-row muted">—</div>
          )}
        </div>
      ))}

      <div className="actions">
        <button className="btn btn--primary" onClick={saveSchedule}>
          Save schedule
        </button>
      </div>
    </div>
  );
}

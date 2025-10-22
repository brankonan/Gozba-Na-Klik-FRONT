import React, { useEffect, useState } from "react";
import {
  getExceptions,
  addException,
  deleteException,
} from "../../../api/ownerService";

export default function OwnerEditExceptions({
  restaurantId,
  ownerId,
  onUpdated,
}) {
  const [exceptions, setExceptions] = useState([]);
  const [newEx, setNewEx] = useState({ date: "", reason: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!restaurantId) return;
    (async () => {
      try {
        setLoading(true);
        const list = await getExceptions(restaurantId, ownerId);
        setExceptions(Array.isArray(list) ? list : []);
      } catch {
        setExceptions([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [restaurantId, ownerId]);

  function onChange(e) {
    const { name, value } = e.target;
    setNewEx((p) => ({ ...p, [name]: value }));
  }

  async function onAdd() {
    if (!newEx.date) {
      alert("Izaberi datum.");
      return;
    }
    try {
      const created = await addException(restaurantId, newEx, ownerId);
      setExceptions((prev) => [...prev, created]);
      setNewEx({ date: "", reason: "" });
      onUpdated && onUpdated();
    } catch (err) {
      console.error(err);
      alert("Greska: nije dodat exception.");
    }
  }

  async function onDelete(id) {
    try {
      await deleteException(restaurantId, id, ownerId);
      setExceptions((prev) => prev.filter((x) => (x.id ?? x.date) !== id));
      onUpdated && onUpdated();
    } catch (e) {
      console.error(e);
      alert("Neuspesno brisanje exception-a.");
    }
  }

  return (
    <div className="panel">
      {loading && <div className="info info--muted">Ucitavanje...</div>}

      <div className="form__row grid grid--3">
        <input
          className="input"
          type="date"
          name="date"
          value={newEx.date}
          onChange={onChange}
        />
        <input
          className="input"
          type="text"
          name="reason"
          value={newEx.reason}
          onChange={onChange}
          placeholder="Razlog (opciono)"
        />
        <button className="btn btn--secondary" onClick={onAdd}>
          Add
        </button>
      </div>

      <ul className="list">
        {exceptions.map((ex) => (
          <li key={ex.id} className="list__item">
            <span>
              <strong>{ex.date?.slice(0, 10)}</strong>
              {ex.reason ? ` — ${ex.reason}` : ""}
            </span>
            <button className="btn btn--ghost" onClick={() => onDelete(ex.id)}>
              Delete
            </button>
          </li>
        ))}
        {exceptions.length === 0 && (
          <li className="list__item muted">No exceptions.</li>
        )}
      </ul>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { getAll } from "../../api/ownerRestaurantService";
import OwnerEdit from "../../components/forms/ownerEdit/OwnerEdit";
import "../../styles/index.scss";

export default function OwnerRestaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  })();

  async function load() {
    if (!user?.id) return;
    try {
      setLoading(true);
      const data = await getAll(user.id);
      setRestaurants(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Greska pri ucitavanju restorana:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [user?.id]);

  function openEdit(r) {
    setSelected(r);
  }

  function closeEdit() {
    setSelected(null);
    load();
  }

  if (!user) {
    return <div style={{ padding: 40 }}>Niste prijavljeni.</div>;
  }
  if (user.role !== "RestaurantOwner") {
    return (
      <div style={{ padding: 40 }}>
        Ova stranica je dostupna samo vlasnicima restorana.
      </div>
    );
  }

  return (
    <main className="section-container" style={{ marginTop: 48 }}>
      {loading ? (
        <p className="loading-state">Ucitavanje...</p>
      ) : restaurants.length === 0 ? (
        <div className="card card-pad" style={{ marginTop: 24 }}>
          Još nemate nijedan restoran.
        </div>
      ) : (
        <div
          className="grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: 24,
            paddingBottom: 80,
          }}
        >
          {restaurants.map((r) => (
            <div
              key={r.id}
              className="card card-pad stack"
              style={{ gap: 8, position: "relative" }}
            >
              {r.coverUrl && (
                <img
                  src={`http://localhost:5194/${r.coverUrl}`}
                  alt=""
                  style={{
                    width: "100%",
                    height: 160,
                    objectFit: "cover",
                    borderRadius: 8,
                  }}
                />
              )}

              <h3 style={{ margin: 0 }}>{r.name}</h3>

              {r.description && (
                <p style={{ margin: 0, opacity: 0.8 }}>{r.description}</p>
              )}

              <div style={{ fontSize: 14, opacity: 0.8 }}>
                Kapacitet: {r.capacity ?? "—"}
              </div>

              <button
                className="btn btn-secondary"
                style={{ marginTop: "auto" }}
                onClick={() => openEdit(r)}
              >
                Edit
              </button>
            </div>
          ))}
        </div>
      )}

      {!!selected && (
        <OwnerEdit
          restaurant={selected}
          ownerId={user.id}
          onClose={closeEdit}
          onUpdated={closeEdit}
        />
      )}
    </main>
  );
}

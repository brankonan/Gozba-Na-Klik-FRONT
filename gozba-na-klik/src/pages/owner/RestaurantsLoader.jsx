import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyRestaurants } from "../../api/ownerService";
import OwnerEdit from "../../components/forms/ownerEdit/OwnerEdit";
import UserAvatar from "../../components/shared/UserAvatar";
import { API_ORIGIN } from "../../api/axios";
import "../../styles/index.scss";

const Owner = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);

  const navigate = useNavigate();

  const [user] = useState(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });

  function buildPhotoUrl(photo) {
    if (!photo) return "https://via.placeholder.com/300x180?text=No+Image";
    if (/^https?:\/\//i.test(photo)) return photo;
    return `${API_ORIGIN}${photo.startsWith("/") ? photo : `/${photo}`}`;
  }

  async function load() {
    if (!user) return;
    try {
      setLoading(true);
      const data = await getMyRestaurants(user.id);
      setRestaurants(data);
    } catch (err) {
      console.error("Greška pri učitavanju restorana:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [user]);

  if (!user) {
    return <div style={{ padding: 40 }}>Niste prijavljeni.</div>;
  }

  return (
    <div className="owner-page">
      <header className="navbar">
        <div className="navbar-inner">
          <div>My Restaurants</div>
          <UserAvatar />
        </div>
      </header>

      <main className="section">
        {loading ? (
          <p className="loading-state">Ucitavanje...</p>
        ) : restaurants.length === 0 ? (
          <p className="empty-state">Nemate nijedan restoran.</p>
        ) : (
          <div className="restaurants-grid">
            {restaurants.map((r) => (
              <div key={r.id} className="restaurant-card">
                <img src={buildPhotoUrl(r.photo)} alt={r.name} />
                <div className="card-content">
                  <h3>{r.name}</h3>
                  <p>Restaurant ID: {r.id}</p>

                  <div className="row" style={{ marginTop: 10 }}>
                    <button
                      className="btn btn--primary"
                      onClick={() => setEditing(r)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn--outline"
                      onClick={() => navigate(`/owner/restaurant/${r.id}/menu`)}
                    >
                      Menu
                    </button>
                    <button
                      className="btn btn--ghost"
                      onClick={() => navigate(`/restaurants/${r.id}`)}
                    >
                      Preview
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* EDITOVANJE */}
      {editing && (
        <div className="modal-backdrop" onClick={() => setEditing(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <OwnerEdit
              restaurant={editing}
              ownerId={user.id}
              onClose={() => setEditing(null)}
              onUpdated={() => {
                load();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Owner;

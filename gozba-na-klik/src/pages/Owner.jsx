import React, { useEffect, useState } from "react";
import { getMyRestaurant } from "../api/ownerService";
import UserAvatar from "../components/UserAvatar";
import { API_ORIGIN } from "../api/axios";
import "../styles/index.scss";

const Owner = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  const raw = localStorage.getItem("user");
  const user = raw ? JSON.parse(raw) : null;
  const ownerId = user?.id ?? user?.Id;

  useEffect(() => {
    if (!user) return;

    async function load() {
      try {
        const data = await getMyRestaurant(user.id);
        setRestaurants(data);
      } catch (err) {
        console.error("Greska pri ucitavanju restorana:", err);
      } finally {
        setLoading(false);
      }
    }

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

      <main className="section-container">
        {loading ? (
          <p className="loading-state">Ucitavanje...</p>
        ) : restaurants.length === 0 ? (
          <p className="empty-state">Nemate nijedan restoran.</p>
        ) : (
          <div className="restaurants-grid">
            {restaurants.map((r) => (
              <div key={r.id} className="restaurant-card">
                <img
                  src={
                    r.photo
                      ? r.photo.startsWith("http")
                        ? r.photo
                        : `${API_ORIGIN}${r.photo}`
                      : "https://via.placeholder.com/300x180?text=No+Image"
                  }
                  alt={r.name}
                />
                <div className="card-content">
                  <h3>{r.name}</h3>
                  <p>Restaurant ID: {r.id}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Owner;

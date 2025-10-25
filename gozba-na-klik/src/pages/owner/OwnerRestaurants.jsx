import React, { useEffect, useState } from "react";
import { getAll } from "../../api/ownerRestaurantService";
import RestaurantsGrid from "../../components/Restaurants/RestaurantsGrid";
import "../../styles/index.scss";

const OwnerRestaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  const raw = localStorage.getItem("user");
  const user = raw ? JSON.parse(raw) : null;

  useEffect(() => {
    if (!user) return;

    async function load() {
      try {
        const data = await getAll(user.id);
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
      <main className="section-container">
        {loading ? (
          <p className="loading-state">Ucitavanje...</p>
        ) :
          (
            <RestaurantsGrid restaurants={restaurants} />
          )}
      </main>
    </div>
  );
};

export default OwnerRestaurants;

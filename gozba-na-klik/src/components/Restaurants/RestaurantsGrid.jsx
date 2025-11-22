import React from "react";
import RestaurantCard from "./RestaurantCard";

const RestaurantsGrid = ({ restaurants }) => {
  if (!restaurants || restaurants.length === 0) {
    return <p className="empty-state">Nemate nijedan restoran.</p>;
  }
          
  return (
    <div className="restaurants-grid">
      {restaurants.map((r) => (
        <RestaurantCard
          key={r.id}
          restaurant={r}
        />
      ))}
    </div>
  );
};

export default RestaurantsGrid;

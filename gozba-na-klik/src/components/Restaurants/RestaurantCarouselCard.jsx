import React from "react";
import "../../styles/Restaurant.scss";

const RestaurantCarouselCard = ({ restaurant }) => {
  return (
    <div className="restaurant-carousel-card">
      <img src={restaurant.photo}></img>
      <h2>{restaurant.name}</h2>
    </div>
  );
};

export default RestaurantCarouselCard;

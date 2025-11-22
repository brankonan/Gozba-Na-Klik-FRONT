import React from "react";

const RestaurantCarouselCard = ({ restaurant }) =>{
  return (
    <div className="restaurant-carousel-card">
        <img src={restaurant.photo}></img>
        <h2>{restaurant.name}</h2>
    </div>
  );
}

export default RestaurantCarouselCard;

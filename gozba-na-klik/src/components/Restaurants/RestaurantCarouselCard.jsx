import React from "react";
import { useNavigate } from "react-router-dom";

const RestaurantCarouselCard = ({ restaurant }) =>{
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/customer/restaurant/${restaurant.id}/menu`, { state: restaurant })
  }

  return (
    <div className="restaurant-carousel-card" onClick={handleClick}>
        <img src={restaurant.photo}></img>
        <h2>{restaurant.name}</h2>
    </div>
  );
}

export default RestaurantCarouselCard;

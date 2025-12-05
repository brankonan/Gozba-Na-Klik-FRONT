import React from "react";
import { API_ORIGIN } from "../../api/axios";
import { useNavigate } from "react-router-dom";

const RestaurantCard = ({ restaurant }) => {

    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user"));

    const handleClick = () => {
        if (user.role === "RestaurantOwner") {
            navigate(`/owner/restaurant/${restaurant.id}/menu`, { state: restaurant });
        } else if (user.role === "Customer") {
            navigate(`/customer/restaurant/${restaurant.id}/menu`, { state: restaurant });
        }
    };

    return (
        <div className="restaurant-card" onClick={handleClick}>
            <img src={restaurant.photo} alt={restaurant.name} />

            <div className="card-content">
                <h3>{restaurant.name}</h3>
                <p>{restaurant.description}</p>
            </div>
        </div>
    );
};

export default RestaurantCard;

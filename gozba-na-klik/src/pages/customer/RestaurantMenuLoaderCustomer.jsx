import React, { useState, useEffect } from "react";
import RestaurantMenu from "../../components/Restaurants/RestaurantMenu";
import { useLocation } from "react-router-dom";
import CartPopup from "../../components/CartPopup";

const RestaurantMenuLoaderCustomer = () => {
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);


  const { state } = useLocation();
  const restaurant = state;
  const restaurantMenu = restaurant?.menu || [];
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    setMenu(restaurantMenu);
  }, []);

  const handleAddToCart = (item) => {
    setCart((prev) => [...prev, item]);
    setShowCart(true);
  };

  const handleCancel = () => {
    setCart([]);
    setShowCart(false);
  };



  return (
    <div className="menu-page">
      <h1>Meni restorana: {restaurant?.name}</h1>

      <RestaurantMenu
        role="customer"
        menu={menu}
        onAddToCart={handleAddToCart}
      />

      {showCart && (
        <CartPopup
          cart={cart}
          restaurant={restaurant}
          user={user}
          onCancel={handleCancel}
        />
      )}
    </div>);
};

export default RestaurantMenuLoaderCustomer;

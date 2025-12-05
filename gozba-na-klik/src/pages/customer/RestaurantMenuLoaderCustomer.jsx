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
  const user = JSON.parse(localStorage.getItem("user") || "null");

  console.log("EVO GA RESTORAN::: ", restaurant);

  useEffect(() => {
    setMenu(restaurantMenu);
  }, [restaurantMenu]);

  // Dodavanje jela u korpu
  const handleAddToCart = (item) => {
    setCart((prev) => [...prev, item]);
    setShowCart(true);
  };

  // Zatvaranje korpe (Otkaži)
  const handleCancel = () => {
    setCart([]);
    setShowCart(false);
  };

  //  uklanjanje jela na X
  const handleRemoveItem = (item, idx) => {
    setCart((prev) => {
      const next = prev.filter((_, i) => i !== idx);
      if (next.length === 0) {
        setShowCart(false);
      }
      return next;
    });
  };

  if (!restaurant) {
    return <p>Restoran nije pronađen.</p>;
  }

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
          onRemoveItem={handleRemoveItem}
        />
      )}
    </div>
  );
};

export default RestaurantMenuLoaderCustomer;

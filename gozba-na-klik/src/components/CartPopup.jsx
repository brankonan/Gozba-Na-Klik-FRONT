import React from "react";
import "../styles/CartPopup.scss";
import { toast } from "react-toastify";
import { createOrder } from "../api/orderService";

const CartPopup = ({ cart, restaurant, user, onCancel }) => {

  const total = cart.reduce((sum, i) => sum + i.price, 0);
  const delivery = cart.length > 0 ? 200 : 0;
  const finalTotal = total + delivery;

  const handleOrder = async () => {
    if (!cart.length) {
      toast.error("Korpa je prazna!");
      return;
    }
    
    const orderData = {
      restaurantId: restaurant.id,
      customerId: user.id,
      addressId: user.addresses[0].id,
      subtotal: total,
      deliveryFee: delivery,
      total: finalTotal,
      status: "NaCekanju",
      items: cart.map((item) => ({
        menuItemId: item.id,
        price: item.price,
      })),
    };

    try {

      const result = await createOrder(orderData);


      toast.success(`Porudzbina #${result.id} uspesno kreirana!`);
      console.log("Order created:");
    } catch (err) {
      console.error(err);
      toast.error("Doslo je do greske pri porucivanju!");
    }
  };

  return (
    <div className="cart-popup">
      <div className="cart-content">
        <h2>Korpa</h2>

        {cart.length === 0 ? (
          <p>Korpa je prazna.</p>
        ) : (
          <ul>
            {cart.map((item, idx) => (
              <li key={idx}>
                <span>{item.name}</span>
                <span>{item.price.toFixed(2)} RSD</span>
              </li>
            ))}
          </ul>
        )}

        <hr />
        {cart.length > 0 && (
          <>
            <p>Dostava: {delivery} RSD</p>
            <h3>Ukupno: {finalTotal.toFixed(2)} RSD</h3>
          </>
        )}

        <div className="cart-actions">
          <button className="btn btn-delete" onClick={onCancel}>
            Otkazi
          </button>
          <button className="btn btn-edit" onClick={handleOrder} disabled={cart.length === 0}>
            Poruci
          </button>
        </div>
      </div>
    </div>
  );
};


export default CartPopup;

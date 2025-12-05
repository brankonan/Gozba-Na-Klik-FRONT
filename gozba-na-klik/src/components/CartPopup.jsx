import React, { useEffect, useState } from "react";
import "../styles/CartPopup.scss";
import { toast } from "react-toastify";
import { createOrder } from "../api/orderService";
import { getAddressesAsync } from "../api/addressService";

const CartPopup = ({ cart, restaurant, user, onCancel }) => {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [loadingAddresses, setLoadingAddresses] = useState(false);

  const total = cart.reduce((sum, i) => sum + i.price, 0);
  const delivery = cart.length > 0 ? 200 : 0;
  const finalTotal = total + delivery;

  // Učitavanje adresa korisnika
  useEffect(() => {
    if (!user?.id) return;

    async function loadAddresses() {
      try {
        setLoadingAddresses(true);
        const data = await getAddressesAsync(user.id);
        setAddresses(data);

        if (!selectedAddressId && data.length > 0) {
          setSelectedAddressId(String(data[0].id));
        }
      } catch (err) {
        console.error("Greška pri učitavanju adresa:", err);
        toast.error("Nije moguće učitati adrese. Pokušajte ponovo kasnije.");
      } finally {
        setLoadingAddresses(false);
      }
    }

    loadAddresses();
  }, [user?.id]);

  // Rukovanje porudžbinom
  const handleOrder = async () => {
    if (!cart.length) {
      toast.error("Korpa je prazna!");
      return;
    }

    if (!user) {
      toast.error("Morate biti prijavljeni da biste poručili.");
      return;
    }

    if (!addresses.length) {
      toast.error(
        "Nemate nijednu sačuvanu adresu. Prvo dodajte adresu u profilu."
      );
      return;
    }

    if (!selectedAddressId) {
      toast.error("Molimo izaberite adresu za dostavu.");
      return;
    }

    const addressId = Number(selectedAddressId);

    const orderData = {
      restaurantId: restaurant.id,
      customerId: user.id,
      addressId,
      subtotal: total,
      deliveryFee: delivery,
      total: finalTotal,
      status: "NA_CEKANJU",
      items: cart.map((item) => ({
        menuItemId: item.id,
        price: item.price,
      })),
    };

    try {
      const result = await createOrder(orderData);

      toast.success(`Porudžbina #${result.id} uspešno kreirana!`);
      console.log("Order created:", result);
    } catch (err) {
      console.error(err);
      toast.error("Došlo je do greške pri poručivanju!");
    }
  };

  return (
    <div className="cart-popup">
      <div className="cart-content">
        <h2>Brza kupovina</h2>

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

        {loadingAddresses ? (
          <p>Učitavanje adresa...</p>
        ) : addresses.length > 0 ? (
          <div className="address-select">
            <label>
              Adresa za dostavu:
              <select
                className="input"
                value={selectedAddressId}
                onChange={(e) => setSelectedAddressId(e.target.value)}
              >
                <option value="">-- Izaberite adresu --</option>
                {addresses.map((a) => (
                  <option key={a.id} value={a.id}>
                    {`${a.street} ${a.houseNumber ?? ""}, ${a.city}`}
                  </option>
                ))}
              </select>
            </label>
          </div>
        ) : (
          <p style={{ fontSize: 14, opacity: 0.8 }}>
            Nemate sačuvane adrese. Idite u profil i dodajte bar jednu adresu.
          </p>
        )}

        {cart.length > 0 && (
          <>
            <p>Dostava: {delivery} RSD</p>
            <h3>Ukupno: {finalTotal.toFixed(2)} RSD</h3>
          </>
        )}

        <div className="cart-actions">
          <button className="btn btn-delete" onClick={onCancel}>
            Otkaži
          </button>
          <button
            className="btn btn-edit"
            onClick={handleOrder}
            disabled={cart.length === 0}
          >
            Poruči
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPopup;

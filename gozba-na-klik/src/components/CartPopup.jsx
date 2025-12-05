import React, { useEffect, useState } from "react";
import "../styles/CartPopup.scss";
import { toast } from "react-toastify";
import { createOrder } from "../api/orderService";
import { getAddressesAsync } from "../api/addressService";

const CartPopup = ({ cart, restaurant, user, onCancel, onRemoveItem }) => {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [closing, setClosing] = useState(false);

  const total = cart.reduce((sum, i) => sum + i.price, 0);
  const delivery = cart.length > 0 ? 200 : 0;
  const finalTotal = total + delivery;

  // helper za zatvaranje sa animacijom
  const handleClose = () => {
    if (closing) return;
    setClosing(true);

    setTimeout(() => {
      if (onCancel) onCancel();
    }, 220); // trajanje animacije u ms
  };

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
  }, [user?.id, selectedAddressId]);

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

      // zatvori popup posle uspešne porudžbine
      handleClose();
    } catch (err) {
      console.error(err);
      toast.error("Došlo je do greške pri poručivanju!");
    }
  };

  return (
    <div className={`cart-popup ${closing ? "cart-popup--closing" : ""}`}>
      <div className="cart-content">
        <h2>Brza kupovina</h2>

        {cart.length === 0 ? (
          <p>Korpa je prazna.</p>
        ) : (
          <ul>
            {cart.map((item, idx) => (
              <li key={item.id ?? idx}>
                <span>{item.name}</span>
                <span className="cart-item-price">
                  {item.price.toFixed(2)} RSD
                </span>
                {/* X dugme za izbacivanje jela */}
                <button
                  type="button"
                  className="cart-item-remove"
                  onClick={() => onRemoveItem?.(item, idx)}
                  aria-label="Ukloni iz korpe"
                >
                  ×
                </button>
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
          <div className="cart-summary">
            <div className="cart-row cart-row--muted">
              <span>Međuosnova</span>
              <span>{total.toFixed(2)} RSD</span>
            </div>
            <div className="cart-row cart-row--muted">
              <span>Dostava</span>
              <span>{delivery.toFixed(2)} RSD</span>
            </div>
            <div className="cart-total">
              <span>Ukupno</span>
              <span>{finalTotal.toFixed(2)} RSD</span>
            </div>
          </div>
        )}

        <div className="cart-actions">
          <button className="btn btn-delete" onClick={handleClose}>
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

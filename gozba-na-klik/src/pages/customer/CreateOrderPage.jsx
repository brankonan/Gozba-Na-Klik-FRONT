import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createOrder } from "../../api/orderService";

function getUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
}

export default function CreateOrderPage() {
  const navigate = useNavigate();
  const { restaurantId: routeRestaurantId } = useParams();
  const user = getUser();

  const [restaurantId, setRestaurantId] = useState(routeRestaurantId || "");
  const [addressId, setAddressId] = useState("");
  const [items, setItems] = useState([{ menuItemId: "", price: "" }]);
  const [busy, setBusy] = useState(false);

  if (!user || user.role !== "Customer") {
    return (
      <main className="section">
        <div className="container" style={{ maxWidth: 640 }}>
          <div className="card card-pad">
            Morate biti prijavljeni kao kupac da biste napravili porudzbinu.
          </div>
        </div>
      </main>
    );
  }

  function handleItemChange(index, field, value) {
    setItems((prev) =>
      prev.map((row, i) =>
        i === index
          ? {
              ...row,
              [field]: value,
            }
          : row
      )
    );
  }

  function addItemRow() {
    setItems((prev) => [...prev, { menuItemId: "", price: "" }]);
  }

  function removeItemRow(index) {
    setItems((prev) =>
      prev.length === 1 ? prev : prev.filter((_, i) => i !== index)
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!restaurantId.trim()) {
      alert("Unesite ID restorana (ili prosledite kroz rutu).");
      return;
    }

    if (!addressId.trim()) {
      alert("Unesite ID adrese za dostavu.");
      return;
    }

    const normalizedItems = items
      .filter((i) => i.menuItemId.trim() !== "" && i.price.trim() !== "")
      .map((i) => ({
        menuItemId: Number(i.menuItemId),
        price: Number(i.price),
      }));

    if (normalizedItems.length === 0) {
      alert("Dodajte bar jednu stavku porudzbine.");
      return;
    }

    const payload = {
      restaurantId: Number(restaurantId),
      customerId: user.id,
      addressId: Number(addressId),
      items: normalizedItems,
    };

    setBusy(true);
    try {
      const order = await createOrder(payload);
      alert(
        `Porudzbina #${order.id} je uspesno kreirana. Trenutni status: ${order.status}`
      );

      // Ako napraviš stranicu za praćenje: /customer/orders/:id
      navigate(`/customer/orders/${order.id}`);
    } catch (err) {
      console.error(err);
      alert("Greška pri kreiranju porudzbine.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="section">
      <div className="container" style={{ maxWidth: 640 }}>
        <div className="card card-pad stack" style={{ gap: 16 }}>
          <h2 style={{ margin: 0 }}>Kreiraj porudzbinu</h2>

          <form className="stack" style={{ gap: 16 }} onSubmit={handleSubmit}>
            <div className="stack" style={{ gap: 8 }}>
              <label className="label">
                Restoran ID
                <input
                  type="number"
                  className="input"
                  value={restaurantId}
                  onChange={(e) => setRestaurantId(e.target.value)}
                  placeholder="npr. 5"
                />
              </label>

              <label className="label">
                Adresa ID
                <input
                  type="number"
                  className="input"
                  value={addressId}
                  onChange={(e) => setAddressId(e.target.value)}
                  placeholder="npr. 3"
                />
              </label>
            </div>

            <div className="stack" style={{ gap: 8 }}>
              <div style={{ fontWeight: 600 }}>Stavke porudzbine</div>

              {items.map((row, index) => (
                <div
                  key={index}
                  className="row"
                  style={{ gap: 8, alignItems: "center" }}
                >
                  <input
                    type="number"
                    className="input"
                    style={{ maxWidth: 120 }}
                    placeholder="MenuItem ID"
                    value={row.menuItemId}
                    onChange={(e) =>
                      handleItemChange(index, "menuItemId", e.target.value)
                    }
                  />
                  <input
                    type="number"
                    className="input"
                    style={{ maxWidth: 120 }}
                    placeholder="Cena (RSD)"
                    step="0.01"
                    value={row.price}
                    onChange={(e) =>
                      handleItemChange(index, "price", e.target.value)
                    }
                  />
                  <button
                    type="button"
                    className="btn"
                    onClick={() => removeItemRow(index)}
                    disabled={items.length === 1}
                  >
                    Ukloni
                  </button>
                </div>
              ))}

              <button
                type="button"
                className="btn btn-secondary"
                onClick={addItemRow}
              >
                + Dodaj stavku
              </button>
            </div>

            <div className="row" style={{ justifyContent: "flex-end", gap: 8 }}>
              <button type="submit" className="btn btn-primary" disabled={busy}>
                {busy ? "Slanje..." : "Kreiraj porudžbinu"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

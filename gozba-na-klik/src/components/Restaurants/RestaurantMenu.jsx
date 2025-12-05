import React from "react";
import "../../styles/MenuItemCard.scss";
import "../../styles/Restaurant.scss";

const RestaurantMenu = ({ menu, role, onEdit, onDelete, onAddToCart }) => {
  if (!menu || menu.length === 0) return <p>Nema jela u meniju.</p>;

  const isOwner = role === "owner";
  const isCustomer = role === "customer";

  return (
    <div className="menu-container">
      {menu.map((item) => (
        <div key={item.id} className="menuItem-card">
          <img src={item.photoPath} alt={item.name} />
          <span className="name">{item.name}</span>
          <span className="description">{item.description}</span>
          <span className="price">{item.price} RSD</span>

          <div className="actions">
            {isOwner && (
              <>
                <button
                  className="btn btn-edit"
                  onClick={() => onEdit?.(item.id)}
                >
                  Izmeni
                </button>
                <button
                  className="btn btn-delete"
                  onClick={() => onDelete?.(item.id)}
                >
                  Obrisi
                </button>
              </>
            )}

            {isCustomer && (
              <button
                className="btn btn-primary"
                onClick={() => onAddToCart?.(item)}
              >
                Dodaj u korpu
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RestaurantMenu;

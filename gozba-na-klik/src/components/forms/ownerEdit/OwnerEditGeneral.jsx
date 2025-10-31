import React, { useEffect, useState } from "react";
import { updateRestaurantGeneral } from "../../../api/ownerService";

export default function OwnerEditGeneral({ restaurant, ownerId, onUpdated }) {
  const [gen, setGen] = useState({
    name: "",
    description: "",
    phone: "",
    capacity: "",
  });

  useEffect(() => {
    setGen({
      name: restaurant?.name || "",
      description: restaurant?.description || "",
      phone: restaurant?.phone || "",
      capacity: restaurant?.capacity?.toString?.() || "",
    });
  }, [restaurant]);

  function handleChange(e) {
    const { name, value } = e.target;
    setGen((prev) => ({ ...prev, [name]: value }));
  }

  async function saveGeneral() {
    try {
      const payload = {
        ...gen,
        capacity: gen.capacity === "" ? null : Number(gen.capacity),
      };
      await updateRestaurantGeneral(restaurant.id, payload, ownerId);
      onUpdated && onUpdated();
      alert("General info saved.");
    } catch (err) {
      console.error(err);
      alert("Failed to save general info.");
    }
  }

  return (
    <div className="panel">
      <label className="form__row">
        <span>Name</span>
        <input
          className="input"
          name="name"
          value={gen.name}
          onChange={handleChange}
          placeholder="Restaurant name"
        />
      </label>

      <label className="form__row">
        <span>Description</span>
        <textarea
          className="input"
          name="description"
          value={gen.description}
          onChange={handleChange}
          placeholder="Short description"
        />
      </label>

      <label className="form__row">
        <span>Phone</span>
        <input
          className="input"
          name="phone"
          value={gen.phone}
          onChange={handleChange}
          placeholder="+381..."
        />
      </label>

      <label className="form__row">
        <span>Capacity</span>
        <input
          className="input"
          type="number"
          name="capacity"
          value={gen.capacity}
          onChange={handleChange}
          placeholder="e.g. 60"
        />
      </label>

      <div className="actions">
        <button className="btn btn--primary" onClick={saveGeneral}>
          Save
        </button>
      </div>
    </div>
  );
}

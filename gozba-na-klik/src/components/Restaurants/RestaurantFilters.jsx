import React, { useState } from "react";

const RestaurantFilters = ({ filter = {}, onChange }) => {
  const [open, setOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    onChange({
      ...filter,
      [name]:
        name === "capacity"
          ? value === ""
            ? undefined
            : Number(value)
          : value,
    });
  };

  const handleClear = () => {
    onChange({
      name: "",
      capacity: undefined,
    });
  };

  return (
    <div className="toolbar-group">
      <button
        type="button"
        className="toolbar-toggle"
        onClick={() => setOpen((prev) => !prev)}
      >
        Filteri
      </button>

      {open && (
        <div className="toolbar-popover">

          <div className="restaurant-filters">
            <div>
              <label className="label">
                Restoran
              </label>
              <input
                className="input"
                type="text"
                name="name"
                placeholder="Pretraga po nazivu"
                value={filter.name || ""}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="label">
                Minimalni kapacitet
              </label>
              <input
                className="input"
                type="number"
                name="capacity"
                placeholder="Unesite broj mesta"
                value={filter.capacity ?? ""}
                onChange={handleChange}
              />
            </div>

            <div>
              <button
                type="button"
                className="btn btn--outline "
                onClick={handleClear}
              >
                Ocisti filtere
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantFilters;

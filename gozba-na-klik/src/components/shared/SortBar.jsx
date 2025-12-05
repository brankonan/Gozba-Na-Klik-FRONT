import React, { useState } from "react";
import "../../styles/SortBar.scss";

const SortBar = ({ sortBy, sortDir, options, onChange }) => {

  const handleSortByChange = (e) => {
    const newSortBy = e.target.value || null;
    onChange({
      sortBy: newSortBy,
      sortDir: sortDir || "asc",
    });
  };

  const handleToggleDirClick = () => {
    if (!sortDir) {
      onChange({ sortBy, sortDir: "asc" });
    } else {
      onChange({
        sortBy,
        sortDir: sortDir === "asc" ? "desc" : "asc",
      });
    }
  };

  return (
    <div className="sort-bar">
      <div className="sort" >
        <label>
          SORTIRAJ PO:
          <select className="sort-select" value={sortBy} onChange={handleSortByChange}>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <button
        type="button"
        className="toolbar-toggle"
        onClick={handleToggleDirClick}
      >
        {sortDir === "asc" && "RASTUCE"}
        {sortDir === "desc" && "OPADAJUCE"}
      </button>

    </div>

  )
}

export default SortBar;

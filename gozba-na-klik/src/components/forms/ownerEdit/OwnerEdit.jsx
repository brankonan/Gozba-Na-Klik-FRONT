import React, { useState } from "react";
import OwnerEditGeneral from "./OwnerEditGeneral";
import OwnerEditSchedule from "./OwnerEditSchedule";
import OwnerEditExceptions from "./OwnerEditExceptions";
import OwnerEditCover from "./OwnerEditCover";
import "../../../styles/index.scss";
import "../../../styles/Owner.scss";

export default function OwnerEdit({ restaurant, ownerId, onClose, onUpdated }) {
  const [tab, setTab] = useState("general");

  return (
    <div className="modal">
      <div className="modal__content">
        <div className="modal__header">
          <h2>Edit Restaurant</h2>
          <button className="btn btn--ghost" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="tabs">
          <button
            className={`tab ${tab === "general" ? "tab--active" : ""}`}
            onClick={() => setTab("general")}
          >
            General
          </button>
          <button
            className={`tab ${tab === "schedule" ? "tab--active" : ""}`}
            onClick={() => setTab("schedule")}
          >
            Schedule
          </button>
          <button
            className={`tab ${tab === "exceptions" ? "tab--active" : ""}`}
            onClick={() => setTab("exceptions")}
          >
            Exceptions
          </button>
          <button
            className={`tab ${tab === "cover" ? "tab--active" : ""}`}
            onClick={() => setTab("cover")}
          >
            Cover
          </button>
        </div>

        {tab === "general" && (
          <OwnerEditGeneral
            restaurant={restaurant}
            ownerId={ownerId}
            onUpdated={onUpdated}
          />
        )}
        {tab === "schedule" && (
          <OwnerEditSchedule
            restaurantId={restaurant?.id}
            ownerId={ownerId}
            onUpdated={onUpdated}
          />
        )}
        {tab === "exceptions" && (
          <OwnerEditExceptions
            restaurantId={restaurant?.id}
            ownerId={ownerId}
            onUpdated={onUpdated}
          />
        )}
        {tab === "cover" && (
          <OwnerEditCover
            restaurantId={restaurant?.id}
            ownerId={ownerId}
            onUpdated={onUpdated}
          />
        )}
      </div>
    </div>
  );
}

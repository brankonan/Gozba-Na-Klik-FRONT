import React, { useState } from "react";
import { uploadRestaurantCover } from "../../../api/ownerService";

export default function OwnerEditCover({ restaurantId, ownerId, onUpdated }) {
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);

  function onChange(e) {
    const f = e.target.files?.[0] || null;
    setFile(f);
  }

  async function upload() {
    if (!file) {
      alert("Izaberi sliku prvo.");
      return;
    }
    try {
      await uploadRestaurantCover(restaurantId, file, ownerId);
      setFile(null);
      onUpdated?.();
      alert("Cover je uspešno otpremljen.");
    } catch (err) {
      console.error("Cover upload failed:", err);
      alert("Greska pri upload-u.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="panel">
      <div className="form__row">
        <input type="file" accept="image/png, image/jpeg" onChange={onChange} />
      </div>
      <div className="actions">
        <button
          className="btn btn--primary"
          onClick={upload}
          disabled={!file || busy}
        >
          {busy ? "Uploading..." : "Upload cover"}
        </button>
      </div>
    </div>
  );
}

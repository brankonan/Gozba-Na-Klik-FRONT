import React from "react";
import { useNavigate } from "react-router-dom";

export default function Welcome() {
  const navigate = useNavigate();
  return (
    <div style={{ maxWidth: 440, margin: "80px auto", textAlign: "center" }}>
      <h1>Dobrodošli</h1>
      <p>Izaberite sledeći korak:</p>
      <div style={{ display: "grid", gap: 12, marginTop: 24 }}>
        <button onClick={() => navigate("/register")}>Registracija</button>
        <button onClick={() => navigate("/login")}>Prijava</button>
      </div>
    </div>
  );
}

import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/index.scss";

export default function Welcome() {
  const navigate = useNavigate();
  return (
    <>
      <header className="navbar">
        <div className="navbar-inner container" style={{ fontWeight: 800 }}>
          Food·Admin
        </div>
        <div className="row">
          <button
            className="btn btn-primary"
            onClick={() => navigate("/login")}
          >
            Prijava
          </button>
          <button
            className="btn btn-ghost"
            onClick={() => navigate("/register")}
          >
            Registracija
          </button>
        </div>
      </header>

      <main className="section">
        <div
          className="container card card-pad center"
          style={{ minHeight: 260, display: "grid", placeItems: "center" }}
        >
          <div className="stack" style={{ textAlign: "center" }}>
            <h1>Dobrodošli</h1>
            <p style={{ opacity: 0.85 }}>Izaberite sledeći korak:</p>
            <div className="row" style={{ justifyContent: "center" }}>
              <button
                className="btn btn-primary btn-lg"
                onClick={() => navigate("/register")}
              >
                Registracija
              </button>
              <button
                className="btn btn-outline btn-lg"
                onClick={() => navigate("/login")}
              >
                Prijava
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/index.scss";

const Admin = () => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <header className="navbar">
        <div className="navbar-inner">
          <div style={{ fontWeight: 800 }}>Admin·Panel</div>

          <div style={{ position: "relative" }}>
            <button
              className="btn btn-outline btn-sm"
              onClick={() => setOpen((v) => !v)}
              aria-haspopup="menu"
              aria-expanded={open}
            >
              ☰ Menu
            </button>

            {open && (
              <ul className="menu" role="menu" aria-label="Admin menu">
                <li>
                  <Link to="/admin/users" role="menuitem">
                    View users
                  </Link>
                </li>
                <li>
                  <Link to="/admin/restaurants" role="menuitem">
                    View restaurants
                  </Link>
                </li>
              </ul>
            )}
          </div>
        </div>
      </header>

      <main className="section">
        <div className="container" style={{ textAlign: "center" }}>
          <h1 className="h1">Admin panel</h1>
          <p style={{ opacity: 0.85 }}>Choose your option above.</p>
        </div>
      </main>
    </div>
  );
};

export default Admin;

import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/index.scss";
import UserAvatar from "../../components/UserAvatar";

const Admin = () => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <header className="navbar">
        <div className="navbar-inner">
          <div style={{ fontWeight: 800 }}>Admin·Panel</div>
          <button
            className="btn btn-outline btn-sm"
            onClick={() => setOpen((v) => !v)}
            aria-haspopup="menu"
            aria-expanded={open}
          >
            ☰ Menu
          </button>
          <UserAvatar />
        </div>
        {open && (
          <nav className="container" style={{ position: "relative" }}>
            <ul
              className="menu"
              role="menu"
              aria-label="Admin menu"
              style={{ position: "absolute" }}
            >
              <li>
                <Link to="/admin/users" role="menuitem">
                  View users
                </Link>
              </li>
            </ul>
          </nav>
        )}
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

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { handleLogout } from "../api/authService";
import UserAvatar from "./UserAvatar";

function getUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
}

export default function Navbar() {
  const navigate = useNavigate();
  const user = getUser();

  const onLogout = () => handleLogout(navigate);

  return (
    <nav className="navbar">
      <div className="nabvar-inner container">
        <div style={{ fontWeight: 800 }}>Gozba na klik</div>
        {!user ? (
          <div className="row" style={{ gap: 12 }}>
            <Link to="/login">Prijava</Link>
            <Link to="/register">Registracija</Link>
          </div>
        ) : (
          <div className="row" style={{ gap: 12 }}>
            {/* linkovi po ulozi */}
            {user.role === "Admin" && (
              <>
                <Link to="/admin">Admin</Link>
                <Link to="/admin/users">Korisnici</Link>
                <Link to="/admin/restaurants">Restorani</Link>
              </>
            )}

            {user.role === "RestaurantOwner" && (
              <Link to="/owner">Moji restorani</Link>
            )}

            {user.role === "Courier" && (
              <Link to="/courier/schedule">Raspored</Link>
            )}

            {user.role === "Employee" && (
              <Link to="/employee/orders">Porudzbine</Link>
            )}

            {user.role === "Customer" && (
              <>
                <Link to="/">Pocetna</Link>
                <Link to={`/profile/${user.Id ?? user.id}`}>Profil</Link>
              </>
            )}

            <UserAvatar />
            <button className="btn btn-ghost btn-sm" onClick={onLogout}>
              Odjava
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

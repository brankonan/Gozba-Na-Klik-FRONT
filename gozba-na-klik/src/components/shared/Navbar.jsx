import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { handleLogout } from "../../api/authService";
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
      <div className="navbar-inner container">
        <div className="logo" style={{ fontWeight: 800 }}>
          Gozba na klik
        </div>

        {user && (
          <div className="links-container">
            {user.role === "Admin" && (
              <div className="links">
                <NavLink to="/admin/users">KORISNICI</NavLink>
                <NavLink to="/admin/restaurants">RESTORANI</NavLink>
                <NavLink to={`/admin/profile/${user.id}`}>PROFIL</NavLink>
              </div>
            )}

            {user.role === "RestaurantOwner" && (
              <div className="links">
                <NavLink to="/owner/restaurants">RESTORANI</NavLink>
                <NavLink to="/owner/orders">PORUDZBINE</NavLink>
                <NavLink to={`/owner/profile/${user.id}`}>PROFIL</NavLink>
              </div>
            )}

            {user.role === "Courier" && (
              <div className="links">
                <NavLink to="/courier/schedule">RASPORED</NavLink>
                <NavLink to={`/courier/profile/${user.id}`}>PROFIL</NavLink>
              </div>
            )}

            {user.role === "Employee" && (
              <div className="links">
                <NavLink to="/employee/orders">PORUDZBINE</NavLink>
                <NavLink to={`/employee/profile/${user.id}`}>PROFIL</NavLink>
              </div>
            )}

            {user.role === "Customer" && (
              <div className="links">
                <NavLink to="/customer/restaurants">RESTORANI</NavLink>
                <NavLink to="/">POCETNA</NavLink>
                <NavLink to="/customer/addresses">ADRESE</NavLink>
                <NavLink to={`/customer/profile/${user.id}`}>PROFIL</NavLink>
              </div>
            )}
          </div>
        )}

        {!user ? (
          <div className="row" style={{ gap: 12 }}>
            <NavLink to="/login">Prijava</NavLink>
            <NavLink to="/register">Registracija</NavLink>
          </div>
        ) : (
          <div className="avatar-container">
            <button onClick={onLogout}>Odjava</button>
            <UserAvatar />
          </div>
        )}
      </div>
    </nav>
  );
}

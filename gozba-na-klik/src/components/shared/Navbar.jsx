import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { handleLogout } from "../../api/authService";
import UserAvatar from "./UserAvatar";
import "../../styles/Navbar.scss";

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

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10); // kada malo skroluje, navbar potamni
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onLogout = () => handleLogout(navigate);

  return (
    <nav className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
      <div className="navbar-inner container">
        {/* Logo – klik vodi na početnu */}
        <button className="logo" type="button" onClick={() => navigate("/")}>
          <span className="logo__dot" />
          <span className="logo__text">Gozba na Klik</span>
        </button>

        {/* Linkovi po ulozi */}
        {user && (
          <div className="links-container">
            {user.role === "Admin" && (
              <div className="links">
                <NavLink to="/admin/users">Korisnici</NavLink>
                <NavLink to="/admin/restaurants">Restorani</NavLink>
                <NavLink to={`/admin/profile/${user.id}`}>Profil</NavLink>
              </div>
            )}

            {user.role === "RestaurantOwner" && (
              <div className="links">
                <NavLink to="/owner/restaurants">Restorani</NavLink>
                <NavLink to="/owner/orders">Porudžbine</NavLink>
                <NavLink to={`/owner/profile/${user.id}`}>Profil</NavLink>
              </div>
            )}

            {user.role === "Courier" && (
              <div className="links">
                <NavLink to="/courier/schedule">Raspored</NavLink>
                <NavLink to={`/courier/profile/${user.id}`}>Profil</NavLink>
              </div>
            )}

            {user.role === "Employee" && (
              <div className="links">
                <NavLink to="/employee/orders">Porudžbine</NavLink>
                <NavLink to={`/employee/profile/${user.id}`}>Profil</NavLink>
              </div>
            )}

            {user.role === "Customer" && (
              <div className="links">
                <NavLink to="/customer/restaurants">Restorani</NavLink>
                <NavLink to="/">Početna</NavLink>
                <NavLink to="/customer/addresses">Adrese</NavLink>
                <NavLink to={`/customer/profile/${user.id}`}>Profil</NavLink>
              </div>
            )}
          </div>
        )}

        {/* Desna strana – prijava / registracija ili avatar + odjava */}
        {!user ? (
          <div className="navbar-auth">
            <NavLink to="/login" className="navbar-auth__link">
              Prijava
            </NavLink>
            <NavLink to="/register" className="navbar-auth__btn">
              Registracija
            </NavLink>
          </div>
        ) : (
          <div className="avatar-container">
            <button type="button" className="navbar-logout" onClick={onLogout}>
              Odjava
            </button>
            <UserAvatar />
          </div>
        )}
      </div>
    </nav>
  );
}

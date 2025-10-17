import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
    const navigate = useNavigate();

    return (
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
    )
}

export default Navbar;
import React, { useState } from "react";
import { Link } from "react-router-dom";

const Admin = () => {
    const [open, setOpen] = useState(false);

    return(
        <div>
            <nav style={{ background: "#333", padding: "1rem", color: "#fff" }}> 
                <button onClick={() => setOpen(!open)} 
                    style={{ 
                        background: "transparent", 
                        border: "none", 
                        color: "white", 
                        fontSize: "1.2rem", 
                        cursor: "pointer" 
                    }}
                >
                    ☰ Menu
                </button>

                {open && (
                    <ul style={{ 
                        listStyle: "none", 
                        margin: 0, 
                        padding: "0.5rem", 
                        background: "#444", 
                        position: "absolute"
                    }}>
                        <li>
                            <Link to="/admin/users" style={{ color: "white" }}>View users</Link>
                        </li>
                    </ul>
                )}
            </nav>
            <div style={{ padding: "2rem", textAlign: "center" }}>
                <h1>Admin panel</h1>
                <p>Choose your option above.</p>
            </div>
        </div>
    ) 
}

export default Admin;

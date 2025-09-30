import React, { useState , useEffect} from "react";
import { getAllRestaurants } from "../../api/adminService";
import { useNavigate } from "react-router-dom";


const AdminRestaurants = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const navigate = useNavigate();

    useEffect(() =>{
        fetchRestaurants();
    },[]);

    async function fetchRestaurants(){
        try{
            const data = await getAllRestaurants();
            setRestaurants(data);
        }
        catch(err){
            console.error("Error occurred while loading restaurants: ", err)
        }
    };

    return(
        <div>
            <header className="navbar">
                <div className="navbar-inner">
                    <div style={{ fontWeight: 800 }}>Restaurants·Management</div>
                    <button
                        className="btn btn-primary btn-sm"
                        onClick={() => setShowForm((s) => !s)}
                    >
                        {showForm ? "Close form" : "Add new restaurant"}
                    </button>
                </div>
            </header>
            <main className="section container">
                <section className="stack">
                    <h2>Restaurants</h2>
                    <div className="table-wrap">
                        <table className="table">
                            <thead>
                                <tr>
                                    <td>ID</td>
                                    <td>Name</td>
                                    <td>OwnerID</td>
                                    <td>OwnerName</td>
                                </tr>
                            </thead>
                            <tbody>
                                {restaurants.map((r)=>(
                                    <tr key={r.id}>
                                        <td>{r.id}</td>
                                        <td>{r.name}</td>
                                        <td>{r.ownerId}</td>
                                        <td>{r.ownerName}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>

            <button
                className="btn btn-primary btn-sm"
                onClick={() => navigate("/admin")}>
                    ← Back
            </button>
        </div>
    );
};

export default AdminRestaurants;
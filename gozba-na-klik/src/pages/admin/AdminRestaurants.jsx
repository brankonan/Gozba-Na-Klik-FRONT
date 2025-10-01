import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getAllRestaurants,
  updateRestaurant,
  deleteRestaurant,
  createRestaurant,
  getAllOwners,
} from "../../api/adminService";

import RestaurantForm from "./components/RestaurantForm";
import RestaurantTable from "./components/RestaurantTable";

const AdminRestaurants = () => {
    const navigate = useNavigate();

    const [restaurants, setRestaurants] = useState([]);
    const [owners, setOwners] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingRestaurant, setEditingRestaurant] = useState(null);

    useEffect(() => {
        (async () => {
        try {
            const [r, o] = await Promise.all([getAllRestaurants(), getAllOwners()]);
            setRestaurants(r);
            setOwners(o);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load initial data.");
        }
        })();
    }, []);

    async function handleDelete(id) {
        try {
            await deleteRestaurant(id);
            setRestaurants((prev) => prev.filter((x) => x.id !== id));
            toast.success("Restaurant deleted successfully!");
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete restaurant.");
        }
    }

    function startCreate() {
        setEditingRestaurant(null);
        setShowForm(true);
    }

    function startEdit(restaurant) {
        setEditingRestaurant(restaurant);
        setShowForm(true);
    }

    function cancelForm() {
        setShowForm(false);
        setEditingRestaurant(null);
    }

  async function submitForm(data) {
    try {
        if (editingRestaurant) {
            const saved = await updateRestaurant(editingRestaurant.id, data);
            setRestaurants((prev) => prev.map((r) => (r.id === saved.id ? saved : r)));
            toast.success("Restaurant updated successfully!");
        } else {
            const saved = await createRestaurant(data);
            setRestaurants((prev) => [...prev, saved]);
            toast.success("Restaurant created successfully!");
        }
        cancelForm();
    } catch (err) {
        console.error(err);
        toast.error("Failed to save restaurant.");
    }
  }

  return (
    <div>
        <header className="navbar">
            <div className="navbar-inner">
            <div style={{ fontWeight: 800 }}>Restaurants·Management</div>
                <button className="btn btn-primary btn-sm" onClick={startCreate}>
                    Add new restaurant
                </button>
            </div>
        </header>

        <main className="section container">
            <RestaurantTable
                restaurants={restaurants}
                onEdit={startEdit}
                onDelete={handleDelete}
            />

            {showForm && (
            <RestaurantForm
                owners={owners}
                initialValues={editingRestaurant}
                onSubmit={submitForm}
                onCancel={cancelForm}
            />
            )}
        </main>

        <button className="btn btn-primary btn-sm" 
            onClick={() => navigate("/admin")}
            style={{margin: 60}}>
            ← Back
        </button>
        
    </div>
    );
};

export default AdminRestaurants;

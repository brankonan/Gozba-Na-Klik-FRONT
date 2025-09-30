import React, { useState , useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { getAllRestaurants, updateRestaurant, deleteRestaurant } from "../../api/adminService";
import { toast } from "react-toastify";



const AdminRestaurants = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const navigate = useNavigate();
    const [editingRestaurant, setEditingRestaurant] = useState(null);
    const { register, handleSubmit, formState: { errors }, reset } = useForm();

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

    async function handleDelete(id) {
        try {
            await deleteRestaurant(id);
            setRestaurants(restaurants.filter(r => r.id !== id));
            toast.success("Restaurant deleted successfully!");
        } catch (err) {
            console.error("Error deleting restaurant:", err);
            toast.error("Failed to delete restaurant.");
        }
    }

    function handleEditClick(restaurant) {
        setEditingRestaurant(restaurant);
        reset({
            name: restaurant.name,
            ownerId: restaurant.ownerId,
            photo: restaurant.photo || ""
        });
        setShowForm(true);
    }
    

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
                                    <td>Actions</td>
                                </tr>
                            </thead>
                            <tbody>
                                {restaurants.map((r)=>(
                                    <tr key={r.id}>
                                        <td>{r.id}</td>
                                        <td>{r.name}</td>
                                        <td>{r.ownerId}</td>
                                        <td>{r.ownerName}</td>
                                        <td>
                                            <button className="btn btn-edit"
                                                style={{marginRight:"15px"}}
                                                onClick={() => handleEditClick(r)}
                                                >Edit
                                            </button>
                                            <button className="btn btn-delete"
                                                onClick={() => handleDelete(r.id)}
                                                >Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>
            
          {showForm && editingRestaurant && (
            <form
                className="card card-pad stack"
                onSubmit={handleSubmit(async (data) => {
                try {
                const updated = await updateRestaurant(editingRestaurant.id, data);
                setRestaurants(restaurants.map(r => r.id === updated.id ? updated : r));
                setShowForm(false);
                setEditingRestaurant(null);
                toast.success("Restaurant updated successfully!");
                } catch (err) {
                console.error("Error updating restaurant:", err);
                toast.error("Failed to update restaurant.");
                }
                })}
            >
                <label className="label">Name</label>
                <input
                className="input"
                {...register("name", { required: "Name is required" })}
                />
                {errors.name && <p className="error">{errors.name.message}</p>}

                <label className="label">OwnerId</label>
                <input
                className="input"
                type="number"
                {...register("ownerId", {
                    required: "OwnerId is required",
                    valueAsNumber: true,
                    min: { value: 1, message: "OwnerId must be greater than 0" }
                })}
                />
                {errors.ownerId && <p className="error">{errors.ownerId.message}</p>}

                <label className="label">Photo</label>
                <input
                className="input"
                {...register("photo", { maxLength: { value: 255, message: "Photo URL too long" } })}
                />
                {errors.photo && <p className="error">{errors.photo.message}</p>}

                <button className="btn btn-primary" type="submit">
                Save changes
                </button>
            </form>
            )}

            <button
                className="btn btn-primary btn-sm"
                onClick={() => navigate("/admin")}>
                    ← Back
            </button>
        </div>
    );
};

export default AdminRestaurants;
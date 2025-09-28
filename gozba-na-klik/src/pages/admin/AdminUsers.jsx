import React, {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import { getAllUsers, createUser } from "../../api/adminService";

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [showForm, setShowForm] = useState(false);

    const { register, handleSubmit, reset, formState: {errors}} = useForm({
        defaultValues: {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        role: "Courier",
        },
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    async function fetchUsers() {
        try {
            const data = await getAllUsers();
            setUsers(data);
        } 
        catch (err) {
            console.error("Error occurred while loading users: ", err);
        }
    }

    const onSubmit = async (data) => {
        try {
            await createUser(data);
            await fetchUsers();
            reset();
            setShowForm(false);
        } 
        catch (err) {
            console.error("Error creating user:", err);
        }
    };

    return(
        <div>
            <nav style={{ background: "#333", padding: "1rem", color: "#fff" }}>
                <h2 style={{ margin: 0 }}>Users Management</h2>
            </nav> 
            <h2>Users:</h2>
            <button onClick={() => setShowForm(!showForm)}>
                {showForm ? "Close form" : "Add new user"}
            </button>

            {showForm && (
                <form onSubmit={handleSubmit(onSubmit)} style={{ margin: "1rem 0" }}>
                    <input
                        {...register("firstName", { required: "First name is required" })}
                        type="text"
                        placeholder="First Name"
                    />
                    {errors.firstName && <p style={{ color: "red" }}>{errors.firstName.message}</p>}

                    <input
                        {...register("lastName", { required: "Last name is required"  })}
                        type="text"
                        placeholder="Last Name"
                    />
                    {errors.lastName && <p style={{ color: "red" }}>{errors.lastName.message}</p>}

                    <input
                        {...register("email", { required:"Email is required", 
                        pattern: { value: /^\S+@\S+$/i, message: "Invalid email format" }
                        })}
                        type="email"
                        placeholder="Email"
                    />
                    {errors.email && <p style={{ color: "red" }}>{errors.email.message}</p>}

                    <input
                        {...register("password", {  required: "Password is required", 
                            minLength: { value: 6, message: "Password must be at least 6 chars" }
                        })}
                        type="password"
                        placeholder="Password (min 6 chars)"
                    />
                    {errors.password && <p style={{ color: "red" }}>{errors.password.message}</p>}

                    <select {...register("role")}>
                        <option value="Courier">Courier</option>
                        <option value="RestaurantOwner">RestaurantOwner</option>
                    </select>
                    <button type="submit">Save</button>
                </form>
            )}

            <table 
                style={{
                    width: "100%", 
                    border: "1px solid #ccc", 
                    borderCollapse: "collapse", 
                    textAlign: "left" 
                }}
            >
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>E-mail</th>
                        <th>Role</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((u) => (
                        <tr key={u.id}>
                            <td>{u.id}</td>
                            <td>{u.username}</td>
                            <td>{u.email}</td>
                            <td>{u.role}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default AdminUsers;
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { updateAsync } from "../api/userService";
import UploadPhoto from "./UploadPhoto";
import CustomerProfileFields from "./CustomerProfileFields";

const EditProfile = () => {
    const [user, setUser] = useState(null);
    const [editingField, setEditingField] = useState(null);

    const { register, formState: { errors }, reset, handleSubmit } = useForm({
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            allergens: []
        }
    });


    useEffect(() => {
        const userStorageData = JSON.parse(localStorage.getItem("user"));
        setUser(userStorageData);
        reset(userStorageData);
    }, [])

    const onSubmit = async (data) => {
        try {
            const updatedUser = await updateAsync(data, user.id);
            setUser(updatedUser);
            localStorage.setItem("user", JSON.stringify(updatedUser));
            window.location.reload();
            alert("Uspesno azuriran profil!");
        }
        catch (error) {
            alert("Doslo je do neocekivane greske, pokusajte ponovo!");
        }
    }

    return (
        <>
            <main className="section">
                <div className="container" style={{ maxWidth: 520 }}>
                    <div className="card card-pad stack">
                        <h2 style={{ margin: 0 }}>{user?.username}</h2>

                        <form onSubmit={handleSubmit(onSubmit)} noValidate className="stack">
                            <UploadPhoto />

                            <div>
                                <label className="label">First name</label>
                                <input
                                    className="input"
                                    disabled={editingField !== "firstName"}
                                    {...register("firstName", { required: "Obavezno polje" })}
                                />
                                <button
                                    type="button"
                                    onClick={() => setEditingField(editingField !== "firstName" ? "firstName" : null)}
                                    className="btn btn-outline"
                                >
                                    {editingField === "firstName" ? "Lock" : "Edit"}
                                </button>

                                {errors.firstName && (<span className="error">{errors.firstName.message}</span>)}
                            </div>

                            <div>
                                <label className="label">Last name</label>
                                <input
                                    className="input"
                                    disabled={editingField !== "lastName"}
                                    {...register("lastName", { required: "Obavezno polje" })}
                                />
                                {errors.lastName && (<span className="error">{errors.lastName.message}</span>)}
                            </div>
                            <button
                                type="button"
                                onClick={() => setEditingField(editingField !== "lastName" ? "lastName" : null)}
                                className="btn btn-outline"
                            >
                                {editingField === "lastName" ? "Lock" : "Edit"}
                            </button>


                            <div>
                                <label className="label">Email</label>
                                <input
                                    className="input"
                                    type="email"
                                    disabled={editingField !== "email"}
                                    {...register("email", {
                                        required: "Obavezno polje",
                                        pattern: {
                                            value: /\S+@\S+\.\S+/,
                                            message: "Neispravan email",
                                        },
                                    })}
                                />
                                {errors.email && (<span className="error">{errors.email.message}</span>)}
                            </div>

                            <button
                                type="button"
                                className="btn btn-outline"
                                onClick={() => setEditingField(editingField !== "email" ? "email" : null)}
                            >
                                {editingField === "email" ? "Lock" : "Edit"}
                            </button>

                            {user?.role === "Customer" && <CustomerProfileFields register={register} errors={errors}/>}   

                            <button type="submit">Azuriraj profil</button>
                        </form>
                    </div>
                </div>
            </main>
        </>
    )
}

export default EditProfile;
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { updateAsync } from "../api/userService";
import UploadPhoto from "./UploadPhoto";
import CustomerProfileFields from "./CustomerProfileFields";
import Allergens from "./Allergens";

const EditProfile = () => {
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [refreshAllergens, setRefreshAllergens] = useState(false);

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
        if(!isEditing)
        {
            setIsEditing(true);
            return;
        }
        
        try {
            const updatedUser = await updateAsync(data, user.id);
            setUser(updatedUser);
            localStorage.setItem("user", JSON.stringify(updatedUser));

            setRefreshAllergens(prev => !prev)

            alert("Uspesno azuriran profil!");

        }
        catch (error) {
            alert("Doslo je do neocekivane greske, pokusajte ponovo!");
        }

        setIsEditing(false);
    }

    return (
        <>
            <main className="section">
                <div className="container" style={{ maxWidth: 520 }}>
                    <div className="card card-pad stack">
                        <h2 style={{ margin: 0 }}>{user?.username}</h2>

                        <form className={`stack ${isEditing ? "editing" : ""}`} onSubmit={handleSubmit(onSubmit)} noValidate >
                            <UploadPhoto />

                            <div>
                                <label className="label">First name</label>
                                <input
                                    className="input"
                                    disabled={!isEditing}
                                    {...register("firstName", { required: "Obavezno polje" })}
                                />
                                {errors.firstName && (<span className="error">{errors.firstName.message}</span>)}
                            </div>

                            <div>
                                <label className="label">Last name</label>
                                <input
                                    className="input"
                                    disabled={!isEditing}
                                    {...register("lastName", { required: "Obavezno polje" })}
                                />
                                {errors.lastName && (<span className="error">{errors.lastName.message}</span>)}
                            </div>

                            <div>
                                <label className="label">Email</label>
                                <input
                                    className="input"
                                    type="email"
                                    disabled={!isEditing}
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

                            {isEditing && user?.role === "Customer" &&  <CustomerProfileFields register={register} errors={errors} />}
                            {!isEditing && user?.id && <Allergens userId={user.id} refresh={refreshAllergens} />}

                            <button type="submit" className="btn btn-outline">
                                {isEditing ? "Sacuvaj izmene" : "Uredi profil"}
                            </button>
                        </form>
                    </div>
                </div>
            </main>
        </>
    )
}

export default EditProfile;
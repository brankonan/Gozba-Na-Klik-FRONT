import React, {useEffect} from "react";
import { useForm } from "react-hook-form";

export default function RestaurantForm({owners,initialValues, onSubmit, onCancel}) {
    const isEdit = Boolean(initialValues?.id);

    const {register, handleSubmit, formState: {errors, isSubmitting}, reset}= useForm({
        defaultValues: {
            name: "",
            ownerId: "",
            photo: ""
        },
    });

    useEffect(() => {
        if(initialValues) {
            reset({
                name:initialValues.name ?? "",
                ownerId: initialValues.ownerId ?? "",
                photo: initialValues.photo ?? "",
            });
        }else{
            reset({name: "", ownerId: "", photo: ""});
        }
    }, [initialValues, reset]);


    return (
        <form className="card card-pad stack" onSubmit={handleSubmit((data) => {
            const formData = { ...data, ownerId: Number(data.ownerId) || 0 };
            return onSubmit(formData);})}
        >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ margin: 0 }}>{isEdit ? "Edit Restaurant" : "Add Restaurant"}</h3>
                <button type="button" className="btn" onClick={onCancel}>✖</button>
            </div>

            <label className="label">Name</label>
            <input
                className="input"
                {...register("name", { required: "Name is required" })}
            />
            {errors.name && <p className="error">{errors.name.message}</p>}

            <label className="label">Owner</label>
            <select
                className="input"
                {...register("ownerId", { required: "Owner is required" })}
            >
                <option value="">-- Select owner --</option>
                {owners.map((o) => (
                <option 
                    key={o.id} 
                    value={o.id}>
                    {o.firstName} {o.lastName}
                </option>
                ))}
            </select>
            {errors.ownerId && <p className="error">{errors.ownerId.message}</p>}

            <label className="label">Photo URL</label>
            <input
                className="input"
                {...register("photo", {
                maxLength: { value: 255, message: "Photo URL too long" },
                })}
            />
            {errors.photo && <p className="error">{errors.photo.message}</p>}

            <div style={{ display: "flex", gap: 12 }}>
                <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
                {isEdit ? "Save changes" : "Create restaurant"}
                </button>
                <button className="btn" type="button" onClick={onCancel}>Cancel</button>
            </div>
        </form>
    );
}
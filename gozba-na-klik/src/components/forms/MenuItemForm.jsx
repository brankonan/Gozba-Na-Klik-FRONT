import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import "../../styles/EditMenuItem.scss";

const MenuItemForm = ({ item, onClose, onSave }) => {

    const { register, handleSubmit, reset } = useForm({
        defaultValues: {
            name: "",
            description: "",
            price: 0,
        },
    });

    useEffect(() => {
        reset(item);
    }, [item]);

    const onSubmit = (data) => {
        onSave({ ...item, ...data });
    };

    if (!item) return null;

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>Izmeni jelo</h2>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <label>
                        Naziv:
                        <input
                            className="input"
                            type="text"
                            {...register("name", { required: true })} />
                    </label>

                    <label>
                        Opis:
                        <textarea
                            className="input"
                            {...register("description", { required: true })}
                        />
                    </label>

                    <label>
                        Cena (RSD):
                        <input
                            className="input"
                            type="number"
                            {...register("price", { required: true, min: 1 })}
                        />
                    </label>

                    <label>
                        Putanja fotograije:
                        <input
                            className="input"
                            type="text"
                            {...register("photoPath")}
                        />
                    </label>


                    <div className="modal-actions">
                        <button type="submit" className="btn btn-edit">Sacuvaj</button>
                        <button type="button" className="btn btn-delete" onClick={onClose}>Otkazi</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MenuItemForm;

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import "../../styles/EditMenuItem.scss";

const MenuItemForm = ({ item, onClose, handleSave }) => {

    const { register, handleSubmit, reset } = useForm({
        defaultValues: {
            name: "",
            description: "",
            price: 0,
            photoPath: "",
        },
    });

    useEffect(() => {
        reset(item);
    }, [item, reset]);

    const onSubmit = (data) => {
        handleSave(data);
    };

    if (!item) return null;
    const isEdit = !!item.id;

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>{isEdit ? "Izmeni jelo" : "Kreiraj novo jelo"}</h2>
                
                <form onSubmit={handleSubmit(onSubmit)}>
                    <label>
                        Naziv:
                        <input
                            className="input"
                            type="text"
                            {...register("name", { required: true })} />
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
            Putanja fotografije:
            <input className="input" type="text" {...register("photoPath")} />
          </label>

          <div className="modal-actions">
            <button type="submit" className="btn btn-edit">
              Sacuvaj
            </button>
            <button type="button" className="btn btn-delete" onClick={onClose}>
              Otkazi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MenuItemForm;

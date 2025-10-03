import React from "react";

const CustomerProfileFields = ({ register, errors }) => {
    
    const allergenCategories = ["Fish", "Peanuts", "Shellfish", "Gluten", "Eggs", "Lactose", "Soy", "Nuts"];

    return (
        <div>
            <label className="label">Alergeni</label>
            <div className="stack">
                {allergenCategories.map((category) => (
                    <label key={category} className="checkbox-label">
                        <input
                            type="checkbox"
                            value={category}
                            {...register("allergens")}
                        />
                        {category}
                    </label>
                ))}
            </div>
            {errors.allergens && (<span className="error">{errors.allergens.message}</span>)}
        </div>)
}

export default CustomerProfileFields;
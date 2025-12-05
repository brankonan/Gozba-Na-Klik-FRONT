import React from "react";

// dodatna polja u edit profilu specificna za Customer
const CustomerProfileFields = ({ register, errors }) => {
  const allergenCategories = [
    { value: "Fish", label: "Riba" },
    { value: "Peanuts", label: "Kikiriki" },
    { value: "Shellfish", label: "Školjke" },
    { value: "Gluten", label: "Gluten" },
    { value: "Eggs", label: "Jaja" },
    { value: "Lactose", label: "Laktoza" },
    { value: "Soy", label: "Soja" },
    { value: "Nuts", label: "Orašasti plodovi" },
  ];

  return (
    <section className="profile-section">
      <div className="profile-section__header">
        <label className="label">Alergeni</label>
        <p className="profile-section__hint">
          Odaberi sastojke na koje si alergičan, kako bismo ti istakli jela koja
          treba da izbegavaš.
        </p>
      </div>

      <div className="profile-allergens">
        {allergenCategories.map((category) => (
          <label key={category.value} className="profile-allergens__item">
            <input
              type="checkbox"
              value={category.value}
              {...register("allergens")}
              className="profile-allergens__checkbox"
            />
            <span className="profile-allergens__pill-label">
              {category.label}
            </span>
          </label>
        ))}
      </div>

      {errors.allergens && (
        <span className="error">{errors.allergens.message}</span>
      )}
    </section>
  );
};

export default CustomerProfileFields;

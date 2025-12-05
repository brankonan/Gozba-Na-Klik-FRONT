import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { updateAsync } from "../../../api/userService";
import UploadPhoto from "../UploadPhoto";
import CustomerProfileFields from "./CustomerProfileFields";
import Allergens from "../../LoadAllergens";
import "../../../styles/Profile.scss";

const EditProfile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [refreshAllergens, setRefreshAllergens] = useState(false);

  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      allergens: [],
    },
  });

  useEffect(() => {
    const userStorageData = JSON.parse(localStorage.getItem("user"));
    if (userStorageData) {
      setUser(userStorageData);
      reset(userStorageData);
    }
  }, [reset]);

  const onSubmit = async (data) => {
    // prvi klik samo otvara edit mod
    if (!isEditing) {
      setIsEditing(true);
      return;
    }

    try {
      const updatedUser = await updateAsync(data, user.id);
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setRefreshAllergens((prev) => !prev);
      alert("Uspešno ažuriran profil!");
    } catch (error) {
      console.error(error);
      alert("Došlo je do neočekivane greške, pokušaj ponovo!");
    }

    setIsEditing(false);
  };

  const roleLabel =
    user?.role === "Customer"
      ? "Kupac"
      : user?.role === "RestaurantOwner"
      ? "Vlasnik restorana"
      : user?.role === "Courier"
      ? "Kurir"
      : user?.role === "Employee"
      ? "Zaposleni"
      : user?.role || "";

  return (
    <main className="profile-page">
      <div className="profile-page__inner">
        <div className="profile-card card-pad stack profile-form">
          <header className="profile-card__header">
            <div>
              <h2 className="profile-card__title">
                {user?.username || "Moj profil"}
              </h2>
              <p className="profile-card__subtitle">
                Ažuriraj svoje podatke i alergene kako bi poručivanje bilo
                bezbednije i brže.
              </p>
            </div>

            {roleLabel && (
              <span className="profile-card__role-badge">{roleLabel}</span>
            )}
          </header>

          <form
            className={`profile-form__body stack ${isEditing ? "editing" : ""}`}
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            <div className="profile-form__avatar-row">
              <UploadPhoto />
            </div>

            <div className="profile-form__grid">
              <div className="profile-form__field">
                <label className="label">Ime</label>
                <input
                  className="input"
                  disabled={!isEditing}
                  {...register("firstName", { required: "Obavezno polje" })}
                />
                {errors.firstName && (
                  <span className="error">{errors.firstName.message}</span>
                )}
              </div>

              <div className="profile-form__field">
                <label className="label">Prezime</label>
                <input
                  className="input"
                  disabled={!isEditing}
                  {...register("lastName", { required: "Obavezno polje" })}
                />
                {errors.lastName && (
                  <span className="error">{errors.lastName.message}</span>
                )}
              </div>

              <div className="profile-form__field profile-form__field--full">
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
                {errors.email && (
                  <span className="error">{errors.email.message}</span>
                )}
              </div>
            </div>

            {isEditing && user?.role === "Customer" && (
              <CustomerProfileFields register={register} errors={errors} />
            )}

            {!isEditing && user?.id && (
              <section className="profile-section">
                <h3 className="profile-section__title">Tvoji alergeni</h3>
                <div className="profile-allergens-view">
                  <Allergens userId={user.id} refresh={refreshAllergens} />
                </div>
              </section>
            )}

            <footer className="profile-form__footer">
              <button type="submit" className="btn btn--primary">
                {isEditing ? "Sačuvaj izmene" : "Uredi profil"}
              </button>
            </footer>
          </form>
        </div>
      </div>
    </main>
  );
};

export default EditProfile;

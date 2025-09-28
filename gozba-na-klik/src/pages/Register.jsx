import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

export default function Register() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { firstName: "", lastName: "", email: "", password: "", confirmPassword: "" },
  });

  const password = watch("password") || "";
  const confirmPassword = watch("confirmPassword") || "";
  const hasMinLen = password.length >= 6;
  const hasDigit = /\d/.test(password);
  const hasSymbol = /[!#?]/.test(password);
  const confirmMatches = password.length > 0 && confirmPassword === password;


  const onSubmit = async (data) => {
    try {
      const { firstName, lastName, email, password } = data;
      await api.post("/auth/register", { firstName, lastName, email, password });
      navigate("/login");
    } catch (e) {
      alert("Registracija neuspešna. Proveri podatke ili pokušaj kasnije.");
    }
  };
                  /* //  Ostavljam tebi da se igras sa placeholderom za registar ime, prezime itd  */
  return (
    <div style={{ maxWidth: 440, margin: "60px auto" }}>
      <h2>Registracija</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: "grid", gap: 12 }}>
        <label>
          First name
          <input
            {...register("firstName", { required: "Obavezno polje" })}
            placeholder="npr. Vuk"
          />
          {errors.firstName && <small style={{ color: "crimson" }}>{errors.firstName.message}</small>}
        </label>

        <label>
          Last name
          <input
            {...register("lastName", { required: "Obavezno polje" })}
            placeholder="npr. Karadžić"
          />
          {errors.lastName && <small style={{ color: "crimson" }}>{errors.lastName.message}</small>}
        </label>

        <label>
          Email
          <input
            type="email"
            {...register("email", {
              required: "Obavezno polje",
              pattern: { value: /\S+@\S+\.\S+/, message: "Neispravan email" },
            })}
           placeholder="example@gmail.com"
          />
          {errors.email && <small style={{ color: "crimson" }}>{errors.email.message}</small>}
        </label>
                        {/* Prepustam ti da odlucis da li treba example@gmail.com ili da bude ovako ili nikako */}
        <label>
          Password
          <input
            type="password"
            {...register("password", {
              required: "Obavezno polje",
              minLength: { value: 6, message: "Minimum 6 karaktera" },
              validate: {
                hasDigit: (v) => /\d/.test(v) || "Mora sadržati bar jedan broj",
                hasSymbol: (v) => /[!#?]/.test(v) || "Mora sadržati bar jedan od !#?",
              },
            })}
            placeholder="********"
          />
          {errors.password && <small style={{ color: "crimson" }}>{errors.password.message}</small>}
        </label>
        
        <div style={{ fontSize: 12, lineHeight: 1.6 }}>
          <div style={{ color: hasMinLen ? "green" : "#666" }}>• najmanje 6 karaktera</div>
          <div style={{ color: hasDigit ? "green" : "#666" }}>• najmanje jedan broj</div>
          <div style={{ color: hasSymbol ? "green" : "#666" }}>• najmanje jedan tvrdi znak npr.:!,#,?</div>
        </div>

        <label>
            {/* P O T V R D A     L O Z I N K E */}
          Potvrdi lozinku   
          <input
            type="password"
            {...register("confirmPassword", {
              required: "Obavezno polje",
              validate: (v) => v === watch("password") || "Lozinke se ne poklapaju",
            })}
            placeholder="********"
          />
          {errors.confirmPassword && (
            <small style={{ color: "crimson" }}>{errors.confirmPassword.message}</small>
          )}
        </label>

        <button
          type="submit"
          disabled={
            isSubmitting || !(hasMinLen && hasDigit && hasSymbol && confirmMatches)
          }
        >
          {isSubmitting ? "Slanje..." : "Registruj se"}
        </button>
      </form>

      <p style={{ marginTop: 12 }}>
        Već imaš nalog? <Link to="/login">Prijava</Link>
      </p>

      <p style={{ marginTop: 8 }}>
        Vrati se na pocetak
        <button style={{ marginLeft: 8 }} onClick={() => navigate("/")}>Pocetak</button>
      </p>
    </div>
  );
}

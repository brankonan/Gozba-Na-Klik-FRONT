import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import "../styles/index.scss";

export default function Register() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password") || "";
  const confirmPassword = watch("confirmPassword") || "";
  const hasMinLen = password.length >= 6;
  const hasDigit = /\d/.test(password);
  const hasSymbol = /[!#?]/.test(password);
  const confirmMatches = password.length > 0 && confirmPassword === password;

  const onSubmit = async (data) => {
    try {
      const { firstName, lastName, username, email, password, confirmPassword } = data;
      await api.post("/Auth/register", {
        firstName,
        lastName,
        username,
        email,
        password,
        confirmPassword
      });
      navigate("/login");
    } catch (e) {
      alert("Registracija neuspešna. Proveri podatke ili pokušaj kasnije.");
    }
  };
  /* //  Ostavljam tebi da se igras sa placeholderom za registar ime, prezime itd  */
  return (
    <main className="section">
      <div className="container" style={{ maxWidth: 520 }}>
        <div className="card card-pad stack">
          <h2 style={{ margin: 0 }}>Registracija</h2>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="stack">
            <div>
              <label className="label">First name</label>
              <input
                className="input"
                {...register("firstName", { required: "Obavezno polje" })}
                placeholder="npr. Vuk"
              />
              {errors.firstName && (
                <span className="error">{errors.firstName.message}</span>
              )}
            </div>

            <div>
              <label className="label">Last name</label>
              <input
                className="input"
                {...register("lastName", { required: "Obavezno polje" })}
                placeholder="npr. Karadžić"
              />
              {errors.lastName && (
                <span className="error">{errors.lastName.message}</span>
              )}
            </div>

            <div>
              <label className="label">Username</label>
              <input
                className="input"
                {...register("username", { required: "Obavezno polje" })}
                placeholder="npr. Debilovanovic"
              />
              {errors.lastName && (
                <span className="error">{errors.username.message}</span>
              )}
            </div>

            <div>
              <label className="label">Email</label>
              <input
                className="input"
                type="email"
                {...register("email", {
                  required: "Obavezno polje",
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: "Neispravan email",
                  },
                })}
                placeholder="example@gmail.com"
              />
              {errors.email && (
                <span className="error">{errors.email.message}</span>
              )}
            </div>

            <div>
              <label className="label">Password</label>
              <input
                className="input"
                type="password"
                {...register("password", {
                  required: "Obavezno polje",
                  minLength: { value: 6, message: "Minimum 6 karaktera" },
                  validate: {
                    hasDigit: (v) =>
                      /\d/.test(v) || "Mora sadržati bar jedan broj",
                    hasSymbol: (v) =>
                      /[!#?]/.test(v) || "Mora sadržati bar jedan simbol",
                  },
                })}
                placeholder="********"
              />
              {errors.password && (
                <span className="error">{errors.password.message}</span>
              )}
              <div className="help" style={{ marginTop: 6 }}>
                <div style={{ color: hasMinLen ? "green" : "#666" }}>
                  • najmanje 6 karaktera
                </div>
                <div style={{ color: hasDigit ? "green" : "#666" }}>
                  • najmanje jedan broj
                </div>
                <div style={{ color: hasSymbol ? "green" : "#666" }}>
                  • najmanje jedan od ! # ?
                </div>
              </div>
            </div>

            <div>
              <label className="label">Potvrdi lozinku</label>
              <input
                className="input"
                type="password"
                {...register("confirmPassword", {
                  required: "Obavezno polje",
                  validate: (v) =>
                    v === watch("password") || "Lozinke se ne poklapaju",
                })}
                placeholder="********"
              />
              {errors.confirmPassword && (
                <span className="error">{errors.confirmPassword.message}</span>
              )}
            </div>

            <div className="row">
              <button
                className="btn btn-primary"
                type="submit"
                disabled={
                  isSubmitting ||
                  !(hasMinLen && hasDigit && hasSymbol && confirmMatches)
                }
              >
                {isSubmitting ? "Slanje..." : "Registruj se"}
              </button>
              <Link to="/login" className="btn btn-outline">
                Prijava
              </Link>
            </div>
          </form>

          <div className="row" style={{ justifyContent: "space-between" }}>
            <span className="help">Već imaš nalog? Klik na „Prijava“.</span>
            <button
              className="btn btn-ghost"
              type="button"
              onClick={() => navigate("/")}
            >
              Početak
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

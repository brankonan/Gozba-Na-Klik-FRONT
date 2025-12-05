import React, { useEffect } from "react";
import "../../styles/index.scss";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { handleLogin } from "../../api/authService";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const location = useLocation();

  useEffect(() => {
    const flag = sessionStorage.getItem("resetSuccess");

    if (flag) {
      toast.success("Lozinka uspešno promenjena!");
      sessionStorage.removeItem("resetSuccess");
    }
  }, [location]);

  const onSubmit = (formData) => {
    handleLogin(navigate, formData);
  };

  return (
    <main className="section">
      <div className="container" style={{ maxWidth: 420 }}>
        <div className="card card-pad stack">
          <h2 style={{ margin: 0 }}>Prijava</h2>
          <p className="help" style={{ marginTop: 4 }}>
            Unesi email i lozinku da bi pristupio nalogu.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="stack" noValidate>
            <div>
              <label className="label">Email</label>
              <input
                className={`input ${errors.email ? "error" : ""}`}
                {...register("email", { required: "Email je obavezan" })}
                placeholder="email@example.com"
                type="email"
              />
              {errors.email && <p className="error">{errors.email.message}</p>}
            </div>

            <div>
              <label className="label">Lozinka</label>
              <input
                className="input"
                {...register("password", { required: "Lozinka je obavezna" })}
                placeholder="********"
                type="password"
              />
              {errors.password && (
                <p className="error">{errors.password.message}</p>
              )}
            </div>

            <button
              className="btn btn-primary btn-loading"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting && <span className="loader" />}
              {isSubmitting ? "Prijavljivanje..." : "Prijavi se"}
            </button>

            <button
              className="btn btn-outline"
              type="button"
              onClick={() => navigate("/")}
            >
              Početna
            </button>
          </form>

          <div
            className="row"
            style={{ marginTop: "1rem", justifyContent: "space-between" }}
          >
            <Link to="/forgot-password">Zaboravljena lozinka?</Link>
            <Link to="/register">Registracija</Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Login;

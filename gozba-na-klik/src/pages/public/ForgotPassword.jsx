import React from "react";
import { useForm } from "react-hook-form";
import api from "../../api/axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

export default function ForgotPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const res = await api.post("/auth/reset/request", { email: data.email });

      toast.info("Ako je email pronadjen, poslat je link za reset lozinke.", {
        icon: "📧",
      });

      if (res.data?.token) {
        navigate(`/reset-password?token=${res.data.token}`);
      } else {
        navigate("/login");
      }
    } catch (e) {
      toast.error("Greska prilikom slanja zahteva.");
    }
  };

  return (
    <main className="section">
      <div className="container" style={{ maxWidth: 420 }}>
        <div className="card card-pad stack">
          <h2>Zaboravljena lozinka</h2>
          <p className="help">
            Unesi email adresu. Ako nalog postoji, poslacemo ti link za reset
            lozinke.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="stack" noValidate>
            <div>
              <label className="label">Email</label>
              <input
                className="input"
                placeholder="email@example.com"
                type="email"
                {...register("email", { required: "Email je obavezan" })}
              />
              {errors.email && <p className="error">{errors.email.message}</p>}
            </div>

            <button
              className="btn btn-primary"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Slanje..." : "Posalji link za reset"}
            </button>

            <Link className="btn btn-outline" to="/login">
              Nazad na prijavu
            </Link>
          </form>
        </div>
      </div>
    </main>
  );
}

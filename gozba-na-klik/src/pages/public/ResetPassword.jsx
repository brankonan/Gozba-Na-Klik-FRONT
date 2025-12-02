import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import "../../styles/index.scss";
import api from "../../api/axios";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const token = params.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  if (!token) {
    return (
      <main className="section">
        <div className="container" style={{ maxWidth: 420 }}>
          <div className="card card-pad">
            <h2>Nevalidan link</h2>
            <p>Token nije pronadjen ili je istekao.</p>
            <button
              className="btn btn-primary"
              onClick={() => navigate("/login")}
            >
              Nazad na prijavu
            </button>
          </div>
        </div>
      </main>
    );
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!password || !confirm) {
      setError("Popunite oba polja.");
      return;
    }

    if (password !== confirm) {
      setError("Lozinke se ne poklapaju.");
      return;
    }

    try {
      setLoading(true);

      await api.post("/auth/reset/confirm", {
        token,
        newPassword: password,
      });

      setSuccess("Lozinka uspesno promenjena!");
      sessionStorage.setItem("resetSuccess", "1");
      navigate("/login");
    } catch (err) {
      setError("Link je nevalidan ili je istekao.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="section">
      <div className="container" style={{ maxWidth: 420 }}>
        <div className="card card-pad stack">
          <h2>Reset lozinke</h2>

          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}

          <form onSubmit={onSubmit} className="stack">
            <input
              className={`input ${
                password.length > 0 && password.length < 8 ? "error" : ""
              }`}
              type="password"
              placeholder="Nova lozinka"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <input
              className="input"
              type="password"
              placeholder="Potvrdi lozinku"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />

            <button
              className="btn btn-primary btn-loading"
              type="submit"
              disabled={loading}
            >
              {loading && <span className="loader"></span>}
              {loading ? "Snimam..." : "Promeni lozinku"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default ResetPassword;
